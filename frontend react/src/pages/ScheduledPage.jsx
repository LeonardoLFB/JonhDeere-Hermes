import { useState } from "react";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { mockScheduled } from "../data/mockData";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

export default function ScheduledPage({ onNavigate }) {
  const [items, setItems] = useState(mockScheduled);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  const cancelItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const pauseToggle = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "paused" ? "scheduled" : "paused" }
          : i
      )
    );
  };

  const FilterBtn = ({ value, label, count }) => (
    <button
      onClick={() => setFilter(value)}
      style={{
        padding: "7px 16px",
        borderRadius: RADIUS.full,
        border: `1.5px solid ${filter === value ? COLORS.green : COLORS.border}`,
        background: filter === value ? COLORS.greenLight : COLORS.surface,
        color: filter === value ? COLORS.green : COLORS.textSecondary,
        fontWeight: filter === value ? 700 : 500,
        fontSize: 13, cursor: "pointer", fontFamily: FONT,
        display: "flex", alignItems: "center", gap: 6,
      }}
    >
      {label}
      {count !== undefined && (
        <span style={{
          background: filter === value ? COLORS.green : COLORS.border,
          color: filter === value ? "#fff" : COLORS.textMuted,
          borderRadius: RADIUS.full, padding: "1px 7px",
          fontSize: 11, fontWeight: 700,
        }}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT }}>
      <Header
        title="Agendamentos"
        subtitle="E-mails programados para envio futuro"
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agendar E-mail
          </button>
        }
      />

      {/* Resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Total Agendados", value: items.filter(i => i.status === "scheduled").length, color: COLORS.info, bg: COLORS.infoBg },
          { label: "Pausados", value: items.filter(i => i.status === "paused").length, color: "#6d28d9", bg: "#f4f0ff" },
          { label: "Destinatários Totais", value: items.reduce((a, i) => a + i.recipients, 0).toLocaleString("pt-BR"), color: COLORS.green, bg: COLORS.greenLight },
        ].map((c) => (
          <div key={c.label} style={{
            background: c.bg, borderRadius: RADIUS.lg,
            border: `1px solid ${COLORS.border}`, padding: "18px 22px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: c.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.textPrimary, letterSpacing: "-0.5px" }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8 }}>
        <FilterBtn value="all" label="Todos" count={items.length} />
        <FilterBtn value="scheduled" label="Agendados" count={items.filter(i => i.status === "scheduled").length} />
        <FilterBtn value="paused" label="Pausados" count={items.filter(i => i.status === "paused").length} />
      </div>

      {/* Tabela */}
      <div style={{
        background: COLORS.surface, borderRadius: RADIUS.lg,
        border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.card,
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                {["Status", "Assunto", "Template", "Envio Agendado", "Destinatários", "Ações"].map((h) => (
                  <th key={h} style={{
                    fontSize: 11, color: COLORS.textMuted, fontWeight: 600,
                    textAlign: "left", padding: "12px 16px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: COLORS.textMuted, fontSize: 14 }}>
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <StatusBadge status={row.status} />
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{row.subject}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Para: {row.to}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                      {row.template}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{row.scheduledTo.split(" ")[0]}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>{row.scheduledTo.split(" ")[1]}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle", textAlign: "center" }}>
                      {row.recipients.toLocaleString("pt-BR")}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => pauseToggle(row.id)}
                          title={row.status === "paused" ? "Retomar" : "Pausar"}
                          style={{
                            padding: "5px 12px", borderRadius: RADIUS.sm,
                            border: `1px solid ${COLORS.border}`,
                            background: COLORS.surface, color: COLORS.textSecondary,
                            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                          }}
                        >
                          {row.status === "paused" ? "▶ Retomar" : "⏸ Pausar"}
                        </button>
                        <button
                          onClick={() => cancelItem(row.id)}
                          title="Cancelar"
                          style={{
                            padding: "5px 12px", borderRadius: RADIUS.sm,
                            border: `1px solid ${COLORS.dangerBorder}`,
                            background: COLORS.dangerBg, color: COLORS.danger,
                            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}