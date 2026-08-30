import { Router } from 'express';
import { verificarCliente } from '../middleware/auth.js';
import {
    obtenerMisPedidos,
    crearDesdeCarrito,
} from '../controllers/pedidoController.js';

const router = Router();

router.use(verificarCliente);

router.get('/', obtenerMisPedidos);
router.post('/crear', crearDesdeCarrito);

export default router;