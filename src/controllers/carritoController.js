import Carrito from '../models/carrito.js';
import DetallesCarrito from '../models/detallesCarrito.js';
import Producto from '../models/producto.js';
import Imagen from '../models/imagen.js';

export const obtenerMiCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [carrito] = await Carrito.findOrCreate({
      where: { idUsuario: usuarioId, estado: true },
      defaults: { idUsuario: usuarioId, fechaActualizacion: new Date(), estado: true }
    });

    const data = await Carrito.findByPk(carrito.id, {
      include: {
        model: DetallesCarrito,
        as: 'items',
        include: {
          model: Producto,
          as: 'producto',
          include: [{ model: Imagen, as: 'imagenes' }]
        }
      }
    });

    res.json({
      estado: true,
      data
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({
      estado: false,
      mensaje: 'Error al obtener el carrito',
      error: error.message
    });
  }
};

export const agregarProducto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { idProducto, cantidad } = req.body;
    const cant = parseInt(cantidad, 10);

    if (isNaN(cant) || cant === 0) {
      return res.status(400).json({
        estado: false,
        mensaje: 'Debe proporcionar una cantidad válida diferente de 0'
      });
    }

    if (!idProducto) {
      return res.status(400).json({
        estado: false,
        mensaje: 'Debe proporcionar un idProducto'
      });
    }

    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({
        estado: false,
        mensaje: 'Producto no encontrado'
      });
    }

    const [carrito] = await Carrito.findOrCreate({
      where: { idUsuario: usuarioId, estado: true },
      defaults: { idUsuario: usuarioId, fechaActualizacion: new Date(), estado: true }
    });

    let detalle = await DetallesCarrito.findOne({
      where: { idCarrito: carrito.id, idProducto }
    });

    if (detalle) {
      const nuevaCantidad = detalle.cantidad + cant;

      if (nuevaCantidad <= 0) {
        await detalle.destroy();
        return res.json({
          estado: true,
          mensaje: 'Producto eliminado del carrito'
        });
      }

      detalle.cantidad = nuevaCantidad;
      detalle.subtotal = Number(producto.precio) * nuevaCantidad;
      await detalle.save();
    } else {
      if (cant < 1) {
        return res.status(400).json({
          estado: false,
          mensaje: 'La cantidad inicial debe ser mayor a cero'
        });
      }

      detalle = await DetallesCarrito.create({
        idCarrito: carrito.id,
        idProducto,
        cantidad: cant,
        subtotal: Number(producto.precio) * cant
      });
    }

    res.status(200).json({
      estado: true,
      mensaje: 'Carrito actualizado correctamente',
      data: detalle
    });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({
      estado: false,
      mensaje: 'Error al agregar producto al carrito',
      error: error.message
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const idProducto = parseInt(req.params.idProducto, 10);

    const carrito = await Carrito.findOne({
      where: { idUsuario: usuarioId, estado: true }
    });

    if (!carrito) {
      return res.status(404).json({
        estado: false,
        mensaje: 'Carrito no encontrado'
      });
    }

    const eliminados = await DetallesCarrito.destroy({
      where: { idCarrito: carrito.id, idProducto }
    });

    if (eliminados === 0) {
      return res.status(404).json({
        estado: false,
        mensaje: 'El producto no estaba en el carrito'
      });
    }

    res.json({
      estado: true,
      mensaje: 'Producto eliminado del carrito'
    });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({
      estado: false,
      mensaje: 'Error al eliminar producto del carrito',
      error: error.message
    });
  }
};