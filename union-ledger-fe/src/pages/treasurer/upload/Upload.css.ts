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
  display: "flex",
  flexDirection: "column",
  gap: "32px",
});

export const typeSelectorContainer = style({
  width: "100%",
  height: "88px",
  display: "flex",
  gap: "16px",
});

export const typeCard = style({
  display: "flex",
  flexDirection: "column",
  flex: "1",
  gap: "4px",
  padding: "22px",
  borderRadius: "14px",
});

export const typeCardSelected = style({
  border: `2px solid ${vars.color.accent.indigo}`,
  background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)",
  boxShadow:
    "0 10px 15px -3px rgba(97, 95, 255, 0.20), 0 4px 6px -4px rgba(97, 95, 255, 0.20)",
});

export const typeCardDefault = style({
  border: "2px solid #E2E8F0",
  background: "rgba(255, 255, 255, 0.80)",
});

export const typeCardTitle = style({
  ...vars.font.head_bold_16,
  color: "#0F172B",
  width: "100%",
  textAlign: "start",
});

export const typeCardDesc = style({
  ...vars.font.caption_regular_12,
  color: vars.color.gray,
  width: "100%",
  textAlign: "start",
});

export const categoryFieldContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const categoryLabel = style({
  ...vars.font.head_bold_16,
  color: "#0F172B",
});

export const categoryInput = style({
  ...vars.font.body_regular_16,
  width: "100%",
  height: "56px",
  padding: "0 18px",
  border: "2px solid #E2E8F0",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.80)",
  color: "#0F172B",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "::placeholder": {
    color: "#94A3B8",
  },
  ":focus": {
    borderColor: vars.color.accent.indigo,
    boxShadow: "0 0 0 3px rgba(97, 95, 255, 0.16)",
  },
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
});

export const cardContainer = style({
  width: "100%",
  height: "288px",
  padding: "32px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const statusMessage = style({
  padding: "16px 18px",
  borderRadius: "12px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: "linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)",
  color: vars.color.blueSoft.text,
  ...vars.font.body_medium_14,
});
