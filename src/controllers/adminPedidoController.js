import Pedido from "../models/pedido.js";
import DetallesPedido from "../models/detallesPedido.js";
import Usuario from "../models/usuario.js";
import Producto from "../models/producto.js";
import { mailCambioPedido } from '../services/emailService.js';

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: DetallesPedido,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['id', 'nombre', 'precio',]
            }
          ]
        }
      ],
    });

    return res.status(200).json(pedidos);

  } catch (error) {
    console.error('Error al obtener los pedidos:', error);

    return res.status(500).json({
      message: 'Error al obtener los pedidos'
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
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto',
            }
          ]
        },
        {
          model: Usuario,
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({
        mensaje: 'Pedido no encontrado'
      });
    }

    return res.status(200).json(pedido);

  } catch (error) {
    console.error('Error al obtener el pedido:', error);

    return res.status(500).json({
      mensaje: 'Error al obtener el pedido'
    });
  }
}
export const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                mensaje: 'El estado es obligatorio'
            });
        }

        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
            });
        }

        pedido.estado = estado;
        await pedido.save();

        return res.status(200).json({
            mensaje: 'Estado del pedido actualizado correctamente',
            pedido
        });

    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);

        return res.status(500).json({
            mensaje: 'Error al actualizar el estado del pedido'
        });
    }
};
