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
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "18px",
      gap: "16px",
    },
  },
});

export const title = style({
  ...vars.font.heading_medium_20,
  color: vars.color.foreground,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: 0,
});

export const contentContainer = style({
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const faqItem = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  paddingBottom: "14px",
  borderBottom: "1px solid #E2E8F0",
  selectors: {
    "&:last-child": {
      paddingBottom: 0,
      borderBottom: "0",
    },
  },
});

export const questionButton = style({
  width: "100%",
  minHeight: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  border: "0",
  padding: 0,
  background: "transparent",
  color: vars.color.summaryTitle,
  fontFamily: vars.font.body,
  cursor: "pointer",
  textAlign: "left",
});

export const question = style({
  ...vars.font.head_bold_16,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: vars.color.summaryTitle,
});

export const questionHighlight = style({
  color: "#4F39F6",
});

export const answer = style({
  ...vars.font.body_regular_14,
  margin: 0,
  color: vars.color.description,
  padding: "0 44px 4px 28px",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "0 12px 2px 28px",
    },
  },
});

export const answerHighlight = style({
  color: "#00A63E",
  fontWeight: "600",
});

export const toggleIcon = style({
  width: "28px",
  height: "28px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: vars.radius.full,
  background: vars.color.semantic.info.bg,
  color: vars.color.semantic.info.text,
  fontSize: "1.8rem",
  fontWeight: 800,
});
