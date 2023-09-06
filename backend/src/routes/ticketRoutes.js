import Router from "express";
import {
  obtenerTickets,
  obtenerTicketPorId,
  actualizarTicket,
  eliminarTicket,
  obtenerViajesDeConductor,
  obtenerViajesDeUsuario,
} from "../controller/ticketController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const router = Router();
router.get("/", validateTokenMiddleware, obtenerTickets);
router.get("/:id", validateTokenMiddleware, obtenerTicketPorId);
router.put("/:id", validateTokenMiddleware, actualizarTicket);
router.delete("/:id", validateTokenMiddleware, eliminarTicket);
router.get(
  "/conductor/:id",
  validateTokenMiddleware,
  obtenerViajesDeConductor
);
router.get("/usuario/:id", validateTokenMiddleware, obtenerViajesDeUsuario);

export default router;
