import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const pulse = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.5 },
});

const base = style({
  position: "fixed",
  top: "16px",
  right: "16px",
  zIndex: 40,
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 14px",
  borderRadius: "9999px",
  fontSize: "13px",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.12)",
  border: `1px solid ${vars.color.ItemBorder}`,
  backgroundColor: vars.color.surface,
  color: vars.color.description,
  transition: "transform 0.12s ease, box-shadow 0.12s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.16)",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
  "@media": {
    "(max-width: 768px)": {
      top: "12px",
      right: "12px",
      padding: "6px 12px",
      fontSize: "12px",
    },
  },
});

export const chip = base;

export const chipWarning = style([
  base,
  {
    backgroundColor: vars.color.semantic.warning.bg,
    borderColor: vars.color.semantic.warning.border,
    color: vars.color.semantic.warning.text,
  },
]);

export const dot = style({
  width: "8px",
  height: "8px",
  borderRadius: "9999px",
  backgroundColor: vars.color.semantic.success.strong,
});

export const dotWarning = style([
  dot,
  {
    backgroundColor: vars.color.semantic.warning.strong,
    animation: `${pulse} 1.2s ease-in-out infinite`,
  },
]);
