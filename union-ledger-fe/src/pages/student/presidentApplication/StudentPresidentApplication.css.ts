import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  minHeight: "100vh",
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  background: "linear-gradient(135deg, #F8FAFC 0%, #FAF5FF 50%, #EFF6FF 100%)",
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
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

export const noticeBox = style({
  display: "flex",
  gap: "8px",
  padding: "16px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.blueSoft.bgFrom,
  color: vars.color.blueSoft.text,
  ...vars.font.body_regular_14,
});

export const formCard = style({
  padding: "32px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const formHeader = style({
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  marginBottom: "32px",
});

export const formIcon = style({
  color: vars.color.primary,
  fontWeight: "700",
  marginTop: "2px",
  fontSize: "2.4rem",
});

export const formTitle = style({
  margin: 0,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const formDesc = style({
  margin: "8px 0 0",
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
});

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "24px",
});

export const label = style({
  ...vars.font.head_bold_16,
  color: vars.color.summaryTitle,
});

export const input = style({
  height: "64px",
  border: "none",
  borderRadius: "12px",
  background: vars.color.background,
  padding: "0 20px",
  outline: "none",
  color: vars.color.summaryTitle,
  ...vars.font.body_regular_16,

  "::placeholder": {
    color: vars.color.gray,
  },
});

export const helperText = style({
  ...vars.font.body_regular_16,
  color: vars.color.description,
});

export const uploadBox = style({
  minHeight: "180px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  borderRadius: "12px",
  border: `2px dashed ${vars.color.blueSoft.border}`,
  background: vars.color.surface,
  color: vars.color.description,
  cursor: "pointer",
});

export const uploadIcon = style({
  fontSize: "3.6rem",
  color: vars.color.border,
});

export const uploadTitle = style({
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.description,
});

export const uploadDesc = style({
  ...vars.font.body_regular_16,
  fontWeight: "700",
  color: vars.color.description,
});

export const hiddenInput = style({
  display: "none",
});

export const divider = style({
  height: "1px",
  background: vars.color.ItemBorder,
  margin: "10px 0 24px",
});

export const actionRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
});

export const cancelButton = style({
  height: "56px",
  borderRadius: "12px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.summaryTitle,
  cursor: "pointer",
  ...vars.font.head_bold_16,
});

export const submitButton = style({
  height: "56px",
  border: "none",
  borderRadius: "12px",
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.head_bold_16,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});
