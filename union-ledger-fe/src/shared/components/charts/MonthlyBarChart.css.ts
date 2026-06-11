import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const svg = style({
  width: "100%",
  height: "auto",
});

export const axis = style({
  stroke: vars.color.ItemBorder,
  strokeWidth: 1,
});

export const bar = style({
  fill: vars.color.accent.indigo,
});

export const valueLabel = style({
  fontSize: "9px",
  fontWeight: 700,
  fill: vars.color.summaryTitle,
});

export const axisLabel = style({
  fontSize: "9px",
  fill: vars.color.gray,
});
