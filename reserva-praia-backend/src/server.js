process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PUT'] }));
app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb://brunorochabritto94_db_user:Xtrab2221@ac-vfbmvqe-shard-00-00.mllnxld.mongodb.net:27017,ac-vfbmvqe-shard-00-01.mllnxld.mongodb.net:27017,ac-vfbmvqe-shard-00-02.mllnxld.mongodb.net:27017/?ssl=true&replicaSet=atlas-n96reb-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(uri, { dbName: 'reserva_demo' })
  .then(() => console.log("✅ MongoDB Demo Conectado!"))
  .catch((err) => console.log("❌ Erro ao conectar banco:", err.message));

const reservaRoutes = require('./routes/reserva.routes');
app.use('/reservas', reservaRoutes);

app.get("/", (req, res) => {
  res.send("🚀 SERVIDOR DEMO RODANDO!");
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ON na porta ${PORT}`);
});