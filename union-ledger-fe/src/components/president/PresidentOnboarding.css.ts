import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const card = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "28px",
  borderRadius: "16px",
  border: `1px solid ${vars.color.semantic.info.border}`,
  background: vars.color.semantic.info.bg,
});

export const title = style({
  ...vars.font.title_bold_18,
  color: "#0F172A",
});

export const subtitle = style({
  ...vars.font.body_regular_14,
  color: "#475569",
});

export const steps = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "16px",
  margin: 0,
  padding: 0,
  listStyle: "none",
  "@media": {
    "screen and (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const step = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "16px",
  borderRadius: "12px",
  background: vars.color.surface,
  border: "1px solid #E2E8F0",
});

export const num = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  flexShrink: 0,
  borderRadius: "999px",
  background: vars.color.primary,
  color: "#FFFFFF",
  fontWeight: 800,
  fontSize: "1.4rem",
});

export const stepTitle = style({
  ...vars.font.body_medium_14,
  color: "#0F172A",
  fontWeight: 800,
  marginBottom: "4px",
});

export const stepDesc = style({
  ...vars.font.caption_regular_12,
  color: "#475569",
  lineHeight: 1.5,
});

export const cta = style({
  ...vars.font.body_medium_14,
  alignSelf: "flex-start",
  height: "44px",
  padding: "0 22px",
  borderRadius: vars.radius.md,
  border: "none",
  background: vars.color.primary,
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 800,
  ":hover": {
    opacity: 0.92,
  },
});
