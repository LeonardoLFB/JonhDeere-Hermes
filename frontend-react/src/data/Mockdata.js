// ============================================================
// HERMES – Mock Data
// ============================================================

export const MOCK_USER = { username: "joao.silva", role: "Administrador" };

// ---------- TEMPLATES ----------
export const mockTemplates = [
  {
    id: 1,
    name: "Boas-vindas ao Sistema",
    category: "Onboarding",
    versions: [
      {
        version: "1.0",
        updatedAt: "2025-03-10",
        subject: "Bem-vindo ao {{sistema}}, {{nome}}!",
        body: `<p>Olá, <strong>{{nome}}</strong>!</p>
<p>Seja bem-vindo ao <strong>{{sistema}}</strong>. Seu acesso foi configurado com sucesso.</p>
<p>Para começar, acesse: <a href="{{link}}">{{link}}</a></p>
<p>Em caso de dúvidas, entre em contato com o suporte.</p>`,
        variables: ["nome", "sistema", "link"],
      },
      {
        version: "2.0",
        updatedAt: "2025-04-02",
        subject: "Acesso liberado – {{sistema}} | {{nome}}",
        body: `<p>Prezado(a) <strong>{{nome}}</strong>,</p>
<p>Seu acesso ao <strong>{{sistema}}</strong> foi liberado em {{data}}.</p>
<p>Acesse agora: <a href="{{link}}">Clique aqui</a></p>`,
        variables: ["nome", "sistema", "data", "link"],
      },
    ],
  },
  {
    id: 2,
    name: "Confirmação de Pedido",
    category: "Comercial",
    versions: [
      {
        version: "1.0",
        updatedAt: "2025-01-20",
        subject: "Pedido #{{pedido}} confirmado",
        body: `<p>Olá, <strong>{{nome}}</strong>!</p>
<p>Seu pedido <strong>#{{pedido}}</strong> foi confirmado e será processado em breve.</p>
<p>Valor total: <strong>R$ {{valor}}</strong></p>
<p>Previsão de entrega: {{data_entrega}}</p>`,
        variables: ["nome", "pedido", "valor", "data_entrega"],
      },
    ],
  },
  {
    id: 3,
    name: "Alerta de Deploy",
    category: "Infraestrutura",
    versions: [
      {
        version: "1.0",
        updatedAt: "2025-02-14",
        subject: "[DEPLOY] {{ambiente}} – versão {{versao}}",
        body: `<p>Time,</p>
<p>O deploy da versão <strong>{{versao}}</strong> foi realizado no ambiente <strong>{{ambiente}}</strong>.</p>
<p>Responsável: {{responsavel}}</p>
<p>Data/Hora: {{data}}</p>`,
        variables: ["ambiente", "versao", "responsavel", "data"],
      },
      {
        version: "1.1",
        updatedAt: "2025-04-10",
        subject: "[{{status}}] Deploy {{ambiente}} – v{{versao}}",
        body: `<p><strong>Status:</strong> {{status}}</p>
<p><strong>Ambiente:</strong> {{ambiente}}</p>
<p><strong>Versão:</strong> {{versao}}</p>
<p><strong>Responsável:</strong> {{responsavel}}</p>
<p><strong>Data:</strong> {{data}}</p>`,
        variables: ["status", "ambiente", "versao", "responsavel", "data"],
      },
    ],
  },
  {
    id: 4,
    name: "Relatório Semanal",
    category: "Gestão",
    versions: [
      {
        version: "1.0",
        updatedAt: "2025-03-28",
        subject: "Relatório da Semana {{semana}} – {{time}}",
        body: `<p>Olá equipe,</p>
<p>Segue o relatório da semana <strong>{{semana}}</strong> do time <strong>{{time}}</strong>.</p>
<p>Entregas: {{entregas}}</p>
<p>Pendências: {{pendencias}}</p>`,
        variables: ["semana", "time", "entregas", "pendencias"],
      },
    ],
  },
  {
    id: 5,
    name: "Redefinição de Senha",
    category: "Segurança",
    versions: [
      {
        version: "1.0",
        updatedAt: "2025-04-05",
        subject: "Redefinição de senha solicitada",
        body: `<p>Olá, <strong>{{nome}}</strong>.</p>
<p>Recebemos uma solicitação de redefinição de senha para sua conta.</p>
<p>Clique no link abaixo para criar uma nova senha (válido por {{validade}}):</p>
<p><a href="{{link}}">Redefinir minha senha</a></p>
<p>Se não foi você, ignore este e-mail.</p>`,
        variables: ["nome", "link", "validade"],
      },
    ],
  },
];

// ---------- LOGS ----------
export const mockLogs = [
  { id: 1, status: "delivered", to: "marcos@empresa.com", cc: "", subject: "Alerta de Deploy #441", template: "Alerta de Deploy", sentAt: "2025-04-26 10:32", recipients: 18, size: "42 KB" },
  { id: 2, status: "delivered", to: "team-backend@empresa.com", cc: "gestao@empresa.com", subject: "Release Notes v2.4.1", template: "Relatório Semanal", sentAt: "2025-04-26 09:15", recipients: 42, size: "118 KB" },
  { id: 3, status: "pending", to: "frontend@empresa.com", cc: "", subject: "Revisão de Sprint #22", template: "Relatório Semanal", sentAt: "2025-04-26 09:00", recipients: 7, size: "28 KB" },
  { id: 4, status: "failed", to: "qa@empresa.com", cc: "", subject: "Relatório de Testes – Semana 13", template: "Relatório Semanal", sentAt: "2025-04-26 08:47", recipients: 12, size: "95 KB", error: "Caixa de entrada cheia" },
  { id: 5, status: "delivered", to: "devops@empresa.com", cc: "ti@empresa.com", subject: "Manutenção Programada – Sábado", template: "Alerta de Deploy", sentAt: "2025-04-26 08:20", recipients: 95, size: "37 KB" },
  { id: 6, status: "delivered", to: "joao@empresa.com", cc: "", subject: "Bem-vindo ao Hermes, João!", template: "Boas-vindas ao Sistema", sentAt: "2025-04-25 17:05", recipients: 1, size: "22 KB" },
  { id: 7, status: "failed", to: "contato@externo.com", cc: "", subject: "Confirmação Pedido #9921", template: "Confirmação de Pedido", sentAt: "2025-04-25 14:30", recipients: 1, size: "31 KB", error: "Domínio inexistente" },
  { id: 8, status: "delivered", to: "rh@empresa.com", cc: "", subject: "Redefinição de senha solicitada", template: "Redefinição de Senha", sentAt: "2025-04-25 11:00", recipients: 1, size: "18 KB" },
];

// ---------- AGENDAMENTOS ----------
export const mockScheduled = [
  { id: 1, subject: "Relatório Semanal – Semana 17", template: "Relatório Semanal", scheduledTo: "2025-04-28 08:00", to: "gestao@empresa.com", cc: "", recipients: 12, status: "scheduled" },
  { id: 2, subject: "Manutenção Programada – Maio", template: "Alerta de Deploy", scheduledTo: "2025-04-30 07:00", to: "all@empresa.com", cc: "ti@empresa.com", recipients: 340, status: "scheduled" },
  { id: 3, subject: "Release Notes v2.5.0", template: "Relatório Semanal", scheduledTo: "2025-05-02 09:30", to: "devs@empresa.com", cc: "", recipients: 58, status: "scheduled" },
  { id: 4, subject: "Lembrete: Revisão de Contratos", template: "Relatório Semanal", scheduledTo: "2025-05-05 10:00", to: "juridico@empresa.com", cc: "diretoria@empresa.com", recipients: 8, status: "scheduled" },
  { id: 5, subject: "Campanha Q2 – Clientes Premium", template: "Confirmação de Pedido", scheduledTo: "2025-05-10 14:00", to: "clientes@lista.com", cc: "", recipients: 1240, status: "paused" },
];

// ---------- USUÁRIOS ----------
export const mockUsers = [
  { id: 1, name: "João Silva", username: "joao.silva", email: "joao.silva@empresa.com", role: "Administrador", status: "active", lastLogin: "2025-04-26 10:15" },
  { id: 2, name: "Ana Costa", username: "ana.costa", email: "ana.costa@empresa.com", role: "Operador", status: "active", lastLogin: "2025-04-25 16:40" },
  { id: 3, name: "Carlos Melo", username: "carlos.melo", email: "carlos.melo@empresa.com", role: "Operador", status: "active", lastLogin: "2025-04-24 09:00" },
  { id: 4, name: "Fernanda Lins", username: "fernanda.lins", email: "fernanda.lins@empresa.com", role: "Visualizador", status: "inactive", lastLogin: "2025-03-30 11:20" },
];

// ---------- ESTATÍSTICAS ----------
export const mockStats = [
  { label: "E-mails Enviados Hoje", value: "847", delta: "+12% vs ontem", positive: true },
  { label: "Agendados Pendentes", value: "34", delta: "5 vencem hoje", positive: null },
  { label: "Taxa de Entrega", value: "99.1%", delta: "+0.3% esta semana", positive: true },
  { label: "Falhas (24h)", value: "3", delta: "−2 vs ontem", positive: false },
];