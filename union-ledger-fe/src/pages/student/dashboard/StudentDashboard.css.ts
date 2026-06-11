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

export const contentContainer = style({
  width: "100%",
  height: "auto",
  display: "flex",
  gap: "32px",
  paddingBottom: "32px",
  "@media": {
    "screen and (max-width: 768px)": {
      flexDirection: "column",
    },
  },
});

export const toast = style({
  position: "fixed",
  right: "32px",
  bottom: "32px",
  zIndex: 20,
  maxWidth: "360px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "18px 20px",
  borderRadius: "8px",
  background: vars.color.surface,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.18)",
  color: vars.color.summaryTitle,
  ...vars.font.body_medium_14,
  "@media": {
    "screen and (max-width: 768px)": {
      right: "16px",
      bottom: "16px",
      maxWidth: "calc(100vw - 32px)",
    },
  },
});

export const toastIcon = style({
  width: "20px",
  height: "20px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  background: vars.color.summaryTitle,
  color: vars.color.surface,
  flexShrink: 0,
  fontWeight: "700",
});
