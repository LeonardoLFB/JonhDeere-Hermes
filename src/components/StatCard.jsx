import { COLORS, RADIUS, SHADOW } from "../design";

export default function StatCard({ label, value, delta, positive }) {
  const deltaColor =
    positive === true ? COLORS.green :
    positive === false ? COLORS.danger :
    COLORS.warning;

  return (
    <div style={{
      background: COLORS.surface,
      borderRadius: RADIUS.lg,
      border: `1px solid ${COLORS.border}`,
      padding: "22px 24px",
      boxShadow: SHADOW.card,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      <div style={{
        fontSize: 11,
        color: COLORS.textMuted,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.6px",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 32,
        fontWeight: 800,
        color: COLORS.textPrimary,
        lineHeight: 1,
        letterSpacing: "-1px",
      }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontSize: 12, fontWeight: 600, color: deltaColor }}>
          {delta}
        </div>
      )}
    </div>
  );
}