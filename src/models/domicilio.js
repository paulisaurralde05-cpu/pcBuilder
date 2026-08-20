import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Domicilio = sequelize.define('Domicilio', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    calle: { type: DataTypes.STRING(200), allowNull: false },
    numero: { type: DataTypes.STRING(10), allowNull: false },
    ciudad: { type: DataTypes.STRING(100), allowNull: false },
    provincia: { type: DataTypes.STRING(100), allowNull: false },
    codigoPostal: { type: DataTypes.STRING(10), allowNull: false }
}, { tableName: 'domicilios', timestamps: false });

export default Domicilio;