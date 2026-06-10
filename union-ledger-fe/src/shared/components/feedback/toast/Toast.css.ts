import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

const slideIn = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const viewport = style({
  position: "fixed",
  right: vars.space["2xl"],
  bottom: vars.space["2xl"],
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  width: "min(38rem, calc(100vw - 3.2rem))",
  zIndex: vars.zIndex.toast,
  pointerEvents: "none",
});

export const toast = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: vars.space.md,
    padding: `${vars.space.md} ${vars.space.lg}`,
    background: vars.color.surface,
    borderRadius: vars.radius.lg,
    borderLeft: "4px solid transparent",
    boxShadow: vars.shadow.lg,
    animation: `${slideIn} 0.18s ease-out`,
    pointerEvents: "auto",
  },
  variants: {
    variant: {
      success: { borderLeftColor: vars.color.semantic.success.strong },
      error: { borderLeftColor: vars.color.semantic.danger.strong },
      info: { borderLeftColor: vars.color.semantic.info.strong },
    },
  },
});

export const icon = recipe({
  base: {
    ...vars.font.caption_regular_12,
    flexShrink: 0,
    width: "2rem",
    height: "2rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: vars.radius.full,
    color: vars.color.surface,
    fontWeight: 700,
  },
  variants: {
    variant: {
      success: { background: vars.color.semantic.success.strong },
      error: { background: vars.color.semantic.danger.strong },
      info: { background: vars.color.semantic.info.strong },
    },
  },
});

export const message = style({
  ...vars.font.body_medium_14,
  flexGrow: 1,
  color: vars.color.summaryTitle,
});

export const actionButton = style({
  ...vars.font.body_medium_14,
  flexShrink: 0,
  border: "none",
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  fontWeight: 700,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  ":hover": {
    background: "rgba(79, 57, 246, 0.08)",
  },
});

export const closeButton = style({
  flexShrink: 0,
  width: "2.4rem",
  height: "2.4rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "transparent",
  color: vars.color.description,
  cursor: "pointer",
  fontSize: "1.6rem",
  lineHeight: 1,
  borderRadius: vars.radius.sm,
  ":hover": {
    background: vars.color.background,
  },
});
