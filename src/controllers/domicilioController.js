import Domicilio from '../models/domicilio.js';

export const obtenerMisDomicilios = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const data = await Domicilio.findAll({
            where: { idUsuario: usuarioId }
        });

        res.json({
            estado: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener domicilios:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener domicilios',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { calle, numero, piso, departamento, ciudad, codigoPostal, provincia } = req.body;

        if (!calle || !numero || !ciudad) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Calle, número y ciudad son obligatorios'
            });
        }

        const data = await Domicilio.create({
            idUsuario: usuarioId,
            calle,
            numero,
            piso,
            departamento,
            ciudad,
            codigoPostal,
            provincia
        });

        res.status(201).json({
            estado: true,
            data
        });
    } catch (error) {
        console.error('Error al crear domicilio:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear domicilio',
            error: error.message
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const id = parseInt(req.params.id, 10);

        const domicilio = await Domicilio.findOne({
            where: { id, idUsuario: usuarioId }
        });

        if (!domicilio) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Domicilio no encontrado'
            });
        }

        await domicilio.destroy();
        res.json({
            estado: true,
            mensaje: 'Domicilio eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar domicilio:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar domicilio',
            error: error.message
        });
    }
};