import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.md,
  padding: `${vars.space["4xl"]} ${vars.space["2xl"]}`,
  textAlign: "center",
});

export const iconCircle = style({
  width: "5.6rem",
  height: "5.6rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.full,
  background: vars.color.semantic.danger.bg,
  border: `1px solid ${vars.color.semantic.danger.border}`,
  color: vars.color.semantic.danger.strong,
  fontSize: "2.4rem",
  fontWeight: 700,
});

export const title = style({
  ...vars.font.head_bold_16,
  color: vars.color.summaryTitle,
});

export const description = style({
  ...vars.font.body_regular_14,
  maxWidth: "36rem",
  color: vars.color.description,
});

export const retryButton = style({
  ...vars.font.body_medium_14,
  marginTop: vars.space.sm,
  padding: `${vars.space.md} ${vars.space["2xl"]}`,
  border: `1px solid ${vars.color.ItemBorder}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: vars.color.summaryTitle,
  cursor: "pointer",
  fontWeight: 700,
  ":hover": {
    background: vars.color.background,
  },
});
