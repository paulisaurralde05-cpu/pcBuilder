import { Router } from "express";
import {
  obtener,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  buscar,
  obtenerDestacados,
  cambiarDestacado,
} from "../controllers/productoController.js";

import { verificarAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js"; 

const router = Router();

// Rutas públicas
router.get("/", obtener);
router.get("/destacados", obtenerDestacados);
router.get("/buscar", buscar);
router.get("/:id", obtenerPorId);

// Rutas protegidas
router.post("/", verificarAdmin, upload.single("imagen"), crear);
router.put("/:id", verificarAdmin, upload.single("imagen"), actualizar);
router.delete("/:id", verificarAdmin, eliminar);
router.patch("/:id/destacar", verificarAdmin, cambiarDestacado);

export default router;