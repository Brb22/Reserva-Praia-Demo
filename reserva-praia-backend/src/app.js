const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const reservaRoutes = require("./routes/reserva.routes");
app.use("/reservas", reservaRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("Reserva Praia Backend OK!");
});

module.exports = app;

