import { Router } from 'express';
import { loginCliente, registrarCliente, loginAdmin, registrarAdmin } from '../controllers/authController.js';

const router = Router();

router.post('/cliente/login', loginCliente);
router.post('/cliente/registro', registrarCliente);

router.post('/admin/login', loginAdmin);
router.post('/admin/registro', registrarAdmin);

export default router;