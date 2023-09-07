import mongoose from "mongoose";

const favoritoSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, 
  id_conductor: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor", required: false },
  titulo: {
    type: String,
  },
  direccion: {
    type: String,
  },
  coordenadas: {
    type: [Number],
  },
  icono: {
    type: String,
  },
});

const Favorito = mongoose.model("Favorito",favoritoSchema);

export default Favorito;
