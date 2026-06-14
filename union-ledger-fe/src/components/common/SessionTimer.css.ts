import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const pulse = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.5 },
});

// 사이드바(알림벨·프로필과 같은 계정 영역) 안에 배치 — 페이지 헤더/토스트와 겹치지 않음
export const wrapper = style({
  width: "256px",
  padding: "8px 16px",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
    },
  },
});

const base = style({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "8px 14px",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  cursor: "pointer",
  border: `1px solid ${vars.color.ItemBorder}`,
  backgroundColor: vars.color.surface,
  color: vars.color.description,
  transition: "box-shadow 0.12s ease",
  selectors: {
    "&:hover": {
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.10)",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: "2px",
    },
  },
});

export const chip = base;

export const chipWarning = style([
  base,
  {
    backgroundColor: vars.color.semantic.warning.bg,
    borderColor: vars.color.semantic.warning.border,
    color: vars.color.semantic.warning.text,
  },
]);

export const dot = style({
  width: "8px",
  height: "8px",
  borderRadius: "9999px",
  backgroundColor: vars.color.semantic.success.strong,
});

export const dotWarning = style([
  dot,
  {
    backgroundColor: vars.color.semantic.warning.strong,
    animation: `${pulse} 1.2s ease-in-out infinite`,
  },
]);
