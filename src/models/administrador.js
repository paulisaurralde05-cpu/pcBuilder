import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Administrador = sequelize.define('Administrador', {
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(200), allowNull: false },
    legajoEmpleado: { type: DataTypes.STRING(50), allowNull: false },
    nivelPermiso: { type: DataTypes.STRING(30), allowNull: false }
}, { tableName: 'administradores', timestamps: false });

export default Administrador;