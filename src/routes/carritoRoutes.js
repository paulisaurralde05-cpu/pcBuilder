import { Router } from 'express';
import { verificarCliente } from '../middleware/auth.js';
import {
    obtenerMiCarrito,
    agregarProducto,
    eliminarProducto,
} from '../controllers/carritoController.js';

const router = Router();

router.use(verificarCliente);

router.get('/', obtenerMiCarrito);
router.post('/agregar', agregarProducto);
router.delete('/eliminar/:idProducto', eliminarProducto);

export default router;