import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px",
  border: "1px solid #E2E8F0",
  borderRadius: "16px",
  background: "#FFFFFF",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "18px",
    },
  },
});

export const header = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "12px",
});

export const title = style({
  ...vars.font.title_bold_18,
  color: "#0F172A",
});

export const period = style({
  ...vars.font.caption_regular_12,
  color: "#64748B",
});

export const summary = style({
  ...vars.font.body_regular_14,
  color: "#475569",
});

export const summaryStrong = style({
  fontWeight: 800,
  color: "#0F172A",
});

export const deltaUp = style({
  fontWeight: 800,
  color: vars.color.semantic.danger.strong,
});

export const deltaDown = style({
  fontWeight: 800,
  color: vars.color.semantic.success.strong,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const row = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const rowHead = style({
  ...vars.font.body_medium_14,
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  color: "#334155",
});

export const orgName = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
});

export const mineBadge = style({
  ...vars.font.caption_regular_12,
  padding: "2px 8px",
  borderRadius: "999px",
  background: vars.color.semantic.info.bg,
  color: vars.color.semantic.info.strong,
  fontWeight: 800,
  whiteSpace: "nowrap",
});

export const amount = style({
  fontWeight: 800,
  color: "#0F172A",
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});

export const track = style({
  width: "100%",
  height: "10px",
  borderRadius: "999px",
  background: "#F1F5F9",
  overflow: "hidden",
});

export const bar = style({
  height: "100%",
  borderRadius: "999px",
  background: "#CBD5E1",
});

export const barMine = style({
  height: "100%",
  borderRadius: "999px",
  background: vars.color.primary,
});
