import mongoose from "mongoose";

const conductorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  correoElectronico: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  puntuacion: {
    type: String,
  },
  estado: {
    type: String,
    enum: ["activo", "en viaje", "inactivo"],
    required: true,
  },
  vehiculo: {
    type: String,
    enum: ["auto", "utilitario"],
    required: true,
  },
  pagos: {
    type: Number,
    required: true,
  },
});

const Conductor = mongoose.model("Conductor", conductorSchema);

export default Conductor;
