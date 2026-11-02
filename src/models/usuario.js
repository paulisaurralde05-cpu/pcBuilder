import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(200), allowNull: false },
    fechaRegistro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    codigoRecuperacion: { type: DataTypes.STRING(6), allowNull: true },
    codigoExpiracion: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'usuarios', timestamps: false });

export default Usuario;