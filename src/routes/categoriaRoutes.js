import { Router } from 'express';
import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/categoriaController.js';


import { verificarAdmin } from '../middleware/auth.js';

const router = Router();


router.get('/', obtener);
router.get('/:id', obtenerPorId);


router.post('/', verificarAdmin, crear);
router.put('/:id', verificarAdmin, actualizar);
router.delete('/:id', verificarAdmin, eliminar);

export default router;