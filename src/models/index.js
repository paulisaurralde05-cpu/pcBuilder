import { sequelize } from "../config/database.js";
import Administrador from "./administrador.js";
import Usuario from "./usuario.js";
import Domicilio from "./domicilio.js";
import Telefono from "./telefono.js";
import Categoria from "./categoria.js";
import Producto from "./producto.js";
import Carrito from "./carrito.js";
import DetallesCarrito from "./detallesCarrito.js";
import Pedido from "./pedido.js";
import DetallesPedido from "./detallesPedido.js";
import Pago from "./pago.js";
import Imagen from "./imagen.js";

// 1. Usuario-Domicilio (1 a N) -- Un usuario puede tener muchos domicilios (ej. Casa, Trabajo).
Usuario.hasMany(Domicilio, { foreignKey: "idUsuario", as: "domicilios" });
Domicilio.belongsTo(Usuario, { foreignKey: "idUsuario" });

// 2. Usuario-Telefono (1 a N)
Usuario.hasMany(Telefono, { foreignKey: "idUsuario", as: "telefonos" });
Telefono.belongsTo(Usuario, { foreignKey: "idUsuario" });

// 3. Usuario-Carrito (1 a 1)--- Un usuario tiene UN solo carrito activo (hasOne)
Usuario.hasOne(Carrito, { foreignKey: "idUsuario", as: "carrito" });
Carrito.belongsTo(Usuario, { foreignKey: "idUsuario" });

// 4. Carrito-DetallesCarrito (1 a N) Un carrito tiene muchos ítems
Carrito.hasMany(DetallesCarrito, { foreignKey: "idCarrito", as: "items" });
DetallesCarrito.belongsTo(Carrito, { foreignKey: "idCarrito" });

// 5. Producto-DetallesCarrito (1 a N) Un producto puede estar en muchos carritos
Producto.hasMany(DetallesCarrito, { foreignKey: "idProducto" });
DetallesCarrito.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto",
});

// 6. Categoria-Producto (1 a N) Una categoría tiene muchos productos.
Categoria.hasMany(Producto, { foreignKey: "idCategoria", as: "productos" });
Producto.belongsTo(Categoria, { foreignKey: "idCategoria", as: "categoria" });

// 7. Usuario-Pedido (1 a N) Un usuario tiene muchos pedidos históricos.
Usuario.hasMany(Pedido, { foreignKey: "idUsuario", as: "pedidos" });
Pedido.belongsTo(Usuario, { foreignKey: "idUsuario" });

// 8. Pedido-DetallesPedido (1 a N) Un pedido tiene muchos detalles (los productos comprados).
Pedido.hasMany(DetallesPedido, { foreignKey: "idPedido", as: "detalles" });
DetallesPedido.belongsTo(Pedido, { foreignKey: "idPedido" });

// 9. Producto-DetallesPedido (1 a N) Un producto puede estar en muchos pedidos históricos.
Producto.hasMany(DetallesPedido, { foreignKey: "idProducto" });
DetallesPedido.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto",
});

// 10. Pedido-Pago Un pedido tiene un solo registro de pago asociado.
Pedido.hasOne(Pago, { foreignKey: "idPedido", as: "pago" });
Pago.belongsTo(Pedido, { foreignKey: "idPedido" });

// 11. Producto-Imagen (1 a N) Un producto puede tener múltiples imágenes (galería).
Producto.hasMany(Imagen, { foreignKey: "idProducto", as: "imagenes" });
Imagen.belongsTo(Producto, { foreignKey: "idProducto", as: "producto" });

export {
  sequelize,
  Administrador,
  Usuario,
  Domicilio,
  Telefono,
  Categoria,
  Producto,
  Carrito,
  DetallesCarrito,
  Pedido,
  DetallesPedido,
  Pago,
  Imagen,
};
