import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const container = style({
  minHeight: "100vh",
  padding: "48px 56px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  background: "linear-gradient(135deg, #F8FAFC 0%, #FAF5FF 50%, #EFF6FF 100%)",
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const title = style({
  ...vars.font.display_bold_30,
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const desc = style({
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const formCard = style({
  padding: "32px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const formHeader = style({
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  marginBottom: "28px",
});

export const formIcon = style({
  color: vars.color.primary,
  fontSize: "2.4rem",
  lineHeight: "1",
});

export const formTitle = style({
  margin: 0,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const formDesc = style({
  margin: "8px 0 0",
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const formGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
});

export const field = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const label = style({
  ...vars.font.body_medium_14,
  color: vars.color.summaryTitle,
});

export const input = style({
  height: "52px",
  border: "none",
  borderRadius: "8px",
  background: vars.color.background,
  padding: "0 16px",
  outline: "none",
  color: vars.color.summaryTitle,
  ...vars.font.body_regular_16,

  "::placeholder": {
    color: vars.color.gray,
  },
});

export const select = style({
  height: "52px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.subtitle}`,
  background: vars.color.surface,
  padding: "0 16px",
  outline: "none",
  color: vars.color.summaryTitle,
  ...vars.font.body_regular_16,
});

export const helper = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const sendButton = style({
  width: "100%",
  height: "56px",
  marginTop: "28px",
  border: "none",
  borderRadius: "8px",
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  fontWeight: "700",

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const listCard = style({
  padding: "32px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const listTitle = style({
  margin: 0,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const listDesc = style({
  margin: "10px 0 28px",
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const invitationList = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const invitationItem = style({
  minHeight: "84px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "18px",
  padding: "18px 20px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
});

export const email = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
  marginRight: "12px",
});

export const statusBadge = recipe({
  base: {
    display: "inline-flex",
    padding: "4px 10px",
    borderRadius: "999px",
    color: vars.color.surface,
    ...vars.font.caption_regular_12,
    fontWeight: "700",
  },
  variants: {
    status: {
      accepted: {
        background: vars.color.accent.green,
      },
      pending: {
        background: vars.color.accent.orange,
      },
    },
  },
});

export const meta = style({
  margin: "10px 0 0",
  ...vars.font.body_regular_16,
  color: vars.color.description,
});

export const cancelButton = style({
  minWidth: "80px",
  height: "36px",
  border: "none",
  background: vars.color.transparent,
  color: vars.color.accent.red,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const emptyBox = style({
  padding: "18px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.description,
  ...vars.font.body_regular_14,
});
