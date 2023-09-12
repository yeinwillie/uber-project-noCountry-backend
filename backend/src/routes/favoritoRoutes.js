import Router from "express";
import {
  crearFavorito,
  obtenerFavoritos,
  obtenerFavoritoPorId,
  actualizarFavorito,
  eliminarFavorito,
  obtenerFavoritosDeUsuario,
  obtenerFavoritosDeConductor,
} from "../controller/favoritosControllers.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const router = Router();
router.post("/", validateTokenMiddleware, crearFavorito);
router.get("/", obtenerFavoritos);
router.put("/:id", validateTokenMiddleware, actualizarFavorito);
router.get("/:id", obtenerFavoritoPorId);
router.delete("/:id", validateTokenMiddleware, eliminarFavorito);
router.get("/usuario/:id",  obtenerFavoritosDeUsuario);
router.get(
  "/conductore/:id",
  obtenerFavoritosDeConductor
);

export default router;
