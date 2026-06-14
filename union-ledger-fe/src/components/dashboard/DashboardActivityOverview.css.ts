import { style, styleVariants } from "@vanilla-extract/css";
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
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "18px",
      gap: "16px",
    },
  },
});

export const title = style({
  ...vars.font.heading_medium_20,
  color: vars.color.foreground,
});

export const contentContainer = style({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "@media": {
    "screen and (max-width: 768px)": {
      height: "auto",
      gap: "14px",
    },
  },
});

export const activityContainer = style({
  width: "100%",
  display: "flex",
  gap: "16px",
});

// 클릭 가능한 활동 행 (딥링크) — 버튼 기본 스타일 리셋 + 호버
export const activityButton = style({
  width: "100%",
  display: "flex",
  gap: "16px",
  padding: "4px",
  margin: "-4px",
  border: "none",
  background: "transparent",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
  font: "inherit",
  ":hover": {
    background: "rgba(15, 23, 42, 0.04)",
  },
});

export const activityCircle = style({
  position: "relative",
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  flexShrink: 0,
  marginTop: "6px",
  zIndex: 0,
});

export const activityCircleVariant = styleVariants({
  receipt: {
    background: vars.color.accent.green,
    selectors: {
      "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "rgba(0, 201, 80, 0.22)",
        filter: "blur(6px)",
        zIndex: -1,
      },
    },
  },
  expense: {
    background: vars.color.accent.purple,
    selectors: {
      "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "rgba(152, 16, 250, 0.22)",
        filter: "blur(6px)",
        zIndex: -1,
      },
    },
  },
  unmatched: {
    background: vars.color.accent.orange,
    selectors: {
      "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "rgba(255, 105, 0, 0.22)",
        filter: "blur(6px)",
        zIndex: -1,
      },
    },
  },
  audit: {
    background: vars.color.accent.blue,
    selectors: {
      "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "rgba(43, 127, 255, 0.22)",
        filter: "blur(6px)",
        zIndex: -1,
      },
    },
  },
});

export const activityTextContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "3.5px",
});

export const activityTitle = style({
  ...vars.font.body_medium_14,
  color: "#0F172B",
});

export const activityTime = style({
  ...vars.font.caption_regular_12,
  color: "#62748E",
});
