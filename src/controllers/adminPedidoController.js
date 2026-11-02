import Pedido from "../models/pedido.js";
import DetallesPedido from "../models/detallesPedido.js";
import Usuario from "../models/usuario.js";
import Producto from "../models/producto.js";
import { mailCambioPedido } from "../services/emailService.js";
import { Op } from "sequelize";

export const getPedidos = async (req, res) => {
  try {
    const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
    const limite = Math.max(1, parseInt(req.query.limite, 10) || 5);
    const offset = (pagina - 1) * limite;

    const where = {};
    const busqueda = req.query.busqueda?.trim();

    if (busqueda) {
      const usuarios = await Usuario.findAll({
        attributes: ["id"],
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${busqueda}%` } },
            { apellido: { [Op.like]: `%${busqueda}%` } },
            { email: { [Op.like]: `%${busqueda}%` } },
          ],
        },
      });

      where[Op.or] = [
        { estado: { [Op.like]: `%${busqueda}%` } },
        { idUsuario: { [Op.in]: usuarios.map(({ id }) => id) } },
      ];
    }

    const { count, rows } = await Pedido.findAndCountAll({
      where,
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "email"],
        },
        {
          model: DetallesPedido,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre", "precio"],
            },
          ],
        },
      ],
      limit: limite,
      offset,
      distinct: true,
      order: [["fechaPedido", "DESC"]],
    });

    const totalPaginas = Math.ceil(count / limite) || 1;

    return res.status(200).json({
      estado: true,
      data: {
        pedidos: rows,
        total: count,
        pagina,
        limite,
        totalPaginas,
      },
    });

  } catch (error) {
    console.error("Error al obtener los pedidos:", error);

    return res.status(500).json({
      estado: false,
      mensaje: "Error al obtener los pedidos",
      error: error.message,
    });
  }
};
export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: DetallesPedido,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
            },
          ],
        },
        {
          model: Usuario,
        },
      ],
    });

    if (!pedido) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado",
      });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el pedido",
    });
  }
};
export const actualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        mensaje: "El estado es obligatorio",
      });
    }

    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado",
      });
    }

    pedido.estado = estado;
    await pedido.save();

    const usuario = await Usuario.findByPk(pedido.idUsuario);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    mailCambioPedido(usuario.email, pedido, estado);

    return res.status(200).json({
      mensaje: "Estado del pedido actualizado correctamente",
      pedido,
    });
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);

    return res.status(500).json({
      mensaje: "Error al actualizar el estado del pedido",
    });
  }
};
