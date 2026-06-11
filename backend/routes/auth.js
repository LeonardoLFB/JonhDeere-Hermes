// ============================================
//   HERMES — Login e Cadastro de Usuários
//   Arquivo: routes/auth.js
//
//   Duas funções principais:
//   1. POST /api/auth/login     → valida usuário e senha
//   2. POST /api/auth/cadastrar → cria novo usuário
//   3. GET  /api/auth/usuarios  → lista usuários (p/ tela do admin)
// ============================================

const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const router = express.Router();

// ── LOGIN ────────────────────────────────────
// O frontend manda: { email, senha }
// Se estiver certo, devolve: { nome, perfil }
// Se estiver errado, devolve erro 401.
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Procura o usuário pelo email no banco
    const resultado = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );

    // Email não existe? Erro.
    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Email ou senha incorretos." });
    }

    const usuario = resultado.rows[0];

    // 2. Confere a senha.
    // Senhas novas são criptografadas (começam com "$2").
    // Os 3 usuários de teste estão em texto puro.
    let senhaCorreta;
    if (usuario.senha.startsWith("$2")) {
      senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    } else {
      senhaCorreta = senha === usuario.senha;
    }

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Email ou senha incorretos." });
    }

    // 3. Tudo certo! Devolve os dados do usuário
    //    (sem a senha, claro).
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// ── CADASTRAR NOVO USUÁRIO ───────────────────
// O frontend manda: { nome, email, senha, perfil }
// perfil deve ser: 'admin', 'dev' ou 'viewer'
router.post("/cadastrar", async (req, res) => {
  const { nome, email, senha, perfil } = req.body;

  // Validação básica
  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  try {
    // Criptografa a senha antes de guardar
    // (assim nem o admin do banco consegue ler)
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuario (nome, email, senha, perfil)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, perfil`,
      [nome, email, senhaCriptografada, perfil]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    // Código 23505 = email duplicado (regra UNIQUE do banco)
    if (erro.code === "23505") {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// ── LISTAR USUÁRIOS ──────────────────────────
// Para o admin ver quem está cadastrado.
router.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nome, email, perfil FROM usuario ORDER BY id"
    );
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

module.exports = router;
