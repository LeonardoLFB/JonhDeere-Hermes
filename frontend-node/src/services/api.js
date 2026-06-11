// ============================================
//   HERMES — Garçom (comunicação com o backend)
//   Arquivo: src/services/api.js  (ATUALIZADO)
//
//   NOVIDADE: enviarEmail aceita um parâmetro
//   opcional "agendadoPara" (data/hora futura).
// ============================================

// Endereço onde o backend está rodando
const API = "http://localhost:3001/api";

// ── Função auxiliar ──────────────────────────
async function pedido(rota, opcoes = {}) {
  const resposta = await fetch(`${API}${rota}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao comunicar com o servidor.");
  }

  return dados;
}

// ── LOGIN ────────────────────────────────────
export function login(email, senha) {
  return pedido("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

// ── CADASTRAR USUÁRIO ────────────────────────
export function cadastrarUsuario(nome, email, senha, perfil) {
  return pedido("/auth/cadastrar", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha, perfil }),
  });
}

// ── LISTAR USUÁRIOS ──────────────────────────
export function listarUsuarios() {
  return pedido("/auth/usuarios");
}

// ── EXCLUIR USUÁRIO ──────────────────────────
export function excluirUsuario(id) {
  return pedido(`/auth/usuarios/${id}`, {
    method: "DELETE",
  });
}

// ── ENVIAR OU AGENDAR EMAIL ──────────────────
// "agendadoPara" é opcional:
//   null → envia agora
//   "2026-06-15T14:30" → agenda para essa hora
export function enviarEmail(destinatario, assunto, corpo, id_usuario, id_template, agendadoPara) {
  return pedido("/emails", {
    method: "POST",
    body: JSON.stringify({
      destinatario,
      assunto,
      corpo,
      id_usuario,
      id_template,
      agendado_para: agendadoPara || null,
    }),
  });
}

// ── HISTÓRICO ────────────────────────────────
export function listarEmails() {
  return pedido("/emails");
}

// ── TEMPLATES ────────────────────────────────
export function listarTemplates() {
  return pedido("/templates");
}

export function criarTemplate(nome, assunto, corpo) {
  return pedido("/templates", {
    method: "POST",
    body: JSON.stringify({ nome, assunto, corpo }),
  });
}

// ── ESTATÍSTICAS (Dashboard) ─────────────────
export function buscarEstatisticas() {
  return pedido("/templates/stats");
}
