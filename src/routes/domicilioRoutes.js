import { Router } from 'express';
import { verificarCliente } from '../middleware/auth.js';
import {
    obtenerMisDomicilios,
    crear,
    eliminar,
} from '../controllers/domicilioController.js';

const router = Router();

router.use(verificarCliente);

router.get('/', obtenerMisDomicilios);
router.post('/', crear);
router.delete('/:id', eliminar);

export default router;