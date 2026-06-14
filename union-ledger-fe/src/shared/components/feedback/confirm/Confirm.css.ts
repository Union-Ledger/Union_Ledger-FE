import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const popIn = keyframes({
  from: { opacity: 0, transform: "translateY(10px) scale(0.98)" },
  to: { opacity: 1, transform: "translateY(0) scale(1)" },
});

export const overlay = style({
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: vars.space["2xl"],
  background: vars.color.overlay,
  zIndex: vars.zIndex.modal,
  animation: `${fadeIn} 0.15s ease-out`,
});

export const dialog = style({
  width: "min(42rem, 100%)",
  padding: vars.space["3xl"],
  background: vars.color.surface,
  borderRadius: vars.radius.xl,
  boxShadow: vars.shadow.lg,
  animation: `${popIn} 0.18s ease-out`,
});

export const title = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const description = style({
  ...vars.font.body_regular_14,
  marginTop: vars.space.md,
  color: vars.color.description,
});

export const inputLabel = style({
  ...vars.font.body_medium_14,
  display: "block",
  marginTop: vars.space.xl,
  marginBottom: vars.space.sm,
  color: vars.color.summaryTitle,
  fontWeight: 700,
});

export const textarea = style({
  ...vars.font.body_regular_14,
  width: "100%",
  minHeight: "9rem",
  padding: vars.space.md,
  border: `1px solid ${vars.color.ItemBorder}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: vars.color.summaryTitle,
  resize: "vertical",
  outline: "none",
  ":focus": {
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
  },
  "::placeholder": {
    color: vars.color.description,
  },
});

export const buttonRow = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.space.sm,
  marginTop: vars.space["2xl"],
});

const buttonBase = {
  ...vars.font.body_medium_14,
  minWidth: "8.8rem",
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  fontWeight: 700,
} as const;

export const cancelButton = style({
  ...buttonBase,
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.description,
  ":hover": {
    background: vars.color.background,
  },
});

export const confirmButton = recipe({
  base: {
    ...buttonBase,
    border: "none",
    color: vars.color.surface,
  },
  variants: {
    tone: {
      default: {
        background: vars.color.primary,
        ":hover": { opacity: 0.92 },
      },
      danger: {
        background: vars.color.semantic.danger.strong,
        ":hover": { opacity: 0.92 },
      },
    },
  },
});

export const confirmButtonDisabled = style({
  opacity: 0.5,
  cursor: "not-allowed",
  pointerEvents: "none",
});
