import express from 'express';
import dotenv from 'dotenv';
//import server from './src/routes/serverRoute.js';
import user from './src/routes/userRoute.js';
import paymentRoute from './src/routes/paymentRoutes.js';
import conductor from './src/routes/conductorRoutes.js';
import ticket from './src/routes/ticketRoutes.js';
import favorito from './src/routes/favoritoRoutes.js';
import { initDBConnection } from './src/data/dbConnection.js';
import authRoutes from "./src/routes/authRoutes.js"

import viajes from './src/routes/viajesRoutes.js';
import { validateTokenController } from './src/controller/validateTokenController.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import{Server as SocketServer} from 'socket.io';
import socketRoutes from './src/routes/socketRoutes.js';
import polyline from '@mapbox/polyline';

import cors from 'cors';
import bodyParser from 'body-parser';
import Viaje from './src/models/viajesModels.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new SocketServer(server);
app.use('/', socketRoutes);

app.use(express.json());

const PORT = process.env.PORT || 3001;

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    credentials: true,
    origin: [FRONTEND_URL, "http://localhost:3000",]
  })
);

app.use(bodyParser.json());
//app.use('/', server);
app.use(express.json());
app.use('/users', user);

app.use('/conductor', conductor);
app.use(express.json());
app.use('/tickets',ticket );
app.use('/favorito',favorito );

app.use("/api", authRoutes)
app.use('/protected-route', validateTokenController);
app.use('/payment', paymentRoute);
app.use('/viajes', viajes);

// socket viaje de conductor 

/*const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);*/

let currentOrigin = "Av. Corrientes 1500, Buenos Aires, Argentina"; // Ubicación de partida conductor(puedes cambiarla)
const destino = "Cerrito 800, Santa Fe, Argentina"; // Ubicación de llegada recoger pasajero(puedes cambiarla)
const ACCESS_TOKEN_MB = 'pk.eyJ1IjoieWVpbndpbGxpZSIsImEiOiJjbGx2bzVianAxY3VyM2ZwaDAwc2dyd2lyIn0._qZShL6XUUYlIQ_km2IUDg';
const UPDATE_INTERVAL = 3000; 
let currentIndex = 0; // Mover currentIndex fuera de la función sendCoordinates

 // const obtenerOrigen = async () => {
  //   try {
  //     const viaje = await Viaje.findById("64ece2e17adc22497df12936");
  //     if (viaje) {
  //       return (viaje);
  //     } else {
  //       return({ message: 'Viaje no encontrado' });
  //     }
  //   } catch (error) {
  //     return({ error: error.message });
  //   }
  // };
io.on('connection', (socket) => {
  console.log('A user connected');

  let intervalId;
 
  const sendCoordinates = async () => {
    try {
      const origen = await obtenerOrigen();
      // convertir la direccion de origen para que la lea el fetch de mapbox
      const idDelUsuario = "64ece2e17adc22497df12936"
      const ultimoViaje = await Viaje.findOne({ id_usuario: idDelUsuario })
      .sort({ fecha: -1 }) // Ordena en orden descendente por fecha (el más reciente primero)
      .exec();

    if (!ultimoViaje) {
      throw new Error('No se encontró el último viaje del usuario');
    }

    const destino2 = ultimoViaje.origen;
      const geocodingResponseOrigen = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(currentOrigin)}.json` +
        `?access_token=${ACCESS_TOKEN_MB}`
      );

      if (!geocodingResponseOrigen.ok) {
        throw new Error('Error al obtener datos de geocodificación para el origen');
      }

      const geocodingDataOrigen = await geocodingResponseOrigen.json();

      // convertir la direccion de origen para que la lea el fetch de mapbox
      const geocodingResponseDestino = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destino2)}.json` +
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
      console.log(directionsData);

      // decodificar el geometry
      const decodedGeometry = polyline.decode(directionsData.routes[0].geometry);
      console.log(decodedGeometry);

      if (currentIndex < decodedGeometry.length) {
        const dataToSend = decodedGeometry[currentIndex]; 
        currentIndex++; // Incrementar currentIndex para la siguiente coordenada

        socket.emit('coordinates', dataToSend);
      } else {
        // Detener el intervalo si ya se enviaron todas las coordenadas
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };
 

  // Inicializar currentIndex a 0 cuando se conecta un nuevo usuario
  currentIndex = 0;

  // Enviar la primera coordenada inmediatamente
  sendCoordinates();

  intervalId = setInterval(sendCoordinates, UPDATE_INTERVAL);

  socket.on('disconnect', () => {
    console.log('User disconnected');
    clearInterval(intervalId);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.listen(PORT, () => {
  initDBConnection();
  console.log(`Linstening on port ${PORT}`);
});
