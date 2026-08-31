import { Router } from 'express';

import statusRoutes from './statusRoutes.js';
import authRoutes from './authRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import productoRoutes from './productoRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import carritoRoutes from './carritoRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import domicilioRoutes from './domicilioRoutes.js';
import pagoRoutes from './pagoRoutes.js';
import telefonoRoutes from './telefonoRoutes.js';

const router = Router();

router.use('/status', statusRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/productos', productoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/carrito', carritoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/domicilios', domicilioRoutes);
router.use('/pagos', pagoRoutes);
router.use('/telefonos', telefonoRoutes);

export default router;