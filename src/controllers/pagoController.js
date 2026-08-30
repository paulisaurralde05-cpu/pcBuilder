import Pago from '../models/pago.js';
import Pedido from '../models/pedido.js';

export const obtenerPorPedido = async (req, res) => {
    try {
        const idPedido = parseInt(req.params.idPedido, 10);
        const data = await Pago.findAll({ where: { idPedido } });

        res.json({
            estado: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener pago:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener el pago',
            error: error.message
        });
    }
};

export const registrarPago = async (req, res) => {
    try {
        const { idPedido, metodoPago, monto } = req.body;

        if (!idPedido || !metodoPago || !monto) {
            return res.status(400).json({
                estado: false,
                mensaje: 'id del pedido, metodo pago y monto son obligatorios.'
            });
        }

        const pedido = await Pedido.findByPk(idPedido);
        if (!pedido) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Pedido no encontrado'
            });
        }

        const data = await Pago.create({
            idPedido,
            metodoPago,
            monto,
            fechaPago: new Date(),
            estadoPago: 'Aprobado'
        });

        pedido.estado = 'Pagado';
        await pedido.save();

        res.status(201).json({
            estado: true,
            mensaje: 'Pago registrado exitosamente',
            data
        });
    } catch (error) {
        console.error('Error al registrar pago:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al registrar el pago',
            error: error.message
        });
    }
};