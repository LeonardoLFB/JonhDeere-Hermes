// ============================================
//   Comunicação com o backend de EMAILS
//   (Node/Express, porta 3001 — pasta backend-node)
//
//   Os usuários ficam no backend Spring (8081);
//   os emails e templates ficam neste backend.
// ============================================

import axios from "axios";

const API = "http://localhost:3001/api";

// ── TEMPLATES ────────────────────────────────
export async function listarTemplates() {
  const { data } = await axios.get(`${API}/templates`);
  return data;
}

export async function criarTemplate(nome, assunto, corpo) {
  const { data } = await axios.post(`${API}/templates`, { nome, assunto, corpo });
  return data;
}

// ── EMAILS ───────────────────────────────────
// "agendado_para" é opcional: null envia agora,
// "2026-06-15T14:30" agenda para essa hora.
export async function enviarEmail({ destinatario, assunto, corpo, id_template, agendado_para }) {
  const { data } = await axios.post(`${API}/emails`, {
    destinatario,
    assunto,
    corpo,
    id_usuario: null,
    id_template: id_template || null,
    agendado_para: agendado_para || null,
  });
  return data;
}

export async function listarEmails() {
  const { data } = await axios.get(`${API}/emails`);
  return data;
}

export async function cancelarAgendado(id) {
  const { data } = await axios.delete(`${API}/emails/${id}`);
  return data;
}

// ── VARIÁVEIS DE TEMPLATE ────────────────────
// Encontra os {{nomes}} dentro do texto do template
export function extrairVariaveis(texto) {
  const encontradas = (texto || "").match(/{{\s*([\w.]+)\s*}}/g) || [];
  return [...new Set(encontradas.map((v) => v.replace(/[{}\s]/g, "")))];
}

// Substitui os {{nomes}} pelos valores digitados
export function aplicarVariaveis(texto, valores) {
  return (texto || "").replace(/{{\s*([\w.]+)\s*}}/g, (original, nome) =>
    valores[nome] ? valores[nome] : original
  );
}
