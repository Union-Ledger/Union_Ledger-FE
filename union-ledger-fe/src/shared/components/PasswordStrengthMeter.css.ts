import { style, styleVariants } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const bars = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "5px",
});

export const bar = style({
  height: "5px",
  borderRadius: "999px",
  background: "#E2E8F0",
});

export const barVariant = styleVariants({
  weak: { background: "#FF5A63" },
  medium: { background: "#FBBF24" },
  strong: { background: "#10B981" },
});

export const text = style({
  margin: 0,
  color: "#6B7280",
  fontSize: "1.3rem",
});

export const labelVariant = styleVariants({
  weak: { color: "#EF4444", fontWeight: 800 },
  medium: { color: "#D97706", fontWeight: 800 },
  strong: { color: "#059669", fontWeight: 800 },
});
