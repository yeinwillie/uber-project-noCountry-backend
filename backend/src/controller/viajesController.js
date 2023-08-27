import mongoose from 'mongoose'
import Viaje from '../models/viajesModels.js'; 

const crearViaje = async (req, res) => {
  try {
    const viajeData = req.body;
    const nuevoViaje = new Viaje(viajeData);
    const resultado = await nuevoViaje.save();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const obtenerViajes = async (req, res) => {
  try {
    const viajes = await Viaje.find();
    res.json(viajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const obtenerViajePorId = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);
    if (viaje) {
      res.json(viaje);
    } else {
      res.status(404).json({ message: 'Viaje no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarViaje = async (req, res) => {
  try {
    const viajeData = req.body;
    const viajeActualizado = await Viaje.findByIdAndUpdate(
      req.params.id,
      viajeData,
      { new: true }
    );
    if (viajeActualizado) {
      res.json(viajeActualizado);
    } else {
      res.status(404).json({ message: 'Viaje no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const eliminarViaje = async (req, res) => {
  try {
    const viajeEliminado = await Viaje.findByIdAndDelete(req.params.id);
    if (viajeEliminado) {
      res.json({ message: 'Viaje eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Viaje no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export {
  crearViaje,
  obtenerViajes,
  obtenerViajePorId,
  actualizarViaje,
  eliminarViaje,
};
