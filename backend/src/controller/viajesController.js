import mongoose from 'mongoose'
import Viaje from '../models/viajesModels.js'; 
import decodeToken from '../utils/decodeToken.js';
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

const ACCESS_TOKEN_MB = process.env.ACCESS_TOKEN_MB;

const crearViaje = async (req, res) => {

  const { origen, destino, token  } = req.body;
 
  const decodedToken = decodeToken(token);

  if (decodedToken.error) {
    return res.status(401).json({ message: decodedToken.error });
  }

  const userId = decodedToken.userId;

  try {    
   
    const geocodingResponseOrigen = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origen)}.json` +
        `?access_token=${ACCESS_TOKEN_MB}`
    );

    if (!geocodingResponseOrigen.ok) {
      throw new Error('Error al obtener datos de geocodificación para el origen');
    }

    const geocodingDataOrigen = await geocodingResponseOrigen.json();
    
    const geocodingResponseDestino = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destino)}.json` +
        `?access_token=${ACCESS_TOKEN_MB}`
    );

    if (!geocodingResponseDestino.ok) {
      throw new Error('Error al obtener datos de geocodificación para el destino');
    }
    
    const geocodingDataDestino = await geocodingResponseDestino.json();

    const origenCoords = geocodingDataOrigen.features[0].geometry.coordinates;
    const destinoCoords = geocodingDataDestino.features[0].geometry.coordinates;

    const directionsResponse = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${origenCoords[0]},${origenCoords[1]};${destinoCoords[0]},${destinoCoords[1]}` +
        `?access_token=${ACCESS_TOKEN_MB}`
    );

    if (!directionsResponse.ok) {
      throw new Error('Error al obtener datos de direcciones');
    }

    const directionsData = await directionsResponse.json();

    const distance = directionsData.routes[0].distance;
    const duration = directionsData.routes[0].duration;
       

    const precioPorKilometroStandar = 0.5;
    const precioTotalStandar = distance * precioPorKilometroStandar;

    const precioPorKilometroPremiun = 0.7;
    const precioTotalStandarPremiun = distance * precioPorKilometroPremiun;

    const nuevoViaje = new Viaje({
      origen: req.body.origen,
      destino: req.body.destino,
      id_usuario: userId
      
      });                         

    await nuevoViaje.save();
      
    // Id conductores disponibles simulados
    const idConductorStandar = '64eea1f193d51227247663b3'; 
    const idConductorPremiun = '64eea22e93d51227247663b5'; 

      res.json({
      idViaje: nuevoViaje._id,
      distancia: distance,
      tiempo: duration,
      precioStandar: precioTotalStandar,
      idConductorStandar: idConductorStandar,
      precioPremiun: precioTotalStandarPremiun,
      idConductorPremiun: idConductorPremiun,
      directionsData: directionsData                         // Data for frontend map drawing
    });

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
