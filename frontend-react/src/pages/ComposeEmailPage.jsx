import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import { listarTemplates, enviarEmail, extrairVariaveis, aplicarVariaveis } from "../services/emailApi";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const MAX_ATTACH_MB = 10;

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

const FieldGroup = ({ label, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <label style={labelStyle}>{label}</label>
      {hint && <span style={{ fontSize: 11, color: COLORS.textMuted }}>{hint}</span>}
    </div>
    {children}
  </div>
);

export default function ComposeEmailPage({ onNavigate }) {
  const [templates, setTemplates] = useState([]);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [variableValues, setVariableValues] = useState({});
  const [subject, setSubject] = useState("");
  const [sendMode, setSendMode] = useState("immediate"); // immediate | scheduled
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [attachError, setAttachError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Carrega os templates reais do backend de emails
  useEffect(() => {
    listarTemplates()
      .then(setTemplates)
      .catch(() => setSendError("Não foi possível carregar os templates. Verifique se o backend de emails (porta 3001) está ligado."));
  }, []);

  // Template selecionado
  const selectedTemplate = useMemo(
    () => templates.find((t) => String(t.id) === String(templateId)),
    [templates, templateId]
  );

  // Variáveis {{assim}} encontradas no corpo do template
  const variables = useMemo(
    () => extrairVariaveis(selectedTemplate?.corpo),
    [selectedTemplate]
  );

  // Preenche subject automaticamente ao trocar template
  const handleTemplateChange = (e) => {
    const id = e.target.value;
    setTemplateId(id);
    setVariableValues({});
    const tmpl = templates.find((t) => String(t.id) === String(id));
    setSubject(tmpl ? tmpl.assunto : "");
  };

  // Calcula tamanho total de anexos
  const totalAttachMB = attachments.reduce((acc, f) => acc + f.size / (1024 * 1024), 0);
  const attachPercent = Math.min((totalAttachMB / MAX_ATTACH_MB) * 100, 100);

  const handleAttach = (e) => {
    const files = Array.from(e.target.files);
    const newTotal = totalAttachMB + files.reduce((a, f) => a + f.size / (1024 * 1024), 0);
    if (newTotal > MAX_ATTACH_MB) {
      setAttachError(`Limite de ${MAX_ATTACH_MB}MB excedido. Total atual: ${newTotal.toFixed(1)}MB`);
    } else {
      setAttachError("");
      setAttachments((prev) => [...prev, ...files]);
    }
    e.target.value = "";
  };

  const removeAttach = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
    setAttachError("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSendError("");
    setSending(true);
    try {
      // O backend aceita vários destinatários separados por vírgula,
      // então juntamos Para + CC + CCO em uma lista só
      const destinatario = [to, cc, bcc].filter(Boolean).join(", ");
      const corpo = aplicarVariaveis(selectedTemplate?.corpo || "", variableValues);
      const agendadoPara = sendMode === "scheduled" ? `${scheduleDate}T${scheduleTime}` : null;

      await enviarEmail({
        destinatario,
        assunto: subject,
        corpo,
        id_template: selectedTemplate?.id,
        agendado_para: agendadoPara,
      });
      setSent(true);
    } catch (erro) {
      setSendError(
        erro.response?.data?.erro ||
        "Erro ao enviar. Verifique se o backend de emails (porta 3001) está rodando."
      );
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: FONT }}>
        <Header title="Novo E-mail" subtitle="Composição e envio" />
        <div style={{
          background: COLORS.surface,
          borderRadius: RADIUS.lg,
          border: `1px solid ${COLORS.border}`,
          padding: "60px 40px",
          boxShadow: SHADOW.card,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: COLORS.greenLight,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.textPrimary }}>
            {sendMode === "immediate" ? "E-mail enviado com sucesso!" : "E-mail agendado com sucesso!"}
          </div>
          <div style={{ fontSize: 14, color: COLORS.textMuted }}>
            {sendMode === "immediate"
              ? `O e-mail foi enviado para ${to}.`
              : `O e-mail será enviado em ${scheduleDate} às ${scheduleTime}.`}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              onClick={() => { setSent(false); setTo(""); setCc(""); setBcc(""); setTemplateId(""); setSubject(""); setAttachments([]); }}
              style={{
                background: COLORS.green, color: "#fff",
                border: "none", borderRadius: RADIUS.md,
                padding: "10px 24px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: FONT,
              }}
            >
              Novo E-mail
            </button>
            <button
              onClick={() => onNavigate("logs")}
              style={{
                background: "transparent", color: COLORS.green,
                border: `1.5px solid ${COLORS.green}`, borderRadius: RADIUS.md,
                padding: "10px 24px", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: FONT,
              }}
            >
              Ver Logs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT }}>
      <Header title="Novo E-mail" subtitle="Preencha os dados abaixo para enviar ou agendar" />

      <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Card: Destinatários */}
        <section style={{ background: COLORS.surface, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, padding: "24px 28px", boxShadow: SHADOW.card, display: "flex", flexDirection: "column", gap: 18 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>
            Destinatários
          </h3>
          <FieldGroup label="Para *" hint="Separe múltiplos e-mails com vírgula">
            <input
              required
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="destinatario@empresa.com, outro@empresa.com"
              style={inputStyle}
            />
          </FieldGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FieldGroup label="CC (Com Cópia)">
              <input type="text" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="cc@empresa.com" style={inputStyle} />
            </FieldGroup>
            <FieldGroup label="CCO / BCC (Cópia Oculta)">
              <input type="text" value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="bcc@empresa.com" style={inputStyle} />
            </FieldGroup>
          </div>
        </section>

        {/* Card: Template */}
        <section style={{ background: COLORS.surface, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, padding: "24px 28px", boxShadow: SHADOW.card, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Template</h3>
            <button
              type="button"
              onClick={() => onNavigate("templates")}
              style={{
                background: "transparent", border: `1px solid ${COLORS.border}`,
                color: COLORS.green, borderRadius: RADIUS.sm,
                padding: "5px 14px", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT,
              }}
            >
              Gerenciar Templates
            </button>
          </div>

          <FieldGroup label="Template *">
            <select
              required
              value={templateId}
              onChange={handleTemplateChange}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Selecione um template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </FieldGroup>

          {/* Preview do template (já com as variáveis aplicadas) */}
          {selectedTemplate && (
            <div style={{
              background: COLORS.bg,
              borderRadius: RADIUS.md,
              border: `1px solid ${COLORS.borderLight}`,
              padding: "14px 18px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                Pré-visualização do template
              </div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 }}>
                <strong>Assunto:</strong> {selectedTemplate.assunto}
              </div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: 10, marginTop: 8, whiteSpace: "pre-wrap" }}>
                {aplicarVariaveis(selectedTemplate.corpo, variableValues)}
              </div>
            </div>
          )}

          {/* Variáveis */}
          {variables.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 12 }}>
                Variáveis do template ({variables.length})
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {variables.map((v) => (
                  <FieldGroup key={v} label={`{{${v}}}`}>
                    <input
                      type="text"
                      value={variableValues[v] || ""}
                      onChange={(e) => setVariableValues((prev) => ({ ...prev, [v]: e.target.value }))}
                      placeholder={`Valor de ${v}`}
                      style={inputStyle}
                    />
                  </FieldGroup>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Card: Assunto */}
        <section style={{ background: COLORS.surface, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, padding: "24px 28px", boxShadow: SHADOW.card }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Assunto</h3>
          <FieldGroup label="Assunto do E-mail *">
            <input
              required
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Informe o assunto..."
              style={inputStyle}
            />
          </FieldGroup>
        </section>

        {/* Card: Anexos */}
        <section style={{ background: COLORS.surface, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, padding: "24px 28px", boxShadow: SHADOW.card, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Anexos</h3>
            <span style={{ fontSize: 12, color: COLORS.warning }}>⚠ O envio de anexos ainda não é suportado pelo backend</span>
          </div>

          {/* Barra de uso */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: COLORS.textSecondary }}>
                {totalAttachMB.toFixed(2)} MB de 10 MB usados
              </span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: attachPercent >= 90 ? COLORS.danger : attachPercent >= 60 ? COLORS.warning : COLORS.green,
              }}>
                {attachPercent.toFixed(0)}%
              </span>
            </div>
            <div style={{ height: 6, borderRadius: RADIUS.full, background: COLORS.borderLight, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${attachPercent}%`,
                background: attachPercent >= 90 ? COLORS.danger : attachPercent >= 60 ? "#f59e0b" : COLORS.green,
                borderRadius: RADIUS.full,
                transition: "width 0.3s",
              }} />
            </div>
          </div>

          {/* Input de arquivo */}
          <label style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "14px",
            border: `2px dashed ${COLORS.border}`,
            borderRadius: RADIUS.md,
            cursor: "pointer",
            color: COLORS.textMuted,
            fontSize: 13,
            transition: "border-color 0.15s",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Clique para adicionar anexos
            <input type="file" multiple onChange={handleAttach} style={{ display: "none" }} />
          </label>

          {attachError && (
            <div style={{
              background: COLORS.dangerBg,
              border: `1px solid ${COLORS.dangerBorder}`,
              color: COLORS.danger,
              borderRadius: RADIUS.md,
              padding: "10px 14px",
              fontSize: 13,
            }}>
              ⚠️ {attachError}
            </div>
          )}

          {/* Lista de anexos */}
          {attachments.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {attachments.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px",
                  background: COLORS.bg, borderRadius: RADIUS.sm,
                  border: `1px solid ${COLORS.borderLight}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span style={{ fontSize: 13, color: COLORS.textPrimary }}>{f.name}</span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>({(f.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttach(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.danger, fontSize: 16, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Card: Agendamento */}
        <section style={{ background: COLORS.surface, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, padding: "24px 28px", boxShadow: SHADOW.card, display: "flex", flexDirection: "column", gap: 18 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>Envio</h3>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { value: "immediate", label: "Enviar Imediatamente" },
              { value: "scheduled", label: "Agendar Envio" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSendMode(opt.value)}
                style={{
                  flex: 1, padding: "11px 0",
                  borderRadius: RADIUS.md,
                  border: `1.5px solid ${sendMode === opt.value ? COLORS.green : COLORS.border}`,
                  background: sendMode === opt.value ? COLORS.greenLight : COLORS.surface,
                  color: sendMode === opt.value ? COLORS.green : COLORS.textSecondary,
                  fontWeight: sendMode === opt.value ? 700 : 500,
                  fontSize: 14, cursor: "pointer", fontFamily: FONT,
                  transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {sendMode === "scheduled" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <FieldGroup label="Data *">
                <input
                  required={sendMode === "scheduled"}
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  style={inputStyle}
                />
              </FieldGroup>
              <FieldGroup label="Horário *">
                <input
                  required={sendMode === "scheduled"}
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  style={inputStyle}
                />
              </FieldGroup>
            </div>
          )}
        </section>

        {/* Erro de envio */}
        {sendError && (
          <div style={{
            background: COLORS.dangerBg,
            border: `1px solid ${COLORS.dangerBorder}`,
            color: COLORS.danger,
            borderRadius: RADIUS.md,
            padding: "12px 16px",
            fontSize: 13,
          }}>
            ⚠️ {sendError}
          </div>
        )}

        {/* Botões de ação */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            style={{
              background: "transparent",
              border: `1.5px solid ${COLORS.border}`,
              color: COLORS.textSecondary,
              borderRadius: RADIUS.md,
              padding: "11px 24px",
              fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={sending}
            style={{
              background: COLORS.green, color: "#fff",
              border: "none", borderRadius: RADIUS.md,
              padding: "11px 28px",
              fontSize: 14, fontWeight: 700,
              cursor: sending ? "wait" : "pointer", fontFamily: FONT,
              opacity: sending ? 0.75 : 1,
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            {sending ? "Enviando..." : sendMode === "immediate" ? "Enviar Agora" : "Agendar Envio"}
          </button>
        </div>
      </form>
    </div>
  );
}