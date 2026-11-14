import { Router } from 'express';
import { verificarCliente } from '../middleware/auth.js';
import { obtenerMisTelefonos, crear, eliminar } from '../controllers/telefonoController.js';

const router = Router();

router.use(verificarCliente);

router.get('/', obtenerMisTelefonos);
router.post('/', crear);
router.delete('/:id', eliminar);

export default router;