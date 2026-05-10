// ============================================================
// HERMES – Design Tokens
// ============================================================

export const COLORS = {
  green: "#367C2B",
  greenDark: "#1a3a14",
  greenLight: "#e8f5e4",
  greenMid: "#1e4a17",
  yellow: "#FFDE00",
  yellowMuted: "rgba(255,222,0,0.18)",
  bg: "#f0f2ef",
  surface: "#ffffff",
  border: "#d4e0d0",
  borderLight: "#e8efe6",
  textPrimary: "#1a3a14",
  textSecondary: "#5a6e56",
  textMuted: "#8a9e86",
  danger: "#b91c1c",
  dangerBg: "#fff0f0",
  dangerBorder: "#f5c2c2",
  warning: "#a07800",
  warningBg: "#fffbe6",
  info: "#1e6a9e",
  infoBg: "#e8f4fd",
};

export const FONT = "'DM Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const SHADOW = {
  card: "0 2px 12px rgba(54,124,43,0.08)",
  elevated: "0 8px 32px rgba(54,124,43,0.12)",
};

export const STATUS_MAP = {
  delivered: { bg: "#e8f5e4", color: "#2d7a20", label: "Entregue", dot: "#2d7a20" },
  pending:   { bg: "#fffbe6", color: "#a07800", label: "Pendente", dot: "#f59e0b" },
  failed:    { bg: "#fff0f0", color: "#b91c1c", label: "Falha",    dot: "#b91c1c" },
  scheduled: { bg: "#e8f4fd", color: "#1e6a9e", label: "Agendado", dot: "#3b82f6" },
  paused:    { bg: "#f4f0ff", color: "#6d28d9", label: "Pausado",  dot: "#8b5cf6" },
  active:    { bg: "#e8f5e4", color: "#2d7a20", label: "Ativo",    dot: "#2d7a20" },
  inactive:  { bg: "#f5f5f5", color: "#6b7280", label: "Inativo",  dot: "#9ca3af" },
};