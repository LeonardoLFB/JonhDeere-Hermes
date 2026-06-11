// ============================================
//   SISTEMA JOHN DEERE — Dados de Exemplo
//   Arquivo: src/data/mockData.js
//
//   Este arquivo simula os dados que viriam
//   de uma API ou banco de dados real.
//   Quando o backend estiver pronto, basta
//   substituir esses dados pelas chamadas
//   fetch/axios para a sua API Java.
// ============================================

// ── Usuários do sistema ──────────────────────
// Estes dados ficam NO BACKEND (Java).
// Estão aqui apenas como referência de
// quais campos a API deve receber/retornar.
//
// Endpoint esperado:
//   POST /api/auth/login
//   Body: { email, senha }
//   Retorno sucesso:  { nome, perfil }
//   Retorno falha:    status 401
 
export const usuariosMock = [
  { email: "admin@johndeere.com",  senha: "admin123",  nome: "Administrador", perfil: "admin"  },
  { email: "dev@johndeere.com",    senha: "dev123",    nome: "Desenvolvedor",  perfil: "dev"    },
  { email: "viewer@johndeere.com", senha: "viewer123", nome: "Visualizador",   perfil: "viewer" },
];

// ── Histórico de emails enviados ─────────────
// Cada objeto representa um email que foi
// enviado ou agendado pelo sistema.

export const emails = [
  {
    id: 1,
    para: "plataforma@jd.com",
    assunto: "Deploy Pipeline — Semana 12",
    template: "Aviso de Deploy",
    status: "ok",       // ok = entregue, ag = agendado, err = falha
    data: "29/03 09:14",
  },
  {
    id: 2,
    para: "gestores@jd.com",
    assunto: "Relatório Semanal de Incidentes",
    template: "Relatório Semanal",
    status: "ag",
    data: "30/03 08:00",
  },
  {
    id: 3,
    para: "suporte@jd.com",
    assunto: "Manutenção — Sábado à noite",
    template: "Janela de Manutenção",
    status: "ok",
    data: "28/03 14:00",
  },
  {
    id: 4,
    para: "devs@jd.com",
    assunto: "Nova Versão API v2.4.1",
    template: "Alerta de Segurança",
    status: "err",
    data: "27/03 11:30",
  },
  {
    id: 5,
    para: "security@jd.com",
    assunto: "Alerta SSO — Acesso Indevido",
    template: "Alerta de Segurança",
    status: "ok",
    data: "27/03 07:50",
  },
];


// ── Templates disponíveis ────────────────────
// Modelos de email que os times podem usar
// para padronizar as comunicações.

export const templates = [
  {
    id: 1,
    nome: "Aviso de Deploy",
    categoria: "Infra",
    versao: "v3",
  },
  {
    id: 2,
    nome: "Relatório Semanal",
    categoria: "Gestão",
    versao: "v2",
  },
  {
    id: 3,
    nome: "Alerta de Segurança",
    categoria: "Segurança",
    versao: "v5",
  },
  {
    id: 4,
    nome: "Janela de Manutenção",
    categoria: "Infra",
    versao: "v2",
  },
  {
    id: 5,
    nome: "Boas-vindas Onboarding",
    categoria: "RH",
    versao: "v1",
  },
];


// ── Estatísticas do Dashboard ────────────────
// Números exibidos nos cards do topo.

export const estatisticas = {
  emailsHoje: 847,
  taxaEntrega: "98%",
  emailsNaFila: 4,
};