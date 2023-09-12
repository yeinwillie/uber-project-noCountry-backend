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
router.get("/:id", obtenerTicketPorId);
router.put("/:id", actualizarTicket);
router.delete("/:id", validateTokenMiddleware, eliminarTicket);
router.get(
  "/conductor/:id",
  obtenerViajesDeConductor
);
router.get("/usuario/:id",  obtenerViajesDeUsuario);

export default router;
