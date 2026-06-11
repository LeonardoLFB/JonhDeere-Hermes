import jdLogo from "../image/Logo.png";
import { COLORS, FONT } from "../design";

const NAV_ITEMS = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    id: "compose", label: "Novo E-mail",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>,
  },
  {
    id: "templates", label: "Templates",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  },
  {
    id: "scheduled", label: "Agendados",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    id: "logs", label: "Logs",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  },
  {
    id: "users", label: "Usuários",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

// Separador visual: canais futuros (somente visual, não funcional ainda)
const FUTURE_ITEMS = [
  { id: "sms", label: "SMS", soon: true, icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { id: "whatsapp", label: "WhatsApp", soon: true, icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
  { id: "push", label: "Push", soon: true, icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
];

export default function Sidebar({ active, onNavigate, user, onLogout, allowedPages }) {
  // Mostra só os itens que o perfil do usuário pode acessar
  const navItems = allowedPages
    ? NAV_ITEMS.filter((item) => allowedPages.includes(item.id))
    : NAV_ITEMS;

  return (
    <aside style={{
      width: 232,
      background: COLORS.greenMid,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "20px 0 20px",
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      zIndex: 100,
      fontFamily: FONT,
    }}>
      {/* TOP */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Logo */}
        <div style={{ padding: "0 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <img src={jdLogo} alt="John Deere" style={{ height: 80, objectFit: "contain" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-0.2px" }}>HERMES</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase" }}>Central de Notificações</div>
            </div>
          </div>
        </div>

        {/* Nav principal */}
        <nav style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "1.2px", textTransform: "uppercase", padding: "8px 10px 4px", fontWeight: 600 }}>
            Principal
          </div>
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: isActive ? "rgba(255,222,0,0.14)" : "transparent",
                  color: isActive ? COLORS.yellow : "rgba(255,255,255,0.65)",
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  fontFamily: FONT,
                  transition: "all 0.12s",
                  position: "relative",
                }}
              >
                {isActive && (
                  <span style={{
                    position: "absolute",
                    left: 0, top: "20%", bottom: "20%",
                    width: 3, borderRadius: "0 3px 3px 0",
                    background: COLORS.yellow,
                  }} />
                )}
                <span style={{ opacity: isActive ? 1 : 0.75 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Canais futuros */}
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "1.2px", textTransform: "uppercase", padding: "16px 10px 4px", fontWeight: 600 }}>
            Canais Futuros
          </div>
          {FUTURE_ITEMS.map((item) => (
            <div key={item.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              color: "rgba(255,255,255,0.25)",
              fontSize: 13.5,
              fontWeight: 500,
              cursor: "not-allowed",
              position: "relative",
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              <span style={{
                marginLeft: "auto",
                fontSize: 9,
                fontWeight: 700,
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.35)",
                borderRadius: 4,
                padding: "2px 6px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                Em breve
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 10,
          padding: "10px 12px",
        }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: "50%",
            background: COLORS.yellow,
            color: COLORS.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, flexShrink: 0,
          }}>
            {(user?.username || "U")[0].toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.username || "Usuário"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{user?.role || "Operador"}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "transparent", border: "none",
            color: "rgba(255,255,255,0.4)", fontSize: 13,
            cursor: "pointer", padding: "8px 12px",
            borderRadius: 8, width: "100%",
            fontFamily: FONT,
            transition: "color 0.12s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}