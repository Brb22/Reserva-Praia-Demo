const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // pode ser Outlook, etc
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function enviarEmail(destinatario, assunto, texto) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: assunto,
    text: texto
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarEmail };
