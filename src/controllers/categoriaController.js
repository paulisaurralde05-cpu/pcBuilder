import { Op } from "sequelize";
import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";

// GET /categorias
export const obtener = async (req, res) => {
    try {
        const data = await Categoria.findAll({
            order: [["nombre", "ASC"]],
        });
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({
            estado: false,
            mensaje: "Error al obtener categorías",
            error: error.message,
        });
    }
};

// GET /categorias/:id
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                estado: false,
                mensaje: "El id debe ser numérico",
            });
        }

        const data = await Categoria.findByPk(id);
        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: "Categoría no encontrada",
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error("Error al obtener categoría:", error);
        res.status(500).json({
            estado: false,
            mensaje: "Error al obtener categoría",
            error: error.message,
        });
    }
};

// POST /categorias
export const crear = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                estado: false,
                mensaje: "El nombre de la categoría es obligatorio",
            });
        }

        // Evitar duplicados por nombre 
        const existe = await Categoria.findOne({
            where: { nombre: nombre.trim() },
        });
        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: "Ya existe una categoría con ese nombre",
            });
        }

        const data = await Categoria.create({
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || null,
        });

        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error("Error al crear categoría:", error);
        res.status(400).json({
            estado: false,
            mensaje: "Error al crear categoría",
            error: error.message,
        });
    }
};

// PUT /categorias/:id
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                estado: false,
                mensaje: "El id debe ser numérico",
            });
        }

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                estado: false,
                mensaje: "Categoría no encontrada",
            });
        }

        const { nombre, descripcion } = req.body;
        const updateData = {};

        if (nombre !== undefined) {
            if (!nombre.trim()) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "El nombre no puede estar vacío",
                });
            }
            // Si cambia el nombre, revisar que no haya otra con ese nombre
            if (nombre.trim() !== categoria.nombre) {
                const existe = await Categoria.findOne({
                    where: { nombre: nombre.trim() },
                });
                if (existe) {
                    return res.status(400).json({
                        estado: false,
                        mensaje: "Ya existe otra categoría con ese nombre",
                    });
                }
            }
            updateData.nombre = nombre.trim();
        }

        if (descripcion !== undefined) {
            updateData.descripcion = descripcion?.trim() || null;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                estado: false,
                mensaje: "No se enviaron campos para actualizar",
            });
        }

        await categoria.update(updateData);

        res.json({
            estado: true,
            data: categoria,
        });
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        res.status(400).json({
            estado: false,
            mensaje: "Error al actualizar categoría",
            error: error.message,
        });
    }
};

// DELETE /categorias/:id
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                estado: false,
                mensaje: "El id debe ser numérico",
            });
        }

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                estado: false,
                mensaje: "Categoría no encontrada",
            });
        }

        const productosAsociados = await Producto.count({
            where: { idCategoria: id },
        });
        if (productosAsociados > 0) {
            return res.status(409).json({
                estado: false,
                mensaje: `No se puede eliminar: hay ${productosAsociados} producto(s) en esta categoría. Reasignalos primero.`,
            });
        }

        await categoria.destroy();
        res.json({
            estado: true,
            mensaje: "Categoría eliminada correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        res.status(500).json({
            estado: false,
            mensaje: "Error al eliminar categoría",
            error: error.message,
        });
    }
};

// GET /categorias/buscar?pagina=1&lim...
export const buscar = async (req, res) => {
    try {
        const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
        const limite = Math.max(1, parseInt(req.query.limite, 10) || 5);
        const offset = (pagina - 1) * limite;

        const where = {};
        const busqueda = req.query.busqueda?.trim();

        if (busqueda) {
            where[Op.or] = [
                { nombre: { [Op.like]: `%${busqueda}%` } },
                { descripcion: { [Op.like]: `%${busqueda}%` } },
            ];
        }

        const { count, rows } = await Categoria.findAndCountAll({
            where,
            limit: limite,
            offset,
            distinct: true,
            order: [["nombre", "ASC"]],
        });

        const totalPaginas = Math.ceil(count / limite) || 1;

        res.json({
            estado: true,
            data: {
                categorias: rows,
                total: count,
                pagina,
                limite,
                totalPaginas,
            },
        });
    } catch (error) {
        console.error("Error al buscar categorías", error);
        res.status(500).json({
            estado: false,
            mensaje: "Error al buscar categorías",
            error: error.message,
        });
    }
};