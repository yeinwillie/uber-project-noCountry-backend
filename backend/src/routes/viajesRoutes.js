import Router from "express";
import {
  crearViaje,
  obtenerViajes,
  obtenerViajePorId,
  actualizarViaje,
  eliminarViaje,
} from "../controller/viajesController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const router = Router();
router.post("/", validateTokenMiddleware, crearViaje);
router.get("/", obtenerViajes);
router.put("/:id", validateTokenMiddleware, actualizarViaje);
router.get("/:id", obtenerViajePorId);
router.delete("/:id", validateTokenMiddleware, eliminarViaje);

export default router;
