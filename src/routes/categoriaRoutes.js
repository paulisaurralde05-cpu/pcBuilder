import { Router } from 'express';
import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    buscar
} from '../controllers/categoriaController.js';
import { verificarAdmin } from '../middleware/auth.js';

const router = Router();

// Rutas públicas, cualquiera puede ver las categorías. 
router.get('/', obtener);
router.get('/buscar', buscar);
router.get('/:id', obtenerPorId);

// Rutas privadas, sólo el admin puede modificar. 
router.post('/', verificarAdmin, crear);
router.put('/:id', verificarAdmin, actualizar);
router.delete('/:id', verificarAdmin, eliminar);

export default router;