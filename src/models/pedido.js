import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaPedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Pendiente' }
}, { tableName: 'pedidos', timestamps: false });

export default Pedido;