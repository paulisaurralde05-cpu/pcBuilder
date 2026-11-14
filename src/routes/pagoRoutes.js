import { Router } from 'express';
import { verificarCliente } from '../middleware/auth.js';
import { obtenerPorPedido, registrarPago } from '../controllers/pagoController.js';

const router = Router();

router.use(verificarCliente);

router.get('/pedido/:idPedido', obtenerPorPedido);
router.post('/', registrarPago);

export default router;