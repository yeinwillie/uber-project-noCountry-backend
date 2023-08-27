import Router from "express";
import {
  crearViaje,
  obtenerViajes,
  obtenerViajePorId,
  actualizarViaje,
  eliminarViaje,
} from "../controller/viajesController.js";

const router = Router();
router.post("/", crearViaje);
router.get("/", obtenerViajes);
router.put("/:id", actualizarViaje);
router.get("/:id", obtenerViajePorId);
router.delete("/:id", eliminarViaje);

export default router;
