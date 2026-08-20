import { Sequelize } from "sequelize";
const Imagen = sequelize.define('Imagen', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: Sequelize.STRING(150), allowNull: false },
    url: { type: Sequelize.STRING(250), allowNull: false }
}, { tableName: 'imagenes', timestamps: false });

export default Imagen;
