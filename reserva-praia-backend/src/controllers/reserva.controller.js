const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// Rota para criar reserva
router.post('/', reservaController.criarReserva);

// Rota para listar reservas futuras
router.get('/', reservaController.listarFuturas);

// Rota para o histórico (Ajustada para a função que já existe)
router.get('/historico', reservaController.listarHistorico);

// Rota para cancelar
router.delete('/:id', reservaController.excluirReserva);

module.exports = router;