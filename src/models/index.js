import { sequelize } from '../config/database.js';
import Administrador from './administrador.js';
import Usuario from './usuario.js';
import Domicilio from './domicilio.js';
import Telefono from './telefono.js';
import Categoria from './categoria.js';
import Producto from './producto.js';
import Carrito from './carrito.js';
import DetallesCarrito from './detallesCarrito.js';
import Pedido from './pedido.js';
import DetallesPedido from './detallesPedido.js';
import Pago from './pago.js';
import Imagen from './imagen.js';

// 1. Usuario-Domicilio (1 a N)
Usuario.hasMany(Domicilio, { foreignKey: 'idUsuario', as: 'domicilios' });
Domicilio.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// 2. Usuario-Telefono (1 a N)
Usuario.hasMany(Telefono, { foreignKey: 'idUsuario', as: 'telefonos' });
Telefono.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// 3. Usuario-Carrito (1 a 1)
Usuario.hasOne(Carrito, { foreignKey: 'idUsuario', as: 'carrito' });
Carrito.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// 4. Carrito-DetallesCarrito (1 a N)
Carrito.hasMany(DetallesCarrito, { foreignKey: 'idCarrito', as: 'items' });
DetallesCarrito.belongsTo(Carrito, { foreignKey: 'idCarrito' });

// 5. Producto-DetallesCarrito (1 a N)
Producto.hasMany(DetallesCarrito, { foreignKey: 'idProducto' });
DetallesCarrito.belongsTo(Producto, { foreignKey: 'idProducto', as: 'producto' });

// 6. Categoria-Producto (1 a N)
Categoria.hasMany(Producto, { foreignKey: 'idCategoria', as: 'productos' });
Producto.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoria'});

// 7. Usuario-Pedido (1 a N)
Usuario.hasMany(Pedido, { foreignKey: 'idUsuario', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// 8. Pedido-DetallesPedido (1 a N)
Pedido.hasMany(DetallesPedido, { foreignKey: 'idPedido', as: 'detalles' });
DetallesPedido.belongsTo(Pedido, { foreignKey: 'idPedido' });

// 9. Producto-DetallesPedido (1 a N)
Producto.hasMany(DetallesPedido, { foreignKey: 'idProducto' });
DetallesPedido.belongsTo(Producto, { foreignKey: 'idProducto', as: 'producto' });

// 10. Pedido-Pago
Pedido.hasOne(Pago, { foreignKey: 'idPedido', as: 'pago' });
Pago.belongsTo(Pedido, { foreignKey: 'idPedido' });

// 11. Producto-Imagen (1 a N)
Producto.hasMany(Imagen, {foreingKey: 'idProducto', as: 'imagenes'});
Imagen.belongsTo(Producto, {foeringKey: 'idProducto', as: 'producto'});

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
    Imagen
};