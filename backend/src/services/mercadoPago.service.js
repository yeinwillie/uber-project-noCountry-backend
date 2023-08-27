// SDK de Mercado Pago
import dotenv from "dotenv";
import mercadopago from "mercadopago"
dotenv.config();
// Agrega credenciales
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

export default mercadopago;
