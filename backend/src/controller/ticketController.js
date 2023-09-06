import Ticket from "../models/ticketModels.js";
import Viaje from "../models/viajesModels.js";
import mongoose from 'mongoose';


const obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate(
      "id_user id_conductor id_viaje"
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los tickets" });
  }
};
const obtenerTicketPorId = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "id_user id_conductor id_viaje"
    );
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};
const actualizarTicket = async (req, res) => {
  try {
    const ticketData = req.body;
    const ticketActualizado = await Ticket.findByIdAndUpdate(
      req.params.id,
      ticketData,
      { new: true }
    );
    if (!ticketActualizado) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.json(ticketActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el ticket" });
  }
};
const eliminarTicket = async (req, res) => {
  try {
    const ticketEliminado = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticketEliminado) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.json({ mensaje: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el ticket" });
  }
};
const obtenerViajesDeConductor = async (req, res) => {
  try {
    const conductorId = req.params.id; // ID del conductor
    const viajes = await Ticket.find({ id_conductor: conductorId }).populate("id_user").populate("id_conductor").populate("id_viaje");
    res.json(viajes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los viajes del conductor" });
  }
};
const obtenerViajesDeUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id; 
        console.log(usuarioId);
        
        const ticket = await Ticket.find({ id_user: usuarioId }).populate("id_user").populate("id_conductor").populate("id_viaje");
        
        console.log(ticket);
        res.json(ticket);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los viajes del usuario' });
      }
};

export {
  obtenerTickets,
  obtenerTicketPorId,
  actualizarTicket,
  eliminarTicket,
  obtenerViajesDeConductor,
  obtenerViajesDeUsuario,
};
