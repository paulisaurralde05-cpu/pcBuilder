import express from 'express';
import { 
    obtener, 
    obtenerPorId,
    crear,
    actualizar, 
    eliminar
} from '../controllers/usuariosController.js';

import { verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verificarAdmin, obtener);
router.get('/:id', verificarAdmin, obtenerPorId);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', verificarAdmin, eliminar);

export default router;