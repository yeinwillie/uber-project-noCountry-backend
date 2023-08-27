import Ticket from '../models/ticketModels.js';
import dotenv from 'dotenv';
import mercadopago from 'mercadopago';
import Conductor from '../models/conductorModels.js';
import mongoose from 'mongoose';
dotenv.config();
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

// const postPayment = async (req, res) => {
//   Recibe los campos obligatorios para la creación de una donación (inclido el comentario)
//   const payment = new Ticket(req.body);

//   try {
//     if (payment.type == "tarjeta") {
//     }

//     donation.completed = "completed";
//     const newDonation = await donation.save();
//     res.status(201).json(newDonation);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error.message);
//   }
// };

export const PayCard = async (req, res) => {
  const { amount, id_usuario, id_conductor, id_viaje, costo, metodo, fecha } =
    req.body;
  // const datos = req.body

  try {
    if (amount <= 0) {
      res.status(400).json({ amount: 'Invalid' });
      return;
    }
    const newTicket = new Ticket({
      id_user: new mongoose.Types.ObjectId(id_usuario),
      id_conductor: new mongoose.Types.ObjectId(id_conductor),
      id_viaje: new mongoose.Types.ObjectId(id_viaje),
      costo: amount,
      type: metodo,
      fecha: new Date(fecha),
    });
    console.log('hola');

    const conductor = await Conductor.findById(id_conductor);
    conductor.pagos += parseInt(amount);
    await conductor.save();
    await newTicket.save();

    let preference = {
      transaction_amount: parseInt(amount),
      items: [
        {
          id: newTicket.id_viaje,
          title: 'Pago por viaje en Uber',
          unit_price: newTicket.costo,
          quantity: 1,
        },
      ],
      back_urls: {
        success: process.env.URL + id_conductor,
        failure: 'URL_DE_FALLA',
        pending: 'URL_DE_PENDIENTE',
      },
      auto_return: 'approved',
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        res.status(200).json(response.body.init_point);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
