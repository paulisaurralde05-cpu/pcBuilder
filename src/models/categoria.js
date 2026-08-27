import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Categoria = sequelize.define('Categoria', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.STRING(100), allowNull: true }
}, { tableName: 'categorias', timestamps: false });

export default Categoria;