import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const container = style({
  minHeight: "100vh",
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  background: "linear-gradient(135deg, #F8FAFC 0%, #FAF5FF 50%, #EFF6FF 100%)",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "16px",
      gap: "20px",
    },
  },
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
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

export const noticeBox = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 16px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.blueSoft.bgFrom,
  color: vars.color.blueSoft.text,
  ...vars.font.body_regular_14,
});

export const noticeIcon = style({
  color: vars.color.blueSoft.textStrong,
  fontWeight: "700",
});

export const card = style({
  padding: "28px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "20px",
    },
  },
});

export const completedCard = style([card, { padding: "24px" }]);

export const sectionTitle = style({
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const sectionDesc = style({
  marginTop: "4px",
  marginBottom: "22px",
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const invitationList = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const invitationItem = style({
  padding: "20px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: "#EFF6FF",
});

export const invitationHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginBottom: "12px",
});

export const invitationTitle = style({
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
  marginRight: "8px",
});

export const roleBadge = style({
  display: "inline-flex",
  alignItems: "center",
  padding: "3px 8px",
  borderRadius: "999px",
  background: vars.color.accent.indigo,
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
  fontWeight: "700",
});

export const orgInfo = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const metaGrid = style({
  display: "grid",
  gap: "6px",
  marginBottom: "14px",
  ...vars.font.body_regular_14,
  color: vars.color.summaryTitle,
});

export const expireText = style({
  color: vars.color.accent.red,
  fontWeight: "700",
});

// 만료가 임박하지 않은 초대 — 중립 색상
export const expireNormal = style({
  color: vars.color.gray,
  fontWeight: "600",
});

export const descriptionBox = style({
  padding: "12px 14px",
  borderRadius: "6px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.surface,
  ...vars.font.body_regular_14,
  color: vars.color.description,
  marginBottom: "14px",
});

export const actionRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  "@media": {
    "screen and (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "10px",
    },
  },
});

export const acceptButton = style({
  height: "40px",
  border: "none",
  borderRadius: "7px",
  background: `linear-gradient(90deg, ${vars.color.gradient.greenFrom} 0%, ${vars.color.gradient.greenTo} 100%)`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const rejectButton = style({
  height: "40px",
  borderRadius: "7px",
  border: `1px solid ${vars.color.accent.red}`,
  background: vars.color.surface,
  color: vars.color.accent.red,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const completedList = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "20px",
});

export const completedItem = recipe({
  base: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid",
  },
  variants: {
    status: {
      accepted: {
        borderColor: vars.color.mint.border,
        background: vars.color.mint.bgFrom,
      },
      rejected: {
        borderColor: "#FECACA",
        background: "#FEF2F2",
      },
    },
  },
});

export const completedTitle = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
});

export const completedStatus = style({
  display: "inline-flex",
  padding: "3px 8px",
  borderRadius: "999px",
  background: vars.color.accent.green,
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
  fontWeight: "700",
});

export const completedMeta = style({
  flexBasis: "100%",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const emptyBox = style({
  padding: "18px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.description,
  ...vars.font.body_regular_14,
});
