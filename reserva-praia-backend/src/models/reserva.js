const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  dataInicio: { type: String, required: true },
  dataFim: { type: String, required: true },
  emailCliente: { type: String },
  telefoneCliente: { type: String },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reserva', ReservaSchema);