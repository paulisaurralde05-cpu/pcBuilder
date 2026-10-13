import Pedido from '../models/pedido.js';
import DetallesPedido from '../models/detallesPedido.js';
import Carrito from '../models/carrito.js';
import DetallesCarrito from '../models/detallesCarrito.js';
import Producto from '../models/producto.js';

export const obtenerMisPedidos = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const data = await Pedido.findAll({
            where: { idUsuario: usuarioId },
            include: {
                model: DetallesPedido,
                as: 'detalles',
                include: { model: Producto, as: 'producto' }
            },
            order: [['fechaPedido', 'DESC']]
        });

        res.json({
            estado: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener lista de pedidos',
            error: error.message
        });
    }
};

export const crearDesdeCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const carrito = await Carrito.findOne({
            where: { idUsuario: usuarioId, estado: true },
            include: { model: DetallesCarrito, as: 'items' }
        });

        if (!carrito || !carrito.items || carrito.items.length === 0) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El carrito está vacío o no existe'
            });
        }

        let totalCalculado = 0;
        carrito.items.forEach(item => {
            totalCalculado += parseFloat(item.subtotal);
        });

        const nuevoPedido = await Pedido.create({
            idUsuario: usuarioId,
            fechaPedido: new Date(),
            estado: 'Pendiente',
            total: totalCalculado
        });

        for (const item of carrito.items) {
            await DetallesPedido.create({
                idPedido: nuevoPedido.id,
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                precioUnitario: parseFloat(item.subtotal) / item.cantidad
            });
        }

        carrito.estado = false;
        await carrito.save();

        res.status(201).json({
            estado: true,
            mensaje: 'Pedido creado exitosamente',
            data: nuevoPedido
        });
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al procesar la compra',
            error: error.message
        });
    }
};