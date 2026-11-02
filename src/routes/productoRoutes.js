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
const router = Router();

router.get("/", obtener);

// Importante que vaya ANTES de '/:id', sino Express piensa que "destacados" es un ID.
router.get("/destacados", obtenerDestacados);

router.get("/buscar", buscar);
router.get("/:id", obtenerPorId);

router.post("/", verificarAdmin, crear);
router.put("/:id", verificarAdmin, actualizar);
router.delete("/:id", verificarAdmin, eliminar);

router.patch("/:id/destacar", verificarAdmin, cambiarDestacado);
export default router;
