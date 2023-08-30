import Router from "express";
import {
  crearConductor,
  obtenerConductores,
  obtenerConductorPorId,
  actualizarConductor,
  eliminarConductor,
} from "../controller/conductorControllers.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js"

const router = Router();
router.post("/", validateTokenMiddleware, crearConductor);
router.get("/", obtenerConductores);
router.put("/:id", validateTokenMiddleware, actualizarConductor);
router.get("/:id", obtenerConductorPorId);
router.delete("/:id", validateTokenMiddleware, eliminarConductor);

export default router;
