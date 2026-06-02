import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  height: "210px",
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const titleContainer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const titleWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

export const title = style({
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const status = style({
  ...vars.font.caption_regular_12,
  color: "#9F2D00",
  display: "flex",
  width: "49.141px",
  height: "22px",
  padding: "2px 8px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  border: "1px solid rgba(0, 0, 0, 0.00)",
  background: "#FFEDD4",
});

export const statusVariant = styleVariants({
  SUBMITTED: {
    color: "#9F2D00",
    background: "#FFEDD4",
  },
  REVIEWING: {
    color: "#193CB8",
    background: "#DBEAFE",
  },
  APPROVED: {
    color: "#016630",
    background: "#DCFCE7",
  },
  REJECTED: {
    color: "#B91C1C",
    background: "#FEE2E2",
  },
});

export const button = style({
  ...vars.font.body_medium_14,
  color: "white",
  display: "flex",
  width: "140px",
  height: "36px",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  borderRadius: "8px",
  background: "linear-gradient(90deg, #4F39F6 0%, #9810FA 100%)",
  border: "none",
});

export const desc = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
  marginTop: "7px",
});

export const infoContainer = style({
  display: "flex",
  height: "86px",
  gap: "16px",
  marginTop: "16px",
});

export const infoItem = style({
  display: "flex",
  flexDirection: "column",
  gap: "3.5px",
  width: "286px",
  height: "100%",
  borderRadius: "14px",
  border: "1px solid",
  padding: "17px",
});

export const infoItemVariant = styleVariants({
  amount: {
    background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)",
    borderColor: "#C6D2FF",
  },
  receipt: {
    background: "linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%);",
    borderColor: "#BEDBFF",
  },
});

export const infoTitle = style({
  ...vars.font.body_medium_14,
  color: vars.color.gray,
});

export const infoTitleVariant = styleVariants({
  amount: {
    color: "#432DD7",
  },
  receipt: {
    color: "#1447E6",
  },
});

export const infoContent = style({
  color: vars.color.summaryTitle,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
});

export const infoContentVariant = styleVariants({
  amount: {
    color: "#312C85",
  },
  receipt: {
    color: "#1C398E",
  },
});
