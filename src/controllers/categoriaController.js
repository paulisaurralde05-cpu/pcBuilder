import Categoria from '../models/categoria.js';

export const obtener = async (req, res) => {
    try {
        const data = await Categoria.findAll();
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener categorías',
            error: error.message,
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await Categoria.findByPk(id);

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Categoría no encontrada',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener categoría',
            error: error.message,
        });
    }
};

export const crear = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El nombre de la categoría es obligatorio',
            });
        }

        const data = await Categoria.create({ nombre, descripcion });
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear categoría',
            error: error.message,
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Categoría no encontrada',
            });
        }

        await categoria.update(req.body);
        res.json({
            estado: true,
            data: categoria,
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar categoría',
            error: error.message,
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Categoría no encontrada',
            });
        }

        await categoria.destroy();
        res.json({
            estado: true,
            mensaje: 'Categoría eliminada correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar categoría',
            error: error.message,
        });
    }
};