import { useState, useEffect } from "react";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { listarEmails } from "../services/emailApi";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

// O banco guarda 'ok' / 'ag' / 'err';
// o StatusBadge usa nomes diferentes
const STATUS_BADGE = { ok: "delivered", ag: "scheduled", err: "failed" };

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [erro, setErro] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    listarEmails()
      .then(setLogs)
      .catch(() => setErro("Não foi possível carregar os logs. Verifique se o backend de emails (porta 3001) está ligado."));
  }, []);

  const filtered = logs.filter((l) => {
    const matchStatus = filter === "all" || l.status === filter;
    const busca = search.toLowerCase();
    const matchSearch =
      busca === "" ||
      (l.assunto || "").toLowerCase().includes(busca) ||
      (l.destinatario || "").toLowerCase().includes(busca) ||
      (l.template || "").toLowerCase().includes(busca);
    return matchStatus && matchSearch;
  });

  const countByStatus = (s) => logs.filter((l) => l.status === s).length;

  const FilterBtn = ({ value, label }) => (
    <button
      onClick={() => setFilter(value)}
      style={{
        padding: "7px 16px", borderRadius: RADIUS.full,
        border: `1.5px solid ${filter === value ? COLORS.green : COLORS.border}`,
        background: filter === value ? COLORS.greenLight : COLORS.surface,
        color: filter === value ? COLORS.green : COLORS.textSecondary,
        fontWeight: filter === value ? 700 : 500,
        fontSize: 13, cursor: "pointer", fontFamily: FONT,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT }}>
      <Header
        title="Logs de Envio"
        subtitle="Histórico detalhado de todas as comunicações"
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Total", value: logs.length, color: COLORS.textPrimary, bg: COLORS.surface },
          { label: "Entregues", value: countByStatus("ok"), color: "#2d7a20", bg: "#e8f5e4" },
          { label: "Agendados", value: countByStatus("ag"), color: COLORS.info, bg: COLORS.infoBg },
          { label: "Falhas", value: countByStatus("err"), color: COLORS.danger, bg: COLORS.dangerBg },
        ].map((c) => (
          <div key={c.label} style={{
            background: c.bg, borderRadius: RADIUS.lg,
            border: `1px solid ${COLORS.border}`, padding: "16px 20px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: c.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, letterSpacing: "-0.5px" }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros + Busca */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <FilterBtn value="all" label="Todos" />
          <FilterBtn value="ok" label="Entregues" />
          <FilterBtn value="ag" label="Agendados" />
          <FilterBtn value="err" label="Falhas" />
        </div>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por assunto, e-mail ou template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "9px 14px 9px 34px",
              fontSize: 13, borderRadius: RADIUS.md,
              border: `1.5px solid ${COLORS.border}`,
              outline: "none", color: COLORS.textPrimary,
              background: COLORS.surface,
              width: 300, fontFamily: FONT,
            }}
          />
        </div>
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
                {["Status", "Assunto", "Para", "Template", "Enviado por", "Data"].map((h) => (
                  <th key={h} style={{
                    fontSize: 11, color: COLORS.textMuted, fontWeight: 600,
                    textAlign: "left", padding: "12px 16px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
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
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                      <StatusBadge status={STATUS_BADGE[row.status] || "pending"} />
                    </td>
                    <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {row.assunto}
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textSecondary, verticalAlign: "middle", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.destinatario}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                      {row.template || "—"}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                      {row.enviado_por || "—"}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textMuted, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      {row.data}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "right" }}>
        Mostrando {filtered.length} de {logs.length} registros
      </div>
    </div>
  );
}
