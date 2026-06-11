import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "32px",
  background: "linear-gradient(135deg, #F8FAFC 0%, #FAF5FF 50%, #EFF6FF 100%);",
  "@media": {
    "screen and (max-width: 768px)": {
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

export const contentContainer = style({
  width: "100%",
  height: "338px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
  "@media": {
    "screen and (max-width: 768px)": {
      height: "auto",
      padding: "16px",
    },
  },
});

export const uploadTitle = style({
  ...vars.font.heading_medium_20,
  color: vars.color.foreground,
});

export const uploadListSection = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "24px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.86)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const uploadListHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
});

export const uploadListTitle = style({
  ...vars.font.heading_medium_20,
  margin: 0,
  color: vars.color.foreground,
});

export const uploadCount = style({
  ...vars.font.body_medium_14,
  color: vars.color.accent.indigo,
});

export const uploadList = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const uploadItem = style({
  display: "grid",
  gridTemplateColumns: "48px minmax(0, 1fr) 42px",
  alignItems: "center",
  gap: "16px",
  minHeight: "82px",
  padding: "16px",
  border: "1px solid #DCE5F1",
  borderRadius: "12px",
  background: "#FFFFFF",
});

export const fileIcon = style({
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  background: "#ECFDF5",
  color: "#047857",
  fontSize: "12px",
  fontWeight: 700,
});

export const fileInfo = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "5px",
});

export const fileName = style({
  ...vars.font.head_bold_16,
  overflow: "hidden",
  color: "#0F172B",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const uploadedAt = style({
  ...vars.font.caption_regular_12,
  color: "#64748B",
});

export const deleteButton = style({
  width: "42px",
  height: "42px",
  padding: 0,
  border: "1px solid #FCA5A5",
  borderRadius: "50%",
  background: "#FFFFFF",
  color: "#EF4444",
  fontSize: "28px",
  lineHeight: 1,
  cursor: "pointer",
  ":hover": {
    background: "#FEF2F2",
  },
  ":disabled": {
    cursor: "wait",
    opacity: 0.5,
  },
});

export const emptyList = style({
  ...vars.font.body_regular_16,
  padding: "28px",
  border: "1px dashed #CBD5E1",
  borderRadius: "12px",
  color: "#64748B",
  textAlign: "center",
});
