const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  data: String,
  horario: String,
  pessoas: Number,

  // CONTROLE DE STATUS
  status: {
    type: String,
    enum: ["ativa", "concluida", "cancelada"],
    default: "ativa",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reserva", ReservaSchema);
