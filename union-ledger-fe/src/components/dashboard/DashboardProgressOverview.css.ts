import { style, styleVariants } from "@vanilla-extract/css";
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
});

export const contentContainer = style({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const progressContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const progressTextContainer = style({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const progressTitle = style({
  ...vars.font.body_regular_14,
  color: vars.color.foreground,
});

export const progressDisplayText = style({
  ...vars.font.body_medium_14,
});

export const progressDisplayTextVariant = styleVariants({
  receipt: {
    color: vars.color.accent.violet,
  },
  transaction: {
    color: vars.color.accent.purple,
  },
  audit: {
    color: "#155DFC",
  },
});

export const progressTotalBar = style({
  width: "100%",
  height: "12px",
  position: "relative",
  borderRadius: "16777200px",
  background: "#F1F5F9",
});

export const progressCurrentBar = style({
  height: "100%",
  position: "absolute",
  top: "0",
  left: "0",
  borderRadius: "16777200px",
  boxShadow:
    "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)",
});

export const progressCurrentBarVariant = styleVariants({
  receipt: {
    background: `linear-gradient(90deg, ${vars.color.gradient.violetFrom} 0%, ${vars.color.gradient.violetTo} 100%)`,
  },
  transaction: {
    background: `linear-gradient(90deg, ${vars.color.gradient.pinkFrom} 0%, ${vars.color.gradient.pinkTo} 100%)`,
  },
  audit: {
    background: `linear-gradient(90deg, ${vars.color.gradient.cyanFrom} 0%, ${vars.color.gradient.cyanTo} 100%)`,
  },
});
