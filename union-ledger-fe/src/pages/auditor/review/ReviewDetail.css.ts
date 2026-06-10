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

export const exceptionSection = style({
  marginBottom: "28px",
  padding: "20px",
  border: `1px solid ${vars.color.accent.red}`,
  borderRadius: "8px",
  background: "#fff8f8",
});

export const exceptionHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "16px",
});

export const exceptionTitle = style({
  margin: 0,
  marginBottom: "4px",
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const exceptionDescription = style({
  margin: 0,
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const exceptionCount = style({
  flexShrink: 0,
  padding: "4px 10px",
  borderRadius: "8px",
  background: vars.color.accent.red,
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
});

export const exceptionList = style({
  display: "grid",
  gap: "12px",
});

export const exceptionItem = style({
  padding: "16px",
  border: `1px solid ${vars.color.ItemBorder}`,
  borderRadius: "8px",
  background: vars.color.surface,
});

export const exceptionItemHeader = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "14px",
});

export const exceptionStatusBadge = style({
  padding: "4px 10px",
  borderRadius: "8px",
  background: "#ffe5e5",
  color: vars.color.accent.red,
  ...vars.font.caption_regular_12,
});

export const manualResolutionLabel = style({
  padding: "4px 10px",
  borderRadius: "8px",
  background: vars.color.blueSoft.bgFrom,
  color: vars.color.blueSoft.textStrong,
  ...vars.font.caption_regular_12,
});

export const exceptionSources = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
  marginBottom: "12px",

  "@media": {
    "screen and (max-width: 720px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const exceptionSource = style({
  minWidth: 0,
  padding: "12px",
  borderRadius: "8px",
  background: vars.color.background,
});

export const exceptionSourceLabel = style({
  display: "block",
  marginBottom: "6px",
  ...vars.font.caption_regular_12,
  color: vars.color.gray,
});

export const exceptionSourceValue = style({
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  ...vars.font.body_medium_14,
  color: vars.color.summaryTitle,
});

export const exceptionMissingValue = style([
  exceptionSourceValue,
  {
    color: vars.color.accent.red,
  },
]);

export const exceptionNote = style({
  padding: "12px",
  borderLeft: `3px solid ${vars.color.accent.red}`,
  background: "#fff3f3",
});

export const exceptionNoteLabel = style({
  display: "block",
  marginBottom: "4px",
  ...vars.font.caption_regular_12,
  color: vars.color.gray,
});

export const exceptionNoteText = style({
  margin: 0,
  ...vars.font.body_regular_14,
  color: vars.color.summaryTitle,
  whiteSpace: "pre-wrap",
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

export const viewEvidenceButton = style({
  marginLeft: "auto",
  padding: "4px 12px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.primary}`,
  background: vars.color.surface,
  color: vars.color.primary,
  cursor: "pointer",
  ...vars.font.caption_regular_12,
});

export const missingItem = style({
  padding: "24px",
  borderRadius: "10px",
  border: "1px solid #FECACA",
  background: "linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)",
});

export const missingBadge = style({
  padding: "4px 10px",
  borderRadius: "8px",
  background: vars.color.accent.red,
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
});

export const subSectionTitle = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
  margin: "24px 0 12px",
});

export const overallCommentsPanel = style({
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const overallCommentItem = style({
  padding: "14px 16px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
});

export const overallCommentMeta = style({
  ...vars.font.caption_regular_12,
  color: vars.color.gray,
  marginBottom: "4px",
});

export const overallCommentText = style({
  ...vars.font.body_regular_14,
  color: vars.color.summaryTitle,
});

export const modalOverlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(15, 23, 42, 0.55)",
});

export const modalCard = style({
  width: "100%",
  maxWidth: "560px",
  maxHeight: "86vh",
  overflowY: "auto",
  padding: "24px",
  borderRadius: "14px",
  background: vars.color.surface,
  boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.35)",
});

export const modalTitleRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
});

export const modalTitle = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const modalCloseButton = style({
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.summaryTitle,
  cursor: "pointer",
  ...vars.font.body_medium_14,
});

export const modalImageWrap = style({
  display: "flex",
  justifyContent: "center",
  marginBottom: "18px",
  borderRadius: "10px",
  background: vars.color.background,
  padding: "12px",
});

export const modalImage = style({
  maxWidth: "100%",
  maxHeight: "420px",
  borderRadius: "6px",
});

export const modalStateText = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
  textAlign: "center",
  padding: "32px 0",
});

export const modalOpenLink = style({
  display: "inline-block",
  marginTop: "8px",
  padding: "8px 16px",
  borderRadius: "8px",
  background: vars.color.primary,
  color: vars.color.surface,
  cursor: "pointer",
  border: "none",
  ...vars.font.body_medium_14,
});

export const modalFields = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const modalFieldRow = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  padding: "10px 0",
  borderBottom: `1px solid ${vars.color.ItemBorder}`,
});

export const modalFieldLabel = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const modalFieldValue = style({
  ...vars.font.body_medium_14,
  color: vars.color.summaryTitle,
  textAlign: "right",
});
