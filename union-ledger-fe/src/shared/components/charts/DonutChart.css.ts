import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.space.lg,
});

export const svg = style({
  width: "16rem",
  height: "16rem",
  flexShrink: 0,
});

export const centerLabel = style({
  fontSize: "13px",
  fontWeight: 800,
  fill: vars.color.summaryTitle,
});

export const centerSub = style({
  fontSize: "7px",
  fill: vars.color.gray,
});

export const legend = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
});

export const legendItem = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const legendDot = style({
  width: "1rem",
  height: "1rem",
  flexShrink: 0,
  borderRadius: vars.radius.full,
});

export const legendLabel = style({
  ...vars.font.body_medium_14,
  flexGrow: 1,
  color: vars.color.summaryTitle,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const legendValue = style({
  ...vars.font.caption_regular_12,
  flexShrink: 0,
  color: vars.color.gray,
  fontVariantNumeric: "tabular-nums",
});
