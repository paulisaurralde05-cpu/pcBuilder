import Producto from "../models/producto.js";
import Categoria from "../models/categoria.js";
import Imagen from "../models/imagen.js";
import { Op } from "sequelize";

export const obtener = async (req, res) => {
  try {
    // findAll() trae todos los registros de la tabla.
    // El "include" hace un JOIN (Eager Loading-carga anticipado) para traer la categoría y las imágenes asociadas.
    const data = await Producto.findAll({
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagen, as: "imagenes" },
      ],
    });
    // Respondemos con un JSON estandarizado (útil para que el frontend sepa que todo salió bien).
    res.json({
      estado: true,
      data,
    });
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
    // Los params de la URL llegan como string, los convertimos a entero base 10.
    const id = parseInt(req.params.id, 10);

    // VALIDACIÓN CLAVE-- Si el ID no es un número (ej. /productos/abc),
    // evitamos que Sequelize explote lanzando un error 400.
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
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      estado: true,
      data,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener producto",
      error: error.message,
    });
  }
};

export const crear = async (req, res) => {
  try {
    const {
      idCategoria,
      nombre,
      marca, //AGREGAR AL MODELO O BORRAR
      modelo, //AGREGAR AL MODELO O BORRAR
      descripcion,
      precio,
      stock,
      socketCompatibilidad, //DECIDIR QUE HACER
      especificacionesTecnicas,
    } = req.body;

    // Validación de campos obligatorios. Si falta alguno, devolvemos 400.
    if (!nombre || !precio || !idCategoria) {
      return res.status(400).json({
        estado: false,
        mensaje: "Debe ingresar nombre, precio y categoria.",
      });
    }

    // Sequelize inserta el nuevo registro en MySQL.
    const data = await Producto.create({
      idCategoria,
      nombre,
      marca,
      modelo,
      descripcion,
      precio,
      stock: stock || 0, // Si el admin no envía stock, por defecto es 0.
      socketCompatibilidad,
      especificacionesTecnicas,
    });

    res.status(201).json({
      estado: true,
      data,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(400).json({
      estado: false,
      mensaje: "Error al crear producto",
      error: error.message,
    });
  }
};

//ACTUALIZAR PRODUCTO. (SOLO ADMIN)
export const actualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Primero verificamos que el producto exista antes de intentar actualizarlo.
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }

    // update() toma los campos enviados en el body y actualiza solo esos en la BD.
    await producto.update(req.body);
    res.json({
      estado: true,
      data: producto,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(400).json({
      estado: false,
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
};

// ELIMINAR UN PRODUCTO (Solo Admin)
export const eliminar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }

    // destroy() borra el registro de la base de datos.
    await producto.destroy();
    res.json({
      estado: true,
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al eliminar producto",
      error: error.message,
    });
  }
};

// BUSCADOR DE PRODUCTOS CON PAGINACIÓN (Público)
export const buscar = async (req, res) => {
  try {
    // Paginación: Si el front pide pagina 2, le restamos 1 y lo multiplicamos por el límite.
    const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
    const limite = Math.max(1, parseInt(req.query.limite, 10) || 5);
    const offset = (pagina - 1) * limite; // Cuántos registros debe saltar la BD.

    const where = {}; // Objeto de condiciones para la consulta SQL.
    const busqueda = req.query.busqueda?.trim(); // Obtenemos el término y quitamos espacios.

    // Si el usuario escribió algo en el buscador:
    if (busqueda) {
      // Usamos Op.or para que busque en nombre, descripción O precio.
      // Op.like con % busca coincidencias parciales (ej. "ryzen" encuentra "AMD Ryzen 5").
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } },
        { precio: { [Op.like]: `%${busqueda}%` } },
      ];
    }

    // findAndCountAll devuelve DOS cosas: el total de registros (count) y los registros de la página actual (rows).
    const { count, rows } = await Producto.findAndCountAll({
      where,
      limit: limite,
      offset,
      distinct: true, // IMPORTANTE: Evita que Sequelize duplique filas por el JOIN con categorías
      include: [{ model: Categoria, as: "categoria" }],
    });

    // Calculamos cuántas páginas hay en total (ej. 12 productos / 5 por pág = 3 páginas).
    const totalPaginas = Math.ceil(count / limite) || 1;

    res.json({
      estado: true,
      data: {
        productos: rows,
        total: count,
        pagina,
        limite,
        totalPaginas,
      },
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

// OBTENER PRODUCTOS DESTACADOS (Para el Home)
export const obtenerDestacados = async (req, res) => {
  try {
    // Filtramos directamente en la base de datos con where: featured: true.
    const data = await Producto.findAll({
      where: { featured: true },
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagen, as: "imagenes" },
      ],
    });

    res.json({
      estado: true,
      data,
    });
  } catch (error) {
    console.error("Error al obtener destacados:", error);
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener productos destacados",
      error: error.message,
    });
  }
};

// CAMBIAR ESTADO DESTACADO (Solo Admin)
export const cambiarDestacado = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { featured } = req.body;

    // // VALIDACIÓN CLAVE: Verificamos que el frontend envíe un booleano real.
    // Si envía el string "true" o un número 1, lo rechazamos para mantener integridad.
    if (typeof featured !== "boolean") {
      return res.status(400).json({
        estado: false,
        mensaje: 'El campo "featured" debe ser true o false',
      });
    }

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        estado: false,
        mensaje: "Producto no encontrado",
      });
    }

    // Modificamos solo el campo featured y guardamos.
    producto.featured = featured;
    await producto.save();

    res.json({
      estado: true,
      data: producto,
      // Usamos un operador ternario para enviar un mensaje u otro según el nuevo estado.
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
