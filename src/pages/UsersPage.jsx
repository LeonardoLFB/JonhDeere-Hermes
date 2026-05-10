import { useState } from "react";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { mockUsers } from "../data/mockData";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const roleColors = {
  Administrador: { bg: "#fff8e6", color: "#a07800" },
  Operador:      { bg: "#e8f4fd", color: "#1e6a9e" },
  Visualizador:  { bg: "#f4f0ff", color: "#6d28d9" },
};

export default function UsersPage() {
  const [users] = useState(mockUsers);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT }}>
      <Header
        title="Usuários"
        subtitle="Gestão de acessos e permissões da plataforma"
        action={
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            background: COLORS.green, color: "#fff",
            border: "none", borderRadius: RADIUS.md,
            padding: "10px 20px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: FONT,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Usuário
          </button>
        }
      />

      {/* Resumo por role */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {["Administrador", "Operador", "Visualizador"].map((role) => {
          const count = users.filter((u) => u.role === role).length;
          const rc = roleColors[role] || {};
          return (
            <div key={role} style={{
              background: rc.bg, borderRadius: RADIUS.lg,
              border: `1px solid ${COLORS.border}`, padding: "18px 22px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: rc.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                {role}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, letterSpacing: "-0.5px" }}>
                {count}
              </div>
            </div>
          );
        })}
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
                {["Usuário", "E-mail", "Perfil", "Status", "Último Acesso", "Ações"].map((h) => (
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
              {users.map((u) => {
                const rc = roleColors[u.role] || {};
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: COLORS.greenLight, color: COLORS.green,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 14, flexShrink: 0,
                        }}>
                          {u.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <span style={{
                        background: rc.bg, color: rc.color,
                        borderRadius: RADIUS.full, padding: "3px 10px",
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <StatusBadge status={u.status} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: COLORS.textMuted, verticalAlign: "middle" }}>
                      {u.lastLogin}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{
                          padding: "5px 12px", borderRadius: RADIUS.sm,
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.surface, color: COLORS.textSecondary,
                          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                        }}>
                          Editar
                        </button>
                        <button style={{
                          padding: "5px 12px", borderRadius: RADIUS.sm,
                          border: `1px solid ${COLORS.dangerBorder}`,
                          background: COLORS.dangerBg, color: COLORS.danger,
                          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                        }}>
                          {u.status === "active" ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}