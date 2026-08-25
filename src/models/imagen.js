import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Imagen = sequelize.define('Imagen', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    url: { type: DataTypes.STRING(250), allowNull: false },
    productoId: {type: DataTypes.INTEGER, allowNull: false}
}, { tableName: 'imagenes', timestamps: false });

export default Imagen;
