import express from "express";
import cors from "cors";
import routes from './routes/index.js';
import sequelize from './config/database.js';

import './models/index.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`Origen no permitido por CORS: ${origin}`);
        return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/', routes);

const PUERTO = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        app.listen(PUERTO, () => {
            console.log('Servidor iniciado correctamente en el puerto:', PUERTO);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

iniciarServidor();