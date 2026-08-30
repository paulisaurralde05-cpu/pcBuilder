import Carrito from '../models/carrito.js';
import DetallesCarrito from '../models/detallesCarrito.js';
import Producto from '../models/producto.js';
import Imagen from '../models/imagen.js';

export const obtenerMiCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const [carrito] = await Carrito.findOrCreate({
            where: { idUsuario: usuarioId, estado: 'activo' },
            defaults: { idUsuario: usuarioId, fechaCreacion: new Date(), estado: 'activo' }
        });

        const data = await Carrito.findByPk(carrito.id, {
            include: {
                model: DetallesCarrito,
                as: 'detalles',
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

        const cant = parseInt(cantidad, 10) || 1;

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
            where: { idUsuario: usuarioId, estado: 'activo' },
            defaults: { idUsuario: usuarioId, fechaCreacion: new Date(), estado: 'activo' }
        });

        let detalle = await DetallesCarrito.findOne({
            where: { idCarrito: carrito.id, idProducto }
        });

        if (detalle) {
            detalle.cantidad += cant;
            detalle.precioUnitario = producto.precio;
            await detalle.save();
        } else {
            detalle = await DetallesCarrito.create({
                idCarrito: carrito.id,
                idProducto,
                cantidad: cant,
                precioUnitario: producto.precio
            });
        }

        res.status(201).json({
            estado: true,
            mensaje: 'Producto agregado al carrito',
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
            where: { idUsuario: usuarioId, estado: 'activo' }
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