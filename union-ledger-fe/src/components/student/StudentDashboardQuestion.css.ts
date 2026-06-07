import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px",
  background: "rgba(255, 255, 255, 0.80)",
  borderRadius: "14px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
});

export const title = style({
  ...vars.font.heading_medium_20,
  color: vars.color.foreground,
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const contentContainer = style({
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});
