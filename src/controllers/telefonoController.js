import Telefono from '../models/telefono.js';

export const obtenerMisTelefonos = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const data = await Telefono.findAll({ where: { idUsuario: usuarioId } });

        res.json({
            estado: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener teléfonos:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener teléfonos',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { numero, tipo } = req.body;

        if (!numero) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El número de teléfono es obligatorio'
            });
        }

        const data = await Telefono.create({
            idUsuario: usuarioId,
            numero,
            tipo: tipo || 'Móvil'
        });

        res.status(201).json({
            estado: true,
            data
        });
    } catch (error) {
        console.error('Error al registrar teléfono:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al registrar teléfono',
            error: error.message
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const id = parseInt(req.params.id, 10);

        const telefono = await Telefono.findOne({ where: { id, idUsuario: usuarioId } });

        if (!telefono) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Teléfono no encontrado'
            });
        }

        await telefono.destroy();
        res.json({
            estado: true,
            mensaje: 'Teléfono eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar teléfono:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar teléfono',
            error: error.message
        });
    }
};