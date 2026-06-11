import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  height: "168px",
  display: "flex",
  gap: "24px",
  "@media": {
    "screen and (max-width: 768px)": {
      height: "auto",
      flexWrap: "wrap",
      gap: "16px",
    },
  },
});

export const card = style({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
  padding: "24px",
  "@media": {
    "screen and (max-width: 768px)": {
      flex: "1 1 calc(50% - 8px)",
      height: "auto",
      padding: "16px",
    },
    "screen and (max-width: 480px)": {
      flex: "1 1 100%",
    },
  },
});

export const iconContainer = style({
  width: "48px",
  height: "48px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "14px",
  background: `linear-gradient(135deg, ${vars.color.gradient.cyanFrom} 0%, ${vars.color.gradient.cyanTo} 100%)`,
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
  marginBottom: "16.5px",
});

export const iconVariant = styleVariants({
  pendingReview: {
    background: `linear-gradient(135deg, ${vars.color.gradient.orangeFrom} 0%, ${vars.color.gradient.orangeTo} 100%)`,
  },
  approved: {
    background: `linear-gradient(135deg, ${vars.color.gradient.redFrom} 0%, ${vars.color.gradient.redTo} 100%)`,
  },
  rejected: {
    background: `linear-gradient(135deg, ${vars.color.gradient.orangeFrom} 0%, ${vars.color.gradient.orangeTo} 100%)`,
  },
  writtenComments: {
    background: `linear-gradient(135deg, ${vars.color.gradient.cyanFrom} 0%, ${vars.color.gradient.cyanTo} 100%)`,
  },
});

export const cardTitle = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const cardContent = style({
  ...vars.font.title_bold_24,
  color: "#0F172B",
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "2rem",
    },
  },
});
