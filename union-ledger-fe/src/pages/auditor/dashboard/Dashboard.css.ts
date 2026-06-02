import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "32px",
  background: "linear-gradient(135deg, #F8FAFC 0%, #FAF5FF 50%, #EFF6FF 100%);",
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "7.5px",
});

export const title = style({
  ...vars.font.display_bold_30,
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const desc = style({
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const contentContainer = style({
  width: "100%",
  height: "308px",
  display: "flex",
  gap: "32px",
});
