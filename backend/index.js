import express from 'express';
import dotenv from 'dotenv';
import server from './src/routes/serverRoute.js';
import user from './src/routes/userRoute.js';
import paymentRoute from './src/routes/paymentRoutes.js';
import conductor from './src/routes/conductorRoutes.js';
import { initDBConnection } from './src/data/dbConnection.js';
import login from './src/routes/loginRoute.js';
import registerUser from './src/routes/registerRoute.js';
import emailVerification from './src/routes/registerRoute.js';

import { registerLogin } from './src/controller/registerController.js';

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
    origin: FRONTEND_URL,
  })
);

app.use(bodyParser.json());
app.use('/', server);
app.use(express.json());
app.use('/users', user);

app.use(login);
app.use('/conductor', conductor);
app.use('/', login);
app.use('/', registerUser);
app.use('/', emailVerification);

app.use('/protected-route', validateTokenController);
app.use('/payment', paymentRoute);
app.use('/viajes', viajes);
app.use('/', registerLogin);

app.listen(PORT, () => {
  initDBConnection();
  console.log(`Linstening on port ${PORT}`);
});
