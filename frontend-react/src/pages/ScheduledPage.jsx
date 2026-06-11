import { useState, useEffect } from "react";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { listarEmails, cancelarAgendado } from "../services/emailApi";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

export default function ScheduledPage({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [erro, setErro] = useState("");

  // Busca os emails e mantém só os agendados (status 'ag')
  const carregar = async () => {
    try {
      const emails = await listarEmails();
      setItems(emails.filter((e) => e.status === "ag"));
      setErro("");
    } catch {
      setErro("Não foi possível carregar os agendamentos. Verifique se o backend de emails (porta 3001) está ligado.");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const cancelItem = async (id) => {
    if (!window.confirm("Cancelar este agendamento? O email não será enviado.")) return;
    try {
      await cancelarAgendado(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert(e.response?.data?.erro || "Erro ao cancelar o agendamento.");
    }
  };

  // Conta os destinatários (separados por vírgula)
  const contarDestinatarios = (destinatario) =>
    (destinatario || "").split(",").filter((d) => d.trim()).length;

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

      {erro && (
        <div style={{
          background: COLORS.dangerBg,
          border: `1px solid ${COLORS.dangerBorder}`,
          color: COLORS.danger,
          borderRadius: RADIUS.md,
          padding: "12px 16px",
          fontSize: 13,
        }}>
          ⚠️ {erro}
        </div>
      )}

      {/* Resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {[
          { label: "Total Agendados", value: items.length, color: COLORS.info, bg: COLORS.infoBg },
          { label: "Destinatários Totais", value: items.reduce((a, i) => a + contarDestinatarios(i.destinatario), 0), color: COLORS.green, bg: COLORS.greenLight },
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
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: COLORS.textMuted, fontSize: 14 }}>
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <StatusBadge status="scheduled" />
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{row.assunto}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Para: {row.destinatario}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                      {row.template || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, verticalAlign: "middle" }}>
                      {row.data}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle", textAlign: "center" }}>
                      {contarDestinatarios(row.destinatario)}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
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
