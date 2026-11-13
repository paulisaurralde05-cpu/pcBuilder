<<<<<<< HEAD
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Administrador = sequelize.define(
  "Administrador",
  {
=======
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Administrador = sequelize.define('Administrador', {
    
>>>>>>> 1c356a8a4b74b8242845f4d3f79d24557cc83193
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(200), allowNull: false },
    legajoEmpleado: { type: DataTypes.STRING(50), allowNull: false },
    nivelPermiso: { type: DataTypes.STRING(30), allowNull: false },
  },
  { tableName: "administradores", timestamps: false },
);

export default Administrador;
