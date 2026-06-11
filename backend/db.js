// ============================================
//   HERMES — Conexão com o Banco de Dados
//   Arquivo: db.js
//
//   Este arquivo é o "cabo" que liga o backend
//   ao PostgreSQL. Todos os outros arquivos
//   usam ele para fazer consultas.
//   As senhas vêm do arquivo .env
// ============================================

const { Pool } = require("pg");
require("dotenv").config();

// Cria a "piscina" de conexões com o banco.
// (Piscina = várias conexões prontas para uso,
//  mais rápido do que abrir uma nova toda vez)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Exporta para os outros arquivos usarem
module.exports = pool;
