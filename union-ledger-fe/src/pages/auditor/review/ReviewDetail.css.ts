import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  minHeight: "100vh",
  padding: "44px 56px",
  background: `linear-gradient(135deg, ${vars.color.checklistbackground} 0%, ${vars.color.blueSoft.bgFrom} 100%)`,
});

export const backButton = style({
  border: "none",
  background: vars.color.transparent,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  color: vars.color.foreground,
  marginBottom: "24px",
});

export const headerContainer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "32px",
});

export const title = style({
  ...vars.font.display_bold_30,
  margin: 0,
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const desc = style({
  ...vars.font.body_regular_16,
  color: vars.color.gray,
  marginTop: "8px",
});

export const approvedStatusBadge = style({
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "14px",
  padding: "6px 12px",
  borderRadius: "8px",
  background: vars.color.accent.green,
  color: vars.color.surface,
  ...vars.font.body_medium_14,
  fontWeight: "700",
});

export const totalAmountWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
});

export const totalAmountLabel = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const totalAmount = style({
  ...vars.font.display_bold_30,
  color: vars.color.primary,
});

export const contentContainer = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "32px",
});

export const panel = style({
  height: "560px",
  borderRadius: "4px",
  background: vars.color.white80,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
  overflow: "hidden",
});

export const panelHeader = style({
  height: "96px",
  display: "flex",
  alignItems: "center",
  padding: "0 32px",
  background: `linear-gradient(90deg, ${vars.color.checklistbackground} 0%, ${vars.color.blueSoft.bgFrom} 100%)`,
  borderBottom: `1px solid ${vars.color.ItemBorder}`,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const panelBody = style({
  padding: "32px",
  height: "calc(100% - 96px)",
  overflowY: "auto",
});

export const sectionTitle = style({
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
  margin: 0,
  marginBottom: "20px",
});

export const categoryList = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const categoryItem = style({
  height: "82px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 18px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
});

export const categoryName = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const categoryCount = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
  margin: 0,
  marginTop: "4px",
});

export const categoryAmount = style({
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.primary,
});

export const transactionList = style({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const transactionItem = style({
  padding: "24px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
});

export const transactionTop = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "12px",
});

export const transactionDate = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const categoryBadge = style({
  padding: "4px 10px",
  borderRadius: "8px",
  background: vars.color.summaryTitle,
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
});

export const statusBadge = style({
  padding: "4px 10px",
  borderRadius: "8px",
  background: vars.color.blueSoft.bgFrom,
  color: vars.color.blueSoft.textStrong,
  ...vars.font.caption_regular_12,
});

export const merchantName = style({
  display: "block",
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
  marginBottom: "8px",
});

export const transactionAmount = style({
  display: "block",
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
  marginBottom: "20px",
});

export const reconciliationNote = style({
  ...vars.font.body_regular_14,
  color: vars.color.accent.red,
  margin: 0,
  marginBottom: "16px",
});

export const commentBox = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  borderTop: `1px solid ${vars.color.ItemBorder}`,
  paddingTop: "14px",
});

export const commentIcon = style({
  color: vars.color.border,
});

export const commentInput = style({
  flex: 1,
  height: "54px",
  border: "none",
  borderRadius: "8px",
  background: vars.color.background,
  padding: "0 16px",
  outline: "none",
  ...vars.font.body_regular_14,
  color: vars.color.summaryTitle,

  "::placeholder": {
    color: vars.color.gray,
  },

  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.72,
  },
});

export const commentSaveButton = style({
  width: "72px",
  height: "40px",
  border: "none",
  borderRadius: "8px",
  background: vars.color.primary,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.52,
  },
});

export const stateBox = style({
  ...vars.font.body_regular_16,
  width: "100%",
  padding: "20px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.gray,
});

export const auditPanel = style({
  marginTop: "32px",
  padding: "32px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const auditCompletePanel = style({
  marginTop: "32px",
  padding: "32px",
  borderRadius: "14px",
  border: `1px solid ${vars.color.mint.border}`,
  background: `linear-gradient(135deg, ${vars.color.mint.bgFrom} 0%, ${vars.color.mint.bgTo} 100%)`,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const auditCompleteTitle = style({
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.mint.textStrong,
  marginBottom: "16px",
});

export const auditCompleteDescription = style({
  ...vars.font.body_regular_16,
  color: vars.color.description,
  margin: 0,
});

export const auditTextarea = style({
  width: "100%",
  height: "80px",
  resize: "none",
  border: "none",
  borderRadius: "8px",
  background: vars.color.background,
  padding: "16px",
  outline: "none",
  ...vars.font.body_regular_14,
  color: vars.color.summaryTitle,
  marginBottom: "20px",

  "::placeholder": {
    color: vars.color.gray,
  },
});

export const actionContainer = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  borderTop: `1px solid ${vars.color.ItemBorder}`,
  paddingTop: "20px",
});

export const approveButton = style({
  height: "58px",
  border: "none",
  borderRadius: "8px",
  background: `linear-gradient(90deg, ${vars.color.gradient.greenFrom} 0%, ${vars.color.gradient.greenTo} 100%)`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  fontWeight: "700",

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const rejectButton = style({
  height: "58px",
  border: "none",
  borderRadius: "8px",
  background: `linear-gradient(90deg, ${vars.color.gradient.redFrom} 0%, ${vars.color.gradient.redTo} 100%)`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  fontWeight: "700",

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});
