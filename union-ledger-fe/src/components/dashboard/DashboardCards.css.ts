import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  height: "168px",
  display: "flex",
  gap: "24px",
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
  receipt: {
    background: `linear-gradient(135deg, ${vars.color.gradient.cyanFrom} 0%, ${vars.color.gradient.cyanTo} 100%)`,
  },
  expense: {
    background: `linear-gradient(135deg, ${vars.color.gradient.pinkFrom} 0%, ${vars.color.gradient.pinkTo} 100%)`,
  },
  unmatched: {
    background: `linear-gradient(135deg, ${vars.color.gradient.orangeFrom} 0%, ${vars.color.gradient.orangeTo} 100%)`,
  },
  audit: {
    background: `linear-gradient(135deg, ${vars.color.gradient.greenFrom} 0%, ${vars.color.gradient.greenTo} 100%)`,
  },
});

export const cardTitle = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const cardContent = style({
  ...vars.font.title_bold_24,
  color: "#0F172B",
});
