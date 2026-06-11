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
  "@media": {
    "screen and (max-width: 768px)": {
      height: "auto",
      minHeight: "100vh",
      padding: "16px",
      gap: "24px",
    },
  },
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
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "2.2rem",
    },
  },
});

export const desc = style({
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const layoutGrid = style({
  width: "100%",
  maxWidth: "1080px",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 360px",
  gap: "24px",
  alignItems: "stretch",
  "@media": {
    "screen and (max-width: 900px)": {
      gridTemplateColumns: "1fr",
      maxWidth: "640px",
    },
  },
});

export const contentContainer = style({
  width: "100%",
  minHeight: "540px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
  "@media": {
    "screen and (max-width: 768px)": {
      minHeight: "auto",
      padding: "16px",
    },
  },
});

export const guideCard = style({
  display: "flex",
  flexDirection: "column",
  gap: "22px",
  padding: "28px 24px",
  borderRadius: "14px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: "rgba(255, 255, 255, 0.65)",
});

export const guideTitle = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const guideSteps = style({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
});

export const guideStep = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
});

export const guideStepNum = style({
  ...vars.font.body_medium_14,
  flexShrink: 0,
  width: "26px",
  height: "26px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.full,
  background: `linear-gradient(135deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  color: vars.color.surface,
  fontWeight: 700,
});

export const guideStepBody = style({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
});

export const guideStepTitle = style({
  ...vars.font.body_medium_14,
  color: vars.color.summaryTitle,
  fontWeight: 700,
});

export const guideStepDesc = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const guideFormats = style({
  display: "flex",
  gap: "8px",
  marginTop: "auto",
  paddingTop: "4px",
});

export const guideFormatBadge = style({
  ...vars.font.caption_regular_12,
  padding: "4px 12px",
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.blueSoft.bgFrom,
  color: vars.color.blueSoft.textStrong,
  fontWeight: 700,
});

export const uploadTitle = style({
  ...vars.font.heading_medium_20,
  color: vars.color.foreground,
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

export const deleteTemplateButton = style({
  alignSelf: "flex-start",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #FCA5A5",
  background: vars.color.surface,
  color: "#DC2626",
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  "@media": {
    "screen and (max-width: 768px)": {
      minHeight: "44px",
    },
  },
});
