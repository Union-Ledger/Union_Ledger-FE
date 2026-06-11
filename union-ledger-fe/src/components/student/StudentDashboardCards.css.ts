import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "24px",
  "@media": {
    "screen and (max-width: 1180px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    "screen and (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "16px",
    },
  },
});

export const card = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "17.2rem",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
  padding: "24px",
  border: `1px solid ${vars.color.white80}`,
  "@media": {
    "screen and (max-width: 768px)": {
      minHeight: "14.8rem",
      padding: "20px",
    },
  },
});

export const cardHeader = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "18px",
});

export const iconContainer = style({
  width: "42px",
  height: "42px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  borderRadius: "12px",
  background: `linear-gradient(135deg, ${vars.color.gradient.cyanFrom} 0%, ${vars.color.gradient.cyanTo} 100%)`,
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
});

export const iconVariant = styleVariants({
  settlement: {
    background: `linear-gradient(135deg, ${vars.color.gradient.cyanFrom} 0%, ${vars.color.gradient.cyanTo} 100%)`,
  },
  semesterExpense: {
    background: `linear-gradient(135deg, ${vars.color.gradient.pinkFrom} 0%, ${vars.color.gradient.pinkTo} 100%)`,
  },
  viewCount: {
    background: `linear-gradient(135deg, ${vars.color.gradient.orangeFrom} 0%, ${vars.color.gradient.orangeTo} 100%)`,
  },
  recentApprovalDate: {
    background: `linear-gradient(135deg, ${vars.color.gradient.greenFrom} 0%, ${vars.color.gradient.greenTo} 100%)`,
  },
});

export const cardTitle = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
  fontWeight: "700",
});

export const cardContent = style({
  ...vars.font.title_bold_24,
  color: "#0F172B",
  marginTop: "auto",
  fontVariantNumeric: "tabular-nums",
});

export const cardDescription = style({
  ...vars.font.caption_regular_12,
  marginTop: "6px",
  color: vars.color.description,
});
