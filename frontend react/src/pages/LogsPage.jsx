import { useState } from "react";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { mockLogs } from "../data/mockData";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

export default function LogsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = mockLogs.filter((l) => {
    const matchStatus = filter === "all" || l.status === filter;
    const matchSearch =
      search === "" ||
      l.subject.toLowerCase().includes(search.toLowerCase()) ||
      l.to.toLowerCase().includes(search.toLowerCase()) ||
      l.template.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const countByStatus = (s) => mockLogs.filter((l) => l.status === s).length;

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

      {/* Resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Total", value: mockLogs.length, color: COLORS.textPrimary, bg: COLORS.surface },
          { label: "Entregues", value: countByStatus("delivered"), color: "#2d7a20", bg: "#e8f5e4" },
          { label: "Pendentes", value: countByStatus("pending"), color: COLORS.warning, bg: COLORS.warningBg },
          { label: "Falhas", value: countByStatus("failed"), color: COLORS.danger, bg: COLORS.dangerBg },
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
          <FilterBtn value="delivered" label="Entregues" />
          <FilterBtn value="pending" label="Pendentes" />
          <FilterBtn value="failed" label="Falhas" />
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
                {["Status", "Assunto", "Para", "Template", "Dest.", "Tamanho", "Enviado em"].map((h) => (
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
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: COLORS.textMuted, fontSize: 14 }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <>
                    <tr
                      key={row.id}
                      onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                      style={{
                        borderBottom: `1px solid ${COLORS.borderLight}`,
                        cursor: "pointer",
                        background: expanded === row.id ? COLORS.bg : "transparent",
                        transition: "background 0.1s",
                      }}
                    >
                      <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                        <StatusBadge status={row.status} />
                      </td>
                      <td style={{ padding: "13px 16px", verticalAlign: "middle" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {row.subject}
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textSecondary, verticalAlign: "middle", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {row.to}
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                        {row.template}
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle", textAlign: "center" }}>
                        {row.recipients}
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textMuted, verticalAlign: "middle" }}>
                        {row.size}
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 12, color: COLORS.textMuted, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                        {row.sentAt}
                      </td>
                    </tr>
                    {/* Linha expandida */}
                    {expanded === row.id && (
                      <tr key={`${row.id}-detail`} style={{ background: COLORS.bg }}>
                        <td colSpan={7} style={{ padding: "14px 24px 18px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                            <div style={{ fontWeight: 700, color: COLORS.textPrimary, marginBottom: 4 }}>Detalhes do Envio</div>
                            {row.cc && (
                              <div><span style={{ color: COLORS.textMuted, fontWeight: 600 }}>CC: </span><span style={{ color: COLORS.textSecondary }}>{row.cc}</span></div>
                            )}
                            <div><span style={{ color: COLORS.textMuted, fontWeight: 600 }}>Template usado: </span><span style={{ color: COLORS.textSecondary }}>{row.template}</span></div>
                            <div><span style={{ color: COLORS.textMuted, fontWeight: 600 }}>Total de destinatários: </span><span style={{ color: COLORS.textSecondary }}>{row.recipients}</span></div>
                            <div><span style={{ color: COLORS.textMuted, fontWeight: 600 }}>Tamanho total: </span><span style={{ color: COLORS.textSecondary }}>{row.size}</span></div>
                            {row.error && (
                              <div style={{
                                background: COLORS.dangerBg,
                                border: `1px solid ${COLORS.dangerBorder}`,
                                color: COLORS.danger, borderRadius: RADIUS.md,
                                padding: "8px 14px", marginTop: 4,
                              }}>
                                <strong>Erro:</strong> {row.error}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "right" }}>
        Mostrando {filtered.length} de {mockLogs.length} registros · Clique em uma linha para expandir detalhes
      </div>
    </div>
  );
}