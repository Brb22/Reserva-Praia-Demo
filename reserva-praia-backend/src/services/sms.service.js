const axios = require("axios");

const TOKEN = process.env.TOKEN_SMS;

async function enviarSMS(numero, mensagem) {
  try {
    await axios.post("https://api.totalvoice.com.br/sms", {
      numero,
      mensagem
    }, {
      headers: { "Access-Token": TOKEN }
    });
  } catch (err) {
    console.log("Erro ao enviar SMS:", err.message);
  }
}

module.exports = { enviarSMS };
