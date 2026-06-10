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
  background: vars.color.background,
  fontSize: "2.4rem",
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

export const actionBox = style({
  marginTop: vars.space.sm,
});
