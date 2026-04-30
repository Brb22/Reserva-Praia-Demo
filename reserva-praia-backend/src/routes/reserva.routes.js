const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { notificarReserva } = require('../services/notificacao.service');

const Reserva = mongoose.models.Reserva || mongoose.model('Reserva', new mongoose.Schema({
  nomeCliente:     { type: String, required: true },
  dataInicio:      { type: String, required: true },
  dataFim:         { type: String, required: true },
  emailCliente:    { type: String },
  telefoneCliente: { type: String },
  criadoEm:        { type: Date, default: Date.now },
}));

// Verifica se existe conflito de datas no banco
async function verificarConflito(dataInicio, dataFim, idIgnorar = null) {
  const query = {
    $or: [
      { dataInicio: { $lte: dataFim }, dataFim: { $gte: dataInicio } }
    ]
  };
  if (idIgnorar) query._id = { $ne: idIgnorar };
  const conflito = await Reserva.findOne(query);
  return conflito;
}

// POST /reservas — Criar reserva + notificar
router.post('/', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.body;

    // Verifica conflito antes de salvar
    const conflito = await verificarConflito(dataInicio, dataFim);
    if (conflito) {
      return res.status(409).json({
        error: `Período indisponível! Já existe uma reserva de ${conflito.nomeCliente} de ${new Date(conflito.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')} até ${new Date(conflito.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}.`
      });
    }

    const novaReserva = new Reserva(req.body);
    await novaReserva.save();

    notificarReserva(novaReserva).catch((err) =>
      console.log('Erro nas notificações:', err.message)
    );

    res.status(201).json(novaReserva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /reservas — Todas as reservas
router.get('/', async (req, res) => {
  try {
    const todas = await Reserva.find().sort({ dataInicio: 1 });
    res.json(todas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /reservas/agenda — Reservas futuras (ativas)
router.get('/agenda', async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const futuras = await Reserva.find({ dataFim: { $gte: hoje } }).sort({ dataInicio: 1 });
    res.json(futuras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /reservas/historico — Reservas já encerradas
router.get('/historico', async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const passadas = await Reserva.find({ dataFim: { $lt: hoje } }).sort({ dataFim: -1 });
    res.json(passadas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /reservas/:id — Cancelar reserva
router.delete('/:id', async (req, res) => {
  try {
    const deletada = await Reserva.findByIdAndDelete(req.params.id);
    if (!deletada) return res.status(404).json({ error: 'Reserva não encontrada.' });
    res.json({ message: 'Reserva cancelada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;