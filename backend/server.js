// ============================================
//   HERMES — Servidor Principal
//   Arquivo: server.js  (ATUALIZADO)
//
//   NOVIDADE: ao ligar, o servidor também liga
//   o "agendador" — o despertador que envia os
//   emails agendados na hora certa.
//
//   Para rodar: npm start (na pasta backend)
// ============================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importa as rotas
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/emails");
const templateRoutes = require("./routes/templates");

// Importa o agendador (despertador de emails)
const { iniciarAgendador } = require("./agendador");

const app = express();

// ── Configurações ────────────────────────────
app.use(cors());          // permite o frontend conversar com o backend
app.use(express.json());  // entende dados em formato JSON

// ── Rotas ────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/templates", templateRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ mensagem: "Servidor HERMES funcionando! ✅" });
});

// ── Liga o servidor e o agendador ────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend HERMES rodando em http://localhost:${PORT}`);
  iniciarAgendador(); // liga o despertador
});
