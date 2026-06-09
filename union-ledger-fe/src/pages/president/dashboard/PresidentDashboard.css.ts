import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  minHeight: "100vh",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  background: "#F7F8FC",
  "@media": {
    "screen and (max-width: 900px)": {
      padding: "24px",
      gap: "20px",
    },
    "screen and (max-width: 560px)": {
      padding: "18px",
    },
  },
});

export const stateBox = style({
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.description,
  ...vars.font.body_regular_16,
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const title = style({
  margin: 0,
  ...vars.font.display_bold_30,
  color: vars.color.primary,
});

export const desc = style({
  margin: 0,
  ...vars.font.body_regular_16,
  color: vars.color.description,
});

export const bottomGrid = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.75fr)",
  gap: "28px",
  "@media": {
    "screen and (max-width: 900px)": {
      gridTemplateColumns: "1fr",
    },
  },
});
