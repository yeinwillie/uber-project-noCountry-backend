import Router from "express";
import {
  crearConductor,
  obtenerConductores,
  obtenerConductorPorId,
  actualizarConductor,
  eliminarConductor,
} from "../controller/conductorControllers.js";

const router = Router();
router.post("/", crearConductor);
router.get("/", obtenerConductores);
router.put("/:id", actualizarConductor);
router.get("/:id", obtenerConductorPorId);
router.delete("/:id", eliminarConductor);

export default router;
