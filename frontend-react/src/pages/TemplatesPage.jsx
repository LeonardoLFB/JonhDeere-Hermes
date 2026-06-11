import { useState, useEffect } from "react";
import Header from "../components/Header";
import { listarTemplates, criarTemplate, extrairVariaveis } from "../services/emailApi";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  borderRadius: RADIUS.md,
  border: `1.5px solid ${COLORS.border}`,
  outline: "none",
  color: COLORS.textPrimary,
  background: COLORS.bg,
  boxSizing: "border-box",
  fontFamily: FONT,
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: COLORS.textSecondary,
  marginBottom: 6,
  display: "block",
};

const FORM_VAZIO = { nome: "", assunto: "", corpo: "" };

export default function TemplatesPage({ onNavigate }) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    try {
      setTemplates(await listarTemplates());
      setErro("");
    } catch {
      setErro("Não foi possível carregar os templates. Verifique se o backend de emails (porta 3001) está ligado.");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSalvar = async () => {
    if (!form.nome || !form.assunto || !form.corpo) {
      setErro("Preencha nome, assunto e corpo do template.");
      return;
    }
    setSalvando(true);
    try {
      await criarTemplate(form.nome, form.assunto, form.corpo);
      await carregar();
      setForm(FORM_VAZIO);
      setIsFormOpen(false);
      setErro("");
    } catch (e) {
      setErro(e.response?.data?.erro || "Erro ao salvar o template.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT }}>
      <Header
        title="Templates"
        subtitle="Gerencie os modelos de e-mail"
        action={
          <button
            onClick={() => { setIsFormOpen((v) => !v); setErro(""); }}
            style={{
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

      {/* Formulário de novo template */}
      {isFormOpen && (
        <section style={{
          background: COLORS.surface, borderRadius: RADIUS.lg,
          border: `1.5px solid ${COLORS.green}`, padding: "24px 28px",
          boxShadow: SHADOW.elevated, display: "flex", flexDirection: "column", gap: 16,
        }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>
            Novo Template
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Nome *</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Boas-vindas"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Assunto *</label>
              <input
                type="text"
                value={form.assunto}
                onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                placeholder="Ex: Bem-vindo à equipe, {{nome}}!"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Corpo * <span style={{ fontWeight: 400, color: COLORS.textMuted }}>— use {"{{variaveis}}"} para campos dinâmicos</span></label>
            <textarea
              rows={6}
              value={form.corpo}
              onChange={(e) => setForm({ ...form, corpo: e.target.value })}
              placeholder={"Olá {{nome}},\n\nSeja bem-vindo(a) à John Deere!"}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={() => { setIsFormOpen(false); setForm(FORM_VAZIO); setErro(""); }}
              style={{
                background: "transparent", border: `1.5px solid ${COLORS.border}`,
                color: COLORS.textSecondary, borderRadius: RADIUS.md,
                padding: "10px 22px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT,
              }}>
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={salvando}
              style={{
                background: COLORS.green, color: "#fff",
                border: "none", borderRadius: RADIUS.md,
                padding: "10px 22px", fontSize: 13, fontWeight: 700,
                cursor: salvando ? "wait" : "pointer", fontFamily: FONT,
                opacity: salvando ? 0.75 : 1,
              }}>
              {salvando ? "Salvando..." : "Salvar Template"}
            </button>
          </div>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: selected ? "340px 1fr" : "1fr", gap: 20, alignItems: "start" }}>

        {/* Lista de templates */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {templates.length === 0 && !erro && (
            <div style={{
              background: COLORS.surface, borderRadius: RADIUS.lg,
              border: `1px solid ${COLORS.border}`, padding: "40px",
              textAlign: "center", color: COLORS.textMuted, fontSize: 14,
            }}>
              Nenhum template cadastrado ainda. Clique em "Novo Template" para criar o primeiro.
            </div>
          )}
          {templates.map((tmpl) => {
            const isSelected = selected?.id === tmpl.id;
            const vars = extrairVariaveis(tmpl.corpo);
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelected(isSelected ? null : tmpl)}
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
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>
                  {tmpl.nome}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {tmpl.assunto}
                </div>
                {vars.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {vars.map((v) => (
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
                )}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLORS.textPrimary }}>{selected.nome}</h2>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 20, lineHeight: 1 }}
              >
                ×
              </button>
            </div>

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
                {selected.assunto}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Corpo
              </div>
              <div style={{
                background: COLORS.bg, borderRadius: RADIUS.md,
                border: `1px solid ${COLORS.borderLight}`,
                padding: "14px 16px", fontSize: 13,
                color: COLORS.textSecondary, lineHeight: 1.7,
                maxHeight: 240, overflowY: "auto", whiteSpace: "pre-wrap",
              }}>
                {selected.corpo}
              </div>
            </div>

            {extrairVariaveis(selected.corpo).length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Variáveis ({extrairVariaveis(selected.corpo).length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {extrairVariaveis(selected.corpo).map((v) => (
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
            )}

            <div style={{ paddingTop: 8, borderTop: `1px solid ${COLORS.borderLight}` }}>
              <button
                onClick={() => onNavigate("compose")}
                style={{
                  width: "100%", background: COLORS.green, color: "#fff",
                  border: "none", borderRadius: RADIUS.md,
                  padding: "10px 0", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: FONT,
                }}
              >
                Usar este template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
