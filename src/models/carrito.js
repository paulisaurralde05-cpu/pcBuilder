import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Carrito = sequelize.define('Carrito', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaActualizacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'carritos', timestamps: false });

export default Carrito;