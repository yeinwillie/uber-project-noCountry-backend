import mongoose from "mongoose";
import Favorito from "../models/FavoritoModels.js";

const crearFavorito = async (req, res) => {
  try {
    const favoritoData = req.body;
    const nuevoFavorito = new Favorito(favoritoData);
    const resultado = await nuevoFavorito.save();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const obtenerFavoritos = async (req, res) => {
  try {
    const favoritos = await Favorito.find();
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const obtenerFavoritoPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const favorito = await Favorito.findById(id);
    if (!favorito) {
      return res.status(404).json({ mensaje: "Favorito no encontrado" });
    }
    res.json(favorito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const actualizarFavorito = async (req, res) => {
  try {
    const id = req.params.id;
    const nuevoData = req.body;
    const favorito = await Favorito.findByIdAndUpdate(id, nuevoData, {
      new: true,
    });
    if (!favorito) {
      return res.status(404).json({ mensaje: "Favorito no encontrado" });
    }
    res.json(favorito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const eliminarFavorito = async (req, res) => {
  try {
    const id = req.params.id;
    const favorito = await Favorito.findByIdAndRemove(id);
    if (!favorito) {
      return res.status(404).json({ mensaje: "Favorito no encontrado" });
    }
    res.json({ mensaje: "Favorito eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const obtenerFavoritosDeUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.id; 
    console.log(idUsuario)
    const favoritos = await Favorito.find({ id_user: idUsuario }).exec();
    console.log(favoritos)
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const obtenerFavoritosDeConductor = async (req, res) => {
  try {
    const idConductor = req.params.id; 
    const favoritos = await Favorito.find({ id_conductor: idConductor }).exec();
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {
  crearFavorito,
  obtenerFavoritos,
  obtenerFavoritoPorId,
  actualizarFavorito,
  eliminarFavorito,
  obtenerFavoritosDeUsuario,
  obtenerFavoritosDeConductor
};
