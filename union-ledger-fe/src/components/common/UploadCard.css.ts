import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  height: "232px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "8.5px",
  borderRadius: "14px",
  border: `2px dashed ${vars.color.footer}`,
  background:
    "linear-gradient(135deg, rgba(238, 242, 255, 0.50) 0%, rgba(250, 245, 255, 0.50) 100%)",
});

export const iconContainer = style({
  width: "64px",
  height: "64px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "16px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
});

export const iconContainerVariant = styleVariants({
  purple: {
    background: `linear-gradient(135deg, ${vars.color.gradient.violetFrom} 0%, ${vars.color.gradient.violetTo} 100%)`,
  },
  green: {
    background: `linear-gradient(135deg, ${vars.color.gradient.greenFrom} 0%, ${vars.color.gradient.greenTo} 100%)`,
  },
});

export const title = style({
  ...vars.font.head_bold_16,
  color: "#0F172B",
  marginTop: "7px",
});

export const desc = style({
  ...vars.font.body_medium_14,
  color: "#62748E",
});
