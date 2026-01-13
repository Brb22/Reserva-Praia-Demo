process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Puxando o nome exato que está no seu .env (MONGO_URI)
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("✅ AGORA FOI! MongoDB Conectado"))
  .catch((err) => console.log("❌ Erro ao conectar:", err.message));

// Rotas
const reservaRoutes = require('./routes/reserva.routes');
app.use('/reservas', reservaRoutes);

app.listen(3333, () => console.log("🚀 Servidor ON na porta 3333"));