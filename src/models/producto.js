import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Producto = sequelize.define(
  "Producto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    socketCompatibilidad: { type: DataTypes.STRING(50), allowNull: true },
    especificacionesTecnicas: { type: DataTypes.TEXT, allowNull: true },

    // Indica si el producto aparece en la sección "Destacados" de la home.
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { tableName: "productos", timestamps: true },
);

export default Producto;
