import mongoose from 'mongoose'
import Conductor from   '../models/conductorModels.js'

const crearConductor = async (req, res) => {
  try {
    const conductorData = req.body;
    console.log(conductorData)
    const nuevoConductor = new Conductor(conductorData);
    console.log(nuevoConductor)
    res.json(nuevoConductor)
    const resultado = await nuevoConductor.save();
  } catch (error) {
    throw error;
  }
};

const obtenerConductores = async (req, res) => {
  try {
    const conductores = await Conductor.find();
    res.json(conductores);
  } catch (error) {
    throw error;
  }
};

const obtenerConductorPorId = async (req, res) => {
  try {
    const conductorId = req.params.id
    console.log(conductorId)
    const conductor = await Conductor.findById(conductorId);
    res.json(conductor)
  } catch (error) {
    throw error;
  }
};

const actualizarConductor = async (req, res) => {
  try {
    const conductorId = req.params.id;
    const newData = req.body; 
    console.log(conductorId, newData);

    const conductorActualizado = await Conductor.findByIdAndUpdate(
      conductorId,
      newData,
      { new: true }
    );

    res.json(conductorActualizado);
  } catch (error) {
    throw error;
  }
};

const eliminarConductor = async (req, res) => {
  try {
    const conductorId = req.params.id
    const resultado = await Conductor.findByIdAndDelete(conductorId);
    res.json("Confirmado")
  } catch (error) {
    throw error;
  }
};

export {
  crearConductor,
  obtenerConductores,
  obtenerConductorPorId,
  actualizarConductor,
  eliminarConductor,
};

