import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.lg,
  background: vars.color.background,
});

export const logo = style({
  width: "6.4rem",
  height: "6.4rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.xl,
  background: `linear-gradient(135deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  boxShadow: vars.shadow.md,
  color: vars.color.surface,
  fontSize: "2.4rem",
  fontWeight: 800,
});

export const name = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});
