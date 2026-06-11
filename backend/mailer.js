// ============================================
//   HERMES — Carteiro (envio de email real)
//   Arquivo: mailer.js
//
//   Usa a biblioteca "nodemailer" para enviar
//   emails de verdade através do Gmail.
//   O email e a senha de app vêm do .env
// ============================================

const nodemailer = require("nodemailer");
require("dotenv").config();

// Configura o "carteiro": diz a ele para usar
// o Gmail com a sua conta.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // seu email
    pass: process.env.GMAIL_PASS, // senha de app (16 letras)
  },
});

// Função que envia um email.
// Recebe: para quem, assunto e texto.
// Devolve: sucesso (true) ou erro (false).
async function enviarEmail(destinatario, assunto, corpo) {
  try {
    await transporter.sendMail({
      from: `"HERMES - John Deere" <${process.env.GMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      text: corpo,
    });
    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao enviar email:", erro.message);
    return { sucesso: false, erro: erro.message };
  }
}

module.exports = { enviarEmail };
