import { sequelize } from './models/index.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        await sequelize.sync({ force: true });
        console.log('Base de datos sincronizada.');
        
        app.listen(PORT, () => {
            console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al inicializar el servidor:', error);
    }
}

main();