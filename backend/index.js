import express from 'express';
import dotenv from 'dotenv';
import server from './src/routes/serverRoute.js';
import user from './src/routes/userRoute.js';
import paymentRoute from './src/routes/paymentRoutes.js';
import conductor from './src/routes/conductorRoutes.js';
import { initDBConnection } from './src/data/dbConnection.js';
import authRoutes from "./src/routes/authRoutes.js"

import viajes from './src/routes/viajesRoutes.js';
import { validateTokenController } from './src/controller/validateTokenController.js';

import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
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
app.use('/', server);
app.use(express.json());
app.use('/users', user);

app.use('/conductor', conductor);

app.use("/api", authRoutes)
app.use('/protected-route', validateTokenController);
app.use('/payment', paymentRoute);
app.use('/viajes', viajes);

app.listen(PORT, () => {
  initDBConnection();
  console.log(`Linstening on port ${PORT}`);
});
