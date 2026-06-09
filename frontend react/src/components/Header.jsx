import { COLORS, FONT } from "../design";

export default function Header({ title, subtitle, action }) {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      fontFamily: FONT,
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 800,
          color: COLORS.textPrimary,
          letterSpacing: "-0.5px",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            margin: "4px 0 0",
            color: COLORS.textMuted,
            fontSize: 13,
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}