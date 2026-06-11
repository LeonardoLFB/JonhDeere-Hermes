import { useState } from "react";
import axios from "axios";
import jdLogo from "../image/Logo.png";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      // Valida as credenciais no backend (aceita username ou email)
      const response = await axios.post("http://localhost:8081/api/usuarios/login", {
        login: username,
        senha: password,
      });
      if (onLogin) onLogin(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Usuário ou senha incorretos.");
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: FONT,
      background: COLORS.bg,
    }}>
      {/* Painel esquerdo – verde */}
      <div style={{
        width: "44%",
        background: COLORS.green,
        display: "flex",
        flexDirection: "column",
        padding: "48px 52px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 56 }}>
          <img src={jdLogo} alt="John Deere" style={{ height: 72, objectFit: "contain" }} />
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>HERMES</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>Sistema de Notificações</div>
          </div>
        </div>

        {/* Texto hero */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            color: "#fff",
            fontSize: 38,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 20px",
            letterSpacing: "-1px",
          }}>
            Central de<br />Comunicação<br />Corporativa
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: 320,
            margin: 0,
          }}>
            Gerencie envios de e-mail, templates e agendamentos em um único lugar.
          </p>
        </div>

        {/* Tags de recursos */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 0 }}>
          {["Templates com Variáveis", "Envio Agendado", "Logs Detalhados", "Multi-canal (em breve)"].map((t) => (
            <span key={t} style={{
              background: "rgba(255,222,0,0.16)",
              color: COLORS.yellow,
              border: "1px solid rgba(255,222,0,0.3)",
              borderRadius: RADIUS.full,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 600,
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Faixa amarela no rodapé */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 7,
          background: COLORS.yellow,
        }} />
      </div>

      {/* Painel direito – formulário */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
      }}>
        <div style={{
          background: COLORS.surface,
          borderRadius: RADIUS.xl,
          border: `1px solid ${COLORS.border}`,
          padding: "44px 48px",
          width: "100%",
          maxWidth: 420,
          boxShadow: SHADOW.elevated,
        }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 4 }}>
              Entrar na plataforma
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>
              Use suas credenciais corporativas
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary }}>Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="seu.usuario"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  fontSize: 14,
                  borderRadius: RADIUS.md,
                  border: `1.5px solid ${COLORS.border}`,
                  outline: "none",
                  color: COLORS.textPrimary,
                  background: COLORS.bg,
                  boxSizing: "border-box",
                  fontFamily: FONT,
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary }}>Senha</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "11px 44px 11px 14px",
                    fontSize: 14,
                    borderRadius: RADIUS.md,
                    border: `1.5px solid ${COLORS.border}`,
                    outline: "none",
                    color: COLORS.textPrimary,
                    background: COLORS.bg,
                    boxSizing: "border-box",
                    fontFamily: FONT,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center",
                  }}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: COLORS.dangerBg,
                border: `1px solid ${COLORS.dangerBorder}`,
                color: COLORS.danger,
                borderRadius: RADIUS.md,
                padding: "10px 14px",
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: COLORS.green,
                color: "#fff",
                border: "none",
                borderRadius: RADIUS.md,
                padding: "13px 0",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                width: "100%",
                fontFamily: FONT,
                opacity: loading ? 0.75 : 1,
                marginTop: 4,
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div style={{
            borderTop: `1px solid ${COLORS.borderLight}`,
            marginTop: 28,
            paddingTop: 20,
            fontSize: 13,
            color: COLORS.textMuted,
            textAlign: "center",
          }}>
            Precisa de acesso?{" "}
            <a href="#" style={{ color: COLORS.green, fontWeight: 700, textDecoration: "none" }}>
              Contate o administrador
            </a>
          </div>
        </div>

        <div style={{ marginTop: 28, fontSize: 11, color: COLORS.textMuted, textAlign: "center" }}>
          © {new Date().getFullYear()} Deere &amp; Company — Uso interno corporativo.
        </div>
      </div>
    </div>
  );
}