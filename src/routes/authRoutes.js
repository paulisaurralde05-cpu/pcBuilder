import { Router } from 'express';
import { registrarCliente, loginCliente, loginAdmin } from '../controllers/authController.js';

const router = Router();

router.post('/cliente/registro', registrarCliente);
router.post('/cliente/login', loginCliente);
router.post('/admin/login', loginAdmin);

export default router;