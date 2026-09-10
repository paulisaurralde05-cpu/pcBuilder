export const validarProducto = (req, res, next) => {
  const { nombre, precio, stock, categoryId } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ 
      estado: false, 
      mensaje: 'El nombre es obligatorio y debe ser un texto válido.' 
    });
  }
  if (precio === undefined || typeof precio !== 'number' || precio < 0) {
    return res.status(400).json({ 
      estado: false, 
      mensaje: 'El precio debe ser un número mayor o igual a 0.' 
    });
  }
  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ 
      estado: false, 
      mensaje: 'El stock debe ser un número mayor o igual a 0.' 
    });
  }
  if (!categoryId) {
    return res.status(400).json({ 
      estado: false, 
      mensaje: 'La categoría (categoryId) es obligatoria.' 
    });
  }

  next();
};