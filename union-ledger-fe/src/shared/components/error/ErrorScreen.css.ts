import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.md,
  minHeight: "60vh",
  padding: vars.space["3xl"],
  textAlign: "center",
});

export const code = style({
  fontSize: "6.4rem",
  fontWeight: 800,
  lineHeight: 1.1,
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

export const title = style({
  ...vars.font.title_bold_24,
  color: vars.color.summaryTitle,
});

export const description = style({
  ...vars.font.body_regular_16,
  maxWidth: "44rem",
  color: vars.color.description,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: vars.space.md,
  marginTop: vars.space.xl,
});

const actionBase = {
  ...vars.font.body_medium_14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "12rem",
  padding: `${vars.space.md} ${vars.space["2xl"]}`,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  fontWeight: 700,
} as const;

export const primaryAction = style({
  ...actionBase,
  border: "none",
  background: vars.color.primary,
  color: vars.color.surface,
  ":hover": {
    opacity: 0.92,
  },
});

export const secondaryAction = style({
  ...actionBase,
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.summaryTitle,
  ":hover": {
    background: vars.color.background,
  },
});
