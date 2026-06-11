import Header from "../components/Header";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { mockStats, mockLogs } from "../data/mockData";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const QuickCard = ({ icon, label, desc, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: RADIUS.lg,
      padding: "20px 18px",
      cursor: "pointer",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      boxShadow: SHADOW.card,
      fontFamily: FONT,
      transition: "box-shadow 0.15s, border-color 0.15s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = COLORS.green;
      e.currentTarget.style.boxShadow = SHADOW.elevated;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = COLORS.border;
      e.currentTarget.style.boxShadow = SHADOW.card;
    }}
  >
    <div style={{ color: COLORS.green, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{label}</div>
    <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{desc}</div>
  </button>
);

export default function DashboardPage({ onNavigate }) {
  const recent = mockLogs.slice(0, 5);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: FONT }}>
      <Header
        title="Dashboard"
        subtitle={today.charAt(0).toUpperCase() + today.slice(1)}
        action={
          <button
            onClick={() => onNavigate("compose")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: COLORS.green, color: "#fff",
              border: "none", borderRadius: RADIUS.md,
              padding: "10px 20px", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Novo E-mail
          </button>
        }
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {mockStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Atividade recente */}
      <div style={{
        background: COLORS.surface,
        borderRadius: RADIUS.lg,
        border: `1px solid ${COLORS.border}`,
        padding: "22px 24px",
        boxShadow: SHADOW.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>Atividade Recente</h2>
          <button
            onClick={() => onNavigate("logs")}
            style={{
              background: "transparent", border: `1px solid ${COLORS.border}`,
              color: COLORS.green, borderRadius: RADIUS.sm,
              padding: "5px 14px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            Ver todos
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Status", "Assunto", "Template", "Destinatários", "Enviado em"].map((h) => (
                  <th key={h} style={{
                    fontSize: 11, color: COLORS.textMuted, fontWeight: 600,
                    textAlign: "left", padding: "8px 12px",
                    borderBottom: `1px solid ${COLORS.borderLight}`,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "12px 12px", verticalAlign: "middle" }}>
                    <StatusBadge status={row.status} />
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, verticalAlign: "middle" }}>
                    {row.subject}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                    {row.template}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle", textAlign: "center" }}>
                    {row.recipients}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 12, color: COLORS.textMuted, verticalAlign: "middle" }}>
                    {row.sentAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acesso rápido */}
      <div>
        <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>Acesso Rápido</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <QuickCard
            onClick={() => onNavigate("compose")}
            label="Redigir E-mail"
            desc="Envio imediato ou agendado com templates"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>}
          />
          <QuickCard
            onClick={() => onNavigate("templates")}
            label="Gerenciar Templates"
            desc="Crie e edite modelos com variáveis"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>}
          />
          <QuickCard
            onClick={() => onNavigate("scheduled")}
            label="E-mails Agendados"
            desc="Visualize e gerencie a fila de envios"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
          <QuickCard
            onClick={() => onNavigate("logs")}
            label="Logs de Sistema"
            desc="Histórico detalhado de todos os envios"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
          />
        </div>
      </div>
    </div>
  );
}