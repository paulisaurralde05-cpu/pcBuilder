import Producto from "../models/producto.js";
import Categoria from "../models/categoria.js";
import Imagen from "../models/imagen.js";
import { Op } from "sequelize";

export const obtener = async (req, res) => {
  try {
    const data = await Producto.findAll({
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagen, as: "imagenes" },
      ],
    });
    res.json({ estado: true, data });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener productos",
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
        mensaje: "El id del producto debe ser numérico",
      });
    }
    const data = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagen, as: "imagenes" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "Producto no encontrado" });
    }
    res.json({ estado: true, data });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener producto",
      error: error.message,
    });
  }
};

// 🔥 CREAR PRODUCTO CORREGIDO
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
      especificacionesTecnicas,
    } = req.body;

    if (!nombre || !precio || !idCategoria) {
      return res.status(400).json({
        estado: false,
        mensaje: "Debe ingresar nombre, precio y categoria.",
      });
    }

    // 1. Verificamos si Multer subió un archivo y calculamos la URL
    let imagenUrl = null;
    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imagen) {
      imagenUrl = req.body.imagen; // Por si envían una URL de texto
    }

    // 2. Creamos el producto (sin intentar guardar la imagen en esta tabla)
    const data = await Producto.create({
      idCategoria,
      nombre,
      marca,
      modelo,
      descripcion,
      precio,
      stock: stock || 0,
      socketCompatibilidad,
      especificacionesTecnicas,
    });

    // 3. Si hay imagen, la guardamos en la tabla Imagen
    if (imagenUrl) {
      await Imagen.create({
        nombre: req.file ? req.file.originalname : "imagen-producto", // Validamos si req.file existe
        url: imagenUrl,
        idProducto: data.id,
      });
    }

    res.status(201).json({ estado: true, data });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(400).json({
      estado: false,
      mensaje: "Error al crear producto",
      error: error.message,
    });
  }
};

// ACTUALIZAR PRODUCTO CORREGIDO
export const actualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "Producto no encontrado" });
    }

    // 1. Actualizamos los datos de texto del producto
    await producto.update(req.body);

    // 2. Si Multer procesó una imagen nueva, actualizamos la tabla Imagen
    if (req.file) {
      const nuevaUrl = `/uploads/${req.file.filename}`;

      // Buscamos si el producto ya tenía una imagen asociada
      const imagenExistente = await Imagen.findOne({
        where: { idProducto: id },
      });

      if (imagenExistente) {
        // Si ya tenía, le cambiamos la URL
        await imagenExistente.update({
          url: nuevaUrl,
          nombre: req.file.originalname,
        });
      } else {
        // Si no tenía, creamos el registro
        await Imagen.create({
          nombre: req.file.originalname,
          url: nuevaUrl,
          idProducto: id,
        });
      }
    }

    res.json({ estado: true, data: producto });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(400).json({
      estado: false,
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
};

export const eliminar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "Producto no encontrado" });
    }
    await producto.destroy();
    res.json({ estado: true, mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al eliminar producto",
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

    if (busqueda) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } },
        { precio: { [Op.like]: `%${busqueda}%` } },
      ];
    }

    const { count, rows } = await Producto.findAndCountAll({
      where,
      limit: limite,
      offset,
      distinct: true,
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagen, as: "imagenes" },
      ],
    });

    const totalPaginas = Math.ceil(count / limite) || 1;

    res.json({
      estado: true,
      data: { productos: rows, total: count, pagina, limite, totalPaginas },
    });
  } catch (error) {
    console.error("Error al buscar productos", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al buscar productos",
      error: error.message,
    });
  }
};

export const obtenerDestacados = async (req, res) => {
  try {
    const data = await Producto.findAll({
      where: { featured: true },
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagen, as: "imagenes" },
      ],
    });
    res.json({ estado: true, data });
  } catch (error) {
    console.error("Error al obtener destacados:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener productos destacados",
      error: error.message,
    });
  }
};

export const cambiarDestacado = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { featured } = req.body;

    if (typeof featured !== "boolean") {
      return res.status(400).json({
        estado: false,
        mensaje: 'El campo "featured" debe ser true o false',
      });
    }

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "Producto no encontrado" });
    }

    producto.featured = featured;
    await producto.save();

    res.json({
      estado: true,
      data: producto,
      mensaje: featured
        ? "Producto añadido a destacados"
        : "Producto removido de destacados",
    });
  } catch (error) {
    console.error("Error al cambiar destacado:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al actualizar el destacado",
      error: error.message,
    });
  }
};
