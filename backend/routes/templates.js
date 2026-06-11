// ============================================
//   HERMES — Templates e Estatísticas
//   Arquivo: routes/templates.js  (ATUALIZADO)
//
//   NOVIDADE: as estatísticas agora contam
//   também os emails AGENDADOS (na fila).
// ============================================

const express = require("express");
const pool = require("../db");

const router = express.Router();

// ── LISTAR TEMPLATES ─────────────────────────
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nome, assunto, corpo FROM template ORDER BY id"
    );
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// ── CRIAR TEMPLATE ───────────────────────────
router.post("/", async (req, res) => {
  const { nome, assunto, corpo } = req.body;

  if (!nome || !assunto || !corpo) {
    return res.status(400).json({ erro: "Preencha nome, assunto e corpo." });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO template (nome, assunto, corpo)
       VALUES ($1, $2, $3)
       RETURNING id, nome, assunto, corpo`,
      [nome, assunto, corpo]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// ── ESTATÍSTICAS DO DASHBOARD ────────────────
router.get("/stats", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM email)                      AS total_emails,
        (SELECT COUNT(*) FROM email WHERE status = 'ok')  AS enviados,
        (SELECT COUNT(*) FROM email WHERE status = 'ag')  AS agendados,
        (SELECT COUNT(*) FROM email WHERE status = 'err') AS falhas,
        (SELECT COUNT(*) FROM usuario)                    AS usuarios
    `);
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

module.exports = router;
