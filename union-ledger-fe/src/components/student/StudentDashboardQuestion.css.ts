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
  gap: "8px",
  paddingBottom: "16.5px",
  borderBottom: "1px solid #E2E8F0",
});

export const question = style({
  ...vars.font.head_bold_16,
  color: vars.color.summaryTitle,
});

export const questionHighlight = style({
  color: "#4F39F6",
});

export const answer = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
  padding: "0 20px",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "0 12px",
    },
  },
});

export const answerHighlight = style({
  color: "#00A63E",
  fontWeight: "600",
});
