import Producto from '../models/producto.js';
import Categoria from '../models/categoria.js';
import Imagen from '../models/imagen.js';
import { Op } from 'sequelize';

export const obtener = async (req, res) => {
    try {
        const data = await Producto.findAll({
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Imagen, as: 'imagenes' }
            ]
        });
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener productos',
            error: error.message,
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El id del producto debe ser numérico',
            });
        }

        const data = await Producto.findByPk(id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Imagen, as: 'imagenes' }
            ]
        });

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Producto no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener producto',
            error: error.message,
        });
    }
};

export const crear = async (req, res) => {
    try {
        const {
            idCategoria,
            nombre,
            marca,
            modelo,
            descripcion,
            precio,
            stock,
            socketCompatibilidad,
            especificacionesTecnicas
        } = req.body;

        if (!nombre || !precio || !idCategoria) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe ingresar nombre, precio y categoria.',
            });
        }

        const data = await Producto.create({
            idCategoria,
            nombre,
            marca,
            modelo,
            descripcion,
            precio,
            stock: stock || 0,
            socketCompatibilidad,
            especificacionesTecnicas
        });

        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear producto',
            error: error.message,
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Producto no encontrado',
            });
        }

        await producto.update(req.body);
        res.json({
            estado: true,
            data: producto,
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar producto',
            error: error.message,
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Producto no encontrado',
            });
        }

        await producto.destroy();
        res.json({
            estado: true,
            mensaje: 'Producto eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar producto',
            error: error.message,
        });
    }
};

export const buscar = async (req, res) => {
    try {
        const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
        const limite = Math.max(1, parseInt(req.query.limite, 10) || 5);
        const offset = (pagina - 1) * limite;
        const where = {};
        const busqueda = req.query.busqueda?.trim();
        console.log('BUSQUEDA', busqueda)
        if (busqueda) {
            where[Op.or] = [
                { nombre: { [Op.like]: `%${busqueda}%` } },
                { descripcion: { [Op.like]: `%${busqueda}%` } },
                { precio: { [Op.like]: `%${busqueda}%` } }
            ]
        }

        const { count, rows } = await Producto.findAndCountAll({
            where,
            limit: limite,
            offset,
            distinct: true,
            include: [
                { model: Categoria, as: 'categoria' },
            ]
        })
        const totalPaginas = Math.ceil(count / limite) || 1;
        res.json({
            estado: true,
            data: {
                productos: rows,
                total: count,
                pagina,
                limite,
                totalPaginas,
            }
        })
    } catch (error) {
        console.error('Error al buscar productos', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al buscar productos',
            error: error.message,
        });

    }
}