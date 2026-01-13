

const express = require('express');
const router = express.Router(); // <--- ESSA LINHA QUE ESTÁ FALTANDO!

const nodemailer = require('nodemailer');
const Reserva = require('../models/Reserva');

// ... resto do código (router.post, router.get, etc)

module.exports = router;

router.post('/', async (req, res) => {
  try {
    const { nomeCliente, dataInicio, dataFim } = req.body; // Tiramos e-mail e telefone daqui

    // 1. Salva no Banco (só com o nome e datas)
    const novaReserva = new Reserva({ nomeCliente, dataInicio, dataFim });
    await novaReserva.save();

    // 2. Configura o e-mail FIXO para a proprietária
    const mailOptions = {
      from: `"Sistema Reserva" <${process.env.EMAIL_USER}>`,
      to: 'EMAIL_DA_PROPRIETARIA_AQUI@gmail.com', // <-- COLOQUE O E-MAIL DELA AQUI
      subject: '🚨 NOVA RESERVA REALIZADA!',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Nova reserva no sistema!</h2>
          <p><b>Nome do Cliente:</b> ${nomeCliente}</p>
          <p><b>Data de Entrada:</b> ${dataInicio}</p>
          <p><b>Data de Saída:</b> ${dataFim}</p>
          <hr>
          <p>Verifique o painel administrativo para mais detalhes.</p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json(novaReserva);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar reserva" });
  }
});