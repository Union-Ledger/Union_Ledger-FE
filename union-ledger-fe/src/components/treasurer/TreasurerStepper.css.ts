import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  padding: "20px 32px 0",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "16px 16px 0",
    },
  },
});

export const list = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: 0,
  padding: 0,
  listStyle: "none",
  flexWrap: "wrap",
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const step = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "4px",
});

const numBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "26px",
  height: "26px",
  borderRadius: "999px",
  fontSize: "1.3rem",
  fontWeight: 800,
  flexShrink: 0,
} as const;

export const num = styleVariants({
  done: { ...numBase, background: vars.color.semantic.success.strong, color: "#FFFFFF" },
  current: { ...numBase, background: vars.color.primary, color: "#FFFFFF" },
  upcoming: { ...numBase, background: "#E2E8F0", color: "#64748B" },
});

const labelBase = {
  ...vars.font.body_medium_14,
  whiteSpace: "nowrap",
} as const;

export const label = styleVariants({
  done: { ...labelBase, color: "#0F172A", fontWeight: 700 },
  current: { ...labelBase, color: vars.color.primary, fontWeight: 800 },
  upcoming: { ...labelBase, color: "#94A3B8", fontWeight: 600 },
});

export const connector = style({
  width: "24px",
  height: "2px",
  background: "#E2E8F0",
  "@media": {
    "screen and (max-width: 768px)": {
      width: "12px",
    },
  },
});

export const nextButton = style({
  ...vars.font.body_medium_14,
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  height: "40px",
  padding: "0 18px",
  borderRadius: vars.radius.md,
  border: "none",
  background: vars.color.primary,
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 800,
  ":hover": {
    opacity: 0.92,
  },
});
