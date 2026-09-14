import { Router } from 'express';
import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/productoController.js';


import { verificarAdmin } from '../middleware/auth.js';
import { validarProducto } from '../middleware/validarProducto.js';

const router = Router();


router.get('/', obtener);
router.get('/:id', obtenerPorId);


router.post('/', verificarAdmin, validarProducto, crear);
router.put('/:id', verificarAdmin, validarProducto, actualizar);
router.delete('/:id', verificarAdmin, eliminar);

export default router;