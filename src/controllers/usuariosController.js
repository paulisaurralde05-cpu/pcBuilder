import Usuario from '../models/usuario.js';

export const obtener = async (req, res) => {
    try {
        const data = await Usuario.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener usuarios',
            error: error.message,
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await Usuario.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener usuario',
            error: error.message,
        });
    }
};

export const crear = async (req, res) => {
    try {
        const data = await Usuario.create(req.body);

        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear usuario',
            error: error.message,
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        await usuario.update(req.body);
        res.json({
            estado: true,
            data: usuario,
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar usuario',
            error: error.message,
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        await usuario.destroy();
        res.json({
            estado: true,
            mensaje: 'Usuario eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar usuario',
            error: error.message,
        });
    }
};