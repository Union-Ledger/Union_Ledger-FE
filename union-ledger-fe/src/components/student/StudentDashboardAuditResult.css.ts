import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px",
  background: "rgba(255, 255, 255, 0.80)",
  borderRadius: "14px",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
});

export const title = style({
  ...vars.font.heading_medium_20,
  color: vars.color.foreground,
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const contentContainer = style({
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const resultCard = style({
  display: "flex",
  flexDirection: "column",
  padding: "18px",
  gap: "8px",
  borderRadius: "10px",
  border: "2px solid #B9F8CF",
  background: "#F0FDF4",
});

export const resultHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const resultHeaderRight = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const resultSemester = style({
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
});

export const resultStatus = style({
  ...vars.font.caption_regular_12,
  fontWeight: "500",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  border: "1px solid rgba(0, 0, 0, 0.00)",
  background: "#00C950",
  width: "58px",
  height: "22px",
});

export const resultAmount = style({
  ...vars.font.body_medium_14,
  fontWeight: "600",
  color: "#314158",
});

export const resultComment = style({
  ...vars.font.body_regular_14,
  color: "#45556C",
});

export const resultApprovedAt = style({
  ...vars.font.caption_regular_12,
  color: "#45556C",
});
