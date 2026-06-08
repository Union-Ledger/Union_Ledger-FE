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
  width: "672px",
  minHeight: "540px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const uploadTitle = style({
  ...vars.font.heading_medium_20,
  color: vars.color.foreground,
});

export const uploadInfoContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  paddingTop: "17px",
  gap: "12px",
  borderTop: "1px solid rgba(0, 0, 0, 0.10)",
});

export const uploadInfoTitle = style({
  ...vars.font.body_medium_14,
  color: "#0F172B",
});

export const uploadInfoDescContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  paddingLeft: "16px",
});

export const uploadInfoDesc = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const currentTemplateBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "14px 16px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.blueSoft.bgFrom,
});

export const currentTemplateLabel = style({
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const currentTemplateName = style({
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
});

export const statusMessage = style({
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #B9F8CF",
  background: "#F0FDF4",
  color: "#0D542B",
  ...vars.font.body_regular_14,
});
