const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Reserva = mongoose.models.Reserva || mongoose.model('Reserva', new mongoose.Schema({
  nomeCliente: String,
  dataInicio: String, // Guardamos como String YYYY-MM-DD
  dataFim: String,
  quarto: String
}));

// ROTA PARA CRIAR (POST /reservas)
router.post('/', async (req, res) => {
  try {
    const novaReserva = new Reserva(req.body);
    await novaReserva.save();
    res.status(201).json(novaReserva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ROTA PARA AGENDA (GET /reservas/agenda)
router.get('/agenda', async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const futuras = await Reserva.find({ dataFim: { $gte: hoje } }).sort({ dataInicio: 1 });
    res.json(futuras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTA PARA APAGAR (DELETE /reservas/:id)
router.delete('/:id', async (req, res) => {
  try {
    await Reserva.findByIdAndDelete(req.params.id);
    res.json({ message: "Apagado!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;