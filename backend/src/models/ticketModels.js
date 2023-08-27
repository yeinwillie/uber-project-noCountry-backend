import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  id_conductor: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor" },
  id_viaje: { type: mongoose.Schema.Types.ObjectId, ref: "Viaje" },
  costo: {
    type: Number,
    required: true,
  },
  type:{ 
    type: String,
    enum: ['efectivo', 'tarjeta']
},
  
  fecha: {
    type: Date,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket
