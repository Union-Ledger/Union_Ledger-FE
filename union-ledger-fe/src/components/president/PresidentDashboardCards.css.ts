import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "24px",
  "@media": {
    "screen and (max-width: 1000px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    "screen and (max-width: 560px)": {
      gridTemplateColumns: "1fr",
      gap: "16px",
    },
  },
});

export const card = style({
  minHeight: "168px",
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  borderRadius: "14px",
  background: vars.color.white80,
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "16px",
    },
  },
});

export const iconContainer = style({
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  borderRadius: "14px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
});

export const icon = style({
  width: "24px",
  height: "24px",
});

export const iconVariant = styleVariants({
  team: {
    background: `linear-gradient(135deg, ${vars.color.gradient.cyanFrom}, ${vars.color.gradient.cyanTo})`,
  },
  submitted: {
    background: `linear-gradient(135deg, ${vars.color.gradient.pinkFrom}, ${vars.color.gradient.pinkTo})`,
  },
  completed: {
    background: `linear-gradient(135deg, ${vars.color.gradient.greenFrom}, ${vars.color.gradient.greenTo})`,
  },
  pending: {
    background: `linear-gradient(135deg, ${vars.color.gradient.orangeFrom}, ${vars.color.gradient.orangeTo})`,
  },
});

export const cardTitle = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const cardContent = style({
  ...vars.font.title_bold_24,
  color: vars.color.summaryTitle,
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "2rem",
    },
  },
});
