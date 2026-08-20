import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Telefono = sequelize.define('Telefono', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero: { type: DataTypes.STRING(30), allowNull: false },
    tipo: { type: DataTypes.STRING(50), allowNull: false }
}, { tableName: 'telefonos', timestamps: false });

export default Telefono;