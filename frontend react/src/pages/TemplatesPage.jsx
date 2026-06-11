import { useState } from "react";
import Header from "../components/Header";
import { mockTemplates } from "../data/mockData";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const categoryColors = {
  Onboarding:      { bg: "#e8f4fd", color: "#1e6a9e" },
  Comercial:       { bg: "#e8f5e4", color: "#2d7a20" },
  Infraestrutura:  { bg: "#fff8e6", color: "#a07800" },
  Gestão:          { bg: "#f4f0ff", color: "#6d28d9" },
  Segurança:       { bg: "#fff0f0", color: "#b91c1c" },
};

export default function TemplatesPage({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState(0);

  const handleSelect = (tmpl) => {
    setSelected(tmpl);
    setSelectedVersionIdx(tmpl.versions.length - 1); // última versão como padrão
  };

  const currentVersion = selected ? selected.versions[selectedVersionIdx] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT }}>
      <Header
        title="Templates"
        subtitle="Gerencie os modelos de e-mail e suas versões"
        action={
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            background: COLORS.green, color: "#fff",
            border: "none", borderRadius: RADIUS.md,
            padding: "10px 20px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: FONT,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Template
          </button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: selected ? "340px 1fr" : "1fr", gap: 20, alignItems: "start" }}>

        {/* Lista de templates */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mockTemplates.map((tmpl) => {
            const catStyle = categoryColors[tmpl.category] || { bg: COLORS.bg, color: COLORS.textSecondary };
            const isSelected = selected?.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => isSelected ? setSelected(null) : handleSelect(tmpl)}
                style={{
                  background: COLORS.surface,
                  border: `1.5px solid ${isSelected ? COLORS.green : COLORS.border}`,
                  borderRadius: RADIUS.lg,
                  padding: "16px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: isSelected ? SHADOW.elevated : SHADOW.card,
                  fontFamily: FONT,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{tmpl.name}</div>
                  <span style={{
                    background: catStyle.bg, color: catStyle.color,
                    borderRadius: RADIUS.full, padding: "3px 10px",
                    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                  }}>
                    {tmpl.category}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                  {tmpl.versions.length} {tmpl.versions.length === 1 ? "versão" : "versões"} · Última: v{tmpl.versions.at(-1).version} ({tmpl.versions.at(-1).updatedAt})
                </div>
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {tmpl.versions.at(-1).variables.map((v) => (
                    <span key={v} style={{
                      background: COLORS.bg, color: COLORS.textSecondary,
                      border: `1px solid ${COLORS.borderLight}`,
                      borderRadius: RADIUS.sm, padding: "2px 8px",
                      fontSize: 11, fontFamily: "monospace",
                    }}>
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Painel de detalhes */}
        {selected && (
          <div style={{
            background: COLORS.surface,
            borderRadius: RADIUS.lg,
            border: `1px solid ${COLORS.border}`,
            padding: "24px 28px",
            boxShadow: SHADOW.card,
            position: "sticky",
            top: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
            {/* Cabeçalho do detalhe */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: COLORS.textPrimary }}>{selected.name}</h2>
                <span style={{
                  background: categoryColors[selected.category]?.bg || COLORS.bg,
                  color: categoryColors[selected.category]?.color || COLORS.textSecondary,
                  borderRadius: RADIUS.full, padding: "3px 10px",
                  fontSize: 11, fontWeight: 700,
                }}>
                  {selected.category}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 20, lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Seletor de versão */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                Versões
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selected.versions.map((v, idx) => (
                  <button
                    key={v.version}
                    onClick={() => setSelectedVersionIdx(idx)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: RADIUS.full,
                      border: `1.5px solid ${selectedVersionIdx === idx ? COLORS.green : COLORS.border}`,
                      background: selectedVersionIdx === idx ? COLORS.greenLight : COLORS.surface,
                      color: selectedVersionIdx === idx ? COLORS.green : COLORS.textSecondary,
                      fontWeight: selectedVersionIdx === idx ? 700 : 500,
                      fontSize: 13, cursor: "pointer", fontFamily: FONT,
                    }}
                  >
                    v{v.version}
                    {idx === selected.versions.length - 1 && (
                      <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>mais recente</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Detalhes da versão selecionada */}
            {currentVersion && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Assunto
                  </div>
                  <div style={{
                    background: COLORS.bg, borderRadius: RADIUS.md,
                    border: `1px solid ${COLORS.borderLight}`,
                    padding: "10px 14px", fontSize: 13,
                    color: COLORS.textPrimary, fontWeight: 600,
                  }}>
                    {currentVersion.subject}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Corpo (HTML)
                  </div>
                  <div style={{
                    background: COLORS.bg, borderRadius: RADIUS.md,
                    border: `1px solid ${COLORS.borderLight}`,
                    padding: "14px 16px", fontSize: 13,
                    color: COLORS.textSecondary, lineHeight: 1.7,
                    maxHeight: 200, overflowY: "auto",
                  }}
                    dangerouslySetInnerHTML={{ __html: currentVersion.body }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Variáveis ({currentVersion.variables.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {currentVersion.variables.map((v) => (
                      <span key={v} style={{
                        background: "#f4f0ff", color: "#6d28d9",
                        border: "1px solid #e0d5ff",
                        borderRadius: RADIUS.sm, padding: "4px 10px",
                        fontSize: 12, fontFamily: "monospace", fontWeight: 600,
                      }}>
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                  Atualizado em: {currentVersion.updatedAt}
                </div>
              </>
            )}

            {/* Ações */}
            <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: `1px solid ${COLORS.borderLight}` }}>
              <button
                onClick={() => onNavigate("compose")}
                style={{
                  flex: 1, background: COLORS.green, color: "#fff",
                  border: "none", borderRadius: RADIUS.md,
                  padding: "10px 0", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: FONT,
                }}
              >
                Usar este template
              </button>
              <button style={{
                padding: "10px 16px",
                background: "transparent",
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: RADIUS.md,
                color: COLORS.textSecondary,
                fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT,
              }}>
                Editar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}