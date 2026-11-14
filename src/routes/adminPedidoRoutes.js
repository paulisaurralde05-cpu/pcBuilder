import { Router } from 'express';
import { actualizarPedido, getPedidoById, getPedidos } from '../controllers/adminPedidoController.js';
import { verificarAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', verificarAdmin, getPedidos);
router.get('/:id', verificarAdmin, getPedidoById);
router.patch('/:id/estado', verificarAdmin, actualizarPedido);

export default router;
