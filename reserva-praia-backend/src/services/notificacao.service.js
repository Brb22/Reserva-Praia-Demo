// =============================================
// NOTIFICAÇÕES — DESATIVADAS TEMPORARIAMENTE
// Para reativar, descomente o código abaixo
// =============================================

// const axios = require('axios');

// const ZAPI_INSTANCE = '3F11045870A512E40001CE167A6A77D6';
// const ZAPI_TOKEN = '0A7FE0802D2A48D00179D2D9';
// const ZAPI_URL = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

// const DESTINATARIOS = [
//   { whatsapp: '5511979569353' },
//   { whatsapp: '5511979569353' },
//   { whatsapp: '5511979569353' },
//   { whatsapp: '5511979569353' },
// ];

// async function enviarWhatsApp(numero, mensagem) {
//   try {
//     await axios.post(
//       ZAPI_URL,
//       { phone: numero, message: mensagem },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Client-Token': ZAPI_TOKEN,
//         }
//       }
//     );
//     console.log(`✅ WhatsApp enviado para ${numero}`);
//   } catch (err) {
//     console.log(`❌ Erro WhatsApp para ${numero}:`, err.response?.data || err.message);
//   }
// }

async function notificarReserva(reserva) {
  console.log(`📋 Reserva registrada: ${reserva.nomeCliente}`);

  // const { nomeCliente, dataInicio, dataFim } = reserva;
  // const dataInicioFormatada = new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR');
  // const dataFimFormatada = new Date(dataFim + 'T00:00:00').toLocaleDateString('pt-BR');
  // const msgWhats =
  //   `🏖️ *NOVA RESERVA - Reserva Praia*\n\n` +
  //   `👤 *Hóspede:* ${nomeCliente}\n` +
  //   `📅 *Check-in:* ${dataInicioFormatada}\n` +
  //   `📅 *Check-out:* ${dataFimFormatada}\n\n` +
  //   `✅ Reserva confirmada com sucesso!`;
  // await Promise.all(
  //   DESTINATARIOS.map(async (d) => {
  //     await enviarWhatsApp(d.whatsapp, msgWhats);
  //   })
  // );
}

module.exports = { notificarReserva };