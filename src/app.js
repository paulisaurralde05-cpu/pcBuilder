import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import sequelize from "./config/database.js";

import "./models/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

const corsOptions = {
  // Usamos una función para validar el origen dinámicamente.
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // Si el origen de la petición está en nuestra lista blanca, lo permitimos.
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Si no está en la lista, lanzamos advertencia y error.
    console.warn(`Origen no permitido por CORS: ${origin}`);
    return callback(new Error("No permitido por CORS"));
  },
  credentials: true, // Permite enviar cookies/headers de autenticación (como tu token JWT)
};
// Aplicamos el middleware de CORS a todas las rutas.
app.use(cors(corsOptions));

app.use(express.json()); // Middleware para parsear el body de las peticiones (transforma JSON a objeto JS).

//RUTAS
app.use("/", routes);

const PUERTO = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await sequelize.sync({ alter: false });

    // await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");

    app.listen(PUERTO, () => {
      console.log("Servidor iniciado correctamente en el puerto:", PUERTO);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    process.exit(1); // AGREGO ESTO---Apaga la DB si falla la conexión.
  }
};

iniciarServidor();
