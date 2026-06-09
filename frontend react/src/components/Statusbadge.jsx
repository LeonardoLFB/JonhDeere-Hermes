import { STATUS_MAP } from "../design";

export default function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: cfg.bg,
      color: cfg.color,
      borderRadius: 999,
      padding: "3px 10px 3px 8px",
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: cfg.dot,
        flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  );
}