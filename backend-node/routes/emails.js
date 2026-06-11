// ============================================
//   HERMES — Envio de Email e Histórico
//   Arquivo: routes/emails.js  (ATUALIZADO)
//
//   NOVIDADE: agendamento de envio.
//   - Se vier "agendado_para" → grava com
//     status 'ag' e NÃO envia agora (o
//     agendador envia na hora marcada)
//   - Se não vier → envia imediatamente
// ============================================

const express = require("express");
const pool = require("../db");
const { enviarEmail } = require("../mailer");

const router = express.Router();

// ── ENVIAR OU AGENDAR EMAIL ──────────────────
// O frontend manda:
//   { destinatario, assunto, corpo, id_usuario,
//     id_template, agendado_para }
// "agendado_para" é opcional (ex: "2026-06-15T14:30")
router.post("/", async (req, res) => {
  const { destinatario, assunto, corpo, id_usuario, id_template, agendado_para } = req.body;

  if (!destinatario || !assunto || !corpo) {
    return res
      .status(400)
      .json({ erro: "Preencha destinatário, assunto e mensagem." });
  }

  try {
    // ── CAMINHO 1: AGENDADO ──────────────────
    // Só grava no banco com status 'ag'.
    // O agendador cuida do envio depois.
    if (agendado_para) {
      const resultado = await pool.query(
        `INSERT INTO email (destinatario, assunto, corpo, status, id_usuario, id_template, agendado_para)
         VALUES ($1, $2, $3, 'ag', $4, $5, $6)
         RETURNING *`,
        [destinatario, assunto, corpo, id_usuario || null, id_template || null, agendado_para]
      );

      return res.status(201).json({
        mensagem: "Email agendado com sucesso!",
        email: resultado.rows[0],
      });
    }

    // ── CAMINHO 2: ENVIO IMEDIATO ────────────
    // 1. Envia o email real agora
    const envio = await enviarEmail(destinatario, assunto, corpo);
    const status = envio.sucesso ? "ok" : "err";

    // 2. Grava no histórico (sempre, mesmo se falhou)
    const resultado = await pool.query(
      `INSERT INTO email (destinatario, assunto, corpo, status, id_usuario, id_template)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [destinatario, assunto, corpo, status, id_usuario || null, id_template || null]
    );

    if (envio.sucesso) {
      res.status(201).json({
        mensagem: "Email enviado com sucesso!",
        email: resultado.rows[0],
      });
    } else {
      res.status(502).json({
        erro: "O email não pôde ser entregue: " + envio.erro,
        email: resultado.rows[0],
      });
    }
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// ── HISTÓRICO ────────────────────────────────
// Lista todos os emails: enviados e agendados.
// Para os agendados, a coluna "data" mostra a
// hora MARCADA; para os demais, a hora do envio.
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT e.id,
              e.destinatario,
              e.assunto,
              e.status,
              TO_CHAR(
                CASE WHEN e.status = 'ag' THEN e.agendado_para
                     ELSE e.enviado_em END,
                'DD/MM HH24:MI'
              ) AS data,
              u.nome AS enviado_por,
              t.nome AS template
       FROM email e
       LEFT JOIN usuario  u ON u.id = e.id_usuario
       LEFT JOIN template t ON t.id = e.id_template
       ORDER BY e.enviado_em DESC`
    );
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// ── CANCELAR AGENDADO ────────────────────────
// Apaga um email agendado que ainda não foi
// enviado (status 'ag'). Emails já enviados
// não podem ser cancelados.
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      "DELETE FROM email WHERE id = $1 AND status = 'ag' RETURNING id",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ erro: "Agendamento não encontrado (ou o email já foi enviado)." });
    }

    res.json({ mensagem: "Agendamento cancelado." });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

module.exports = router;
