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
  paddingBottom: "32px",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "20px 16px",
      gap: "20px",
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

export const filterRow = style({
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
});

export const filterButton = style({
  ...vars.font.body_medium_14,
  padding: "8px 16px",
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.ItemBorder}`,
  background: "rgba(255, 255, 255, 0.80)",
  color: vars.color.gray,
  cursor: "pointer",
  fontWeight: 700,
  whiteSpace: "nowrap",
});

export const filterButtonActive = style({
  background: vars.color.primary,
  borderColor: vars.color.primary,
  color: "#FFFFFF",
});

export const contentContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const emptyBox = style({
  ...vars.font.body_regular_16,
  width: "100%",
  padding: "24px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  border: `1px solid ${vars.color.ItemBorder}`,
  color: vars.color.gray,
});
