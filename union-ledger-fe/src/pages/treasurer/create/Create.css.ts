import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@styles/theme.css.ts";

export const container = style({
  width: "100%",

  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "32px",
  marginBottom: "32px",
});

export const titleBox = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const title = style({
  ...vars.font.display_bold_30,
  color: vars.color.accent.violet,
});

export const description = style({
  ...vars.font.body_regular_16,
  color: vars.color.description,
});

export const summaryBox = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const summaryTitleBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const summaryTitle = style({
  color: vars.color.foreground,
  ...vars.font.heading_medium_20,
});

export const summaryDescription = style({
  color: vars.color.border,
  ...vars.font.body_regular_16,
});

export const summaryTotalContainer = style({
  display: "flex",
  gap: "24px",
  justifyContent: "space-between",
});

export const summaryTotalBox = recipe({
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "21px",
    borderRadius: "14px",
  },
  variants: {
    color: {
      blueSoft: {
        background: `linear-gradient(135deg, ${vars.color.blueSoft.bgFrom} 0%, ${vars.color.blueSoft.bgTo} 100%)`,
        border: `1px solid ${vars.color.blueSoft.border}`,
      },
      mint: {
        background: `linear-gradient(135deg, ${vars.color.mint.bgFrom} 0%, ${vars.color.mint.bgTo} 100%)`,
        border: `1px solid ${vars.color.mint.border}`,
      },
    },
  },
});

export const summaryTotalTitle = recipe({
  base: {
    ...vars.font.body_medium_14,
  },
  variants: {
    color: {
      blueSoft: {
        color: vars.color.blueSoft.textStrong,
      },
      mint: {
        color: vars.color.mint.textStrong,
      },
    },
  },
});

export const summaryTotalAmount = recipe({
  base: {
    ...vars.font.display_bold_30,
  },
  variants: {
    color: {
      blueSoft: {
        color: vars.color.blueSoft.text,
      },
      mint: {
        color: vars.color.mint.text,
      },
    },
  },
});

export const summaryContentBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const summaryContentTitle = style({
  ...vars.font.head_bold_16,
  color: vars.color.summaryTitle,
});

export const summaryContentItemBox = style({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  padding: "16px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  alignItems: "center",
});

export const summaryContentItemInfo = style({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
});

export const summaryContentItemTitle = style({
  ...vars.font.head_medium_16,
  color: vars.color.summaryTitle,
});

export const summaryContentItemDescription = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const summaryContentItemAmount = style({
  ...vars.font.title_bold_16,
  color: vars.color.accent.violet,
});

export const summaryContentEmpty = style({
  ...vars.font.body_regular_14,
  width: "100%",
  padding: "16px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  color: vars.color.description,
  background: "rgba(255, 255, 255, 0.58)",
});

export const rejectedPanel = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "24px",
  borderRadius: "14px",
  border: "1px solid #FCA5A5",
  background: "linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%)",
  boxShadow:
    "0 20px 25px -5px rgba(239, 68, 68, 0.12), 0 8px 10px -6px rgba(239, 68, 68, 0.12)",
});

export const rejectedHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const rejectedTitleRow = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const rejectedIcon = style({
  width: "20px",
  height: "20px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  border: "2px solid #DC2626",
  color: "#DC2626",
  fontSize: "1.6rem",
  fontWeight: "700",
  lineHeight: 1,
});

export const rejectedTitle = style({
  ...vars.font.title_bold_18,
  color: "#B91C1C",
});

export const rejectedDescription = style({
  ...vars.font.body_regular_14,
  color: "#DC2626",
});

export const rejectedDetailBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  padding: "18px",
  borderRadius: "10px",
  border: "1px solid #FECACA",
  background: "rgba(255, 255, 255, 0.86)",
});

export const rejectedMetaRow = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
});

export const rejectedReviewerBox = style({
  textAlign: "right",
});

export const rejectedMetaLabel = style({
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const rejectedMetaValue = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
});

export const rejectedSectionTitle = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
});

export const rejectedQuote = style({
  ...vars.font.body_regular_14,
  padding: "14px 16px",
  borderLeft: "4px solid #FB7185",
  borderRadius: "6px",
  background: "#FFF1F2",
  color: vars.color.description,
});

export const rejectedIssueList = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const rejectedIssueItem = style({
  display: "flex",
  gap: "10px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #FECACA",
  background: "rgba(255, 255, 255, 0.72)",
});

export const rejectedIssueIcon = style({
  color: "#EF4444",
  ...vars.font.body_medium_14,
  flexShrink: 0,
});

export const rejectedIssueTitle = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
});

export const rejectedIssueDescription = style({
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const rejectedDivider = style({
  height: "1px",
  background: "#FED7AA",
});

export const rejectedTextarea = style({
  width: "100%",
  minHeight: "64px",
  resize: "vertical",
  padding: "12px 14px",
  border: `1px solid ${vars.color.ItemBorder}`,
  borderRadius: "8px",
  background: "#F8FAFC",
  color: vars.color.summaryTitle,
  outline: "none",
  ...vars.font.body_regular_14,

  "::placeholder": {
    color: "#94A3B8",
  },

  ":focus": {
    borderColor: "#FB7185",
    boxShadow: "0 0 0 3px rgba(251, 113, 133, 0.16)",
  },
});

export const rejectedHelper = style({
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const rejectedActionRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
});

export const rejectedOutlineButton = style({
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.summaryTitle,
  cursor: "pointer",
  ...vars.font.body_medium_14,
});

export const rejectedSubmitButton = style({
  height: "38px",
  border: "none",
  borderRadius: "8px",
  background: `linear-gradient(90deg, ${vars.color.gradient.redTo} 0%, ${vars.color.gradient.orangeFrom} 100%)`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const publishPanel = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px",
  borderRadius: "14px",
  border: "1px solid #86EFAC",
  background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
});

export const publishHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const publishTitle = style({
  ...vars.font.title_bold_18,
  color: "#15803D",
});

export const publishDescription = style({
  ...vars.font.body_regular_14,
  color: "#16A34A",
});

export const publishButton = style({
  alignSelf: "flex-start",
  height: "38px",
  padding: "0 24px",
  border: "none",
  borderRadius: "8px",
  background: "#16A34A",
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const fileContainer = style({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
});

export const fileBox = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px",
  borderRadius: "14px",
  background: vars.color.white80,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const fileTitleBox = style({
  display: "flex",
  gap: "12px",
  alignItems: "center",
});

export const fileIconBox = recipe({
  base: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  variants: {
    color: {
      green: {
        background: `linear-gradient(135deg, ${vars.color.gradient.greenFrom} 0%, ${vars.color.gradient.greenTo} 100%)`,
      },
      red: {
        background: `linear-gradient(135deg, ${vars.color.gradient.redFrom} 0%, ${vars.color.gradient.redTo} 100%)`,
      },
    },
  },
});

export const fileIcon = style({ width: "24px", height: "24px" });

export const fileTitleDescriptionBox = style({
  display: "flex",
  flexDirection: "column",
});

export const fileTitle = style({
  ...vars.font.head_medium_16,
  color: vars.color.foreground,
});

export const fileDescription = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const fileListBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const fileListItem = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const checklistBox = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "13px 17px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.subtitle}`,
  background: vars.color.checklistbackground,
});

export const checklistTitle = style({
  ...vars.font.title_bold_14,
  color: vars.color.border,
});

export const checklistItemBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  paddingLeft: "20px",
});

export const checklistItem = style({
  ...vars.font.body_regular_14,
  color: vars.color.border,
});

export const buttonBox = style({
  display: "flex",
  justifyContent: "center",
  padding: "10.5px 16px",
  borderRadius: "8px",
  background: `linear-gradient(90deg,${vars.color.gradient.brandFrom} 0%,${vars.color.gradient.brandTo} 100%)`,
  boxShadow: `0 10px 15px -3px ${vars.color.white10}, 0 4px 6px -4px ${vars.color.white10}`,
  cursor: "pointer",
  gap: "14px",
  margin: "auto",
});

export const buttonIcon = style({
  width: "16px",
  height: "16px",
});

export const buttonText = style({
  ...vars.font.body_medium_14,
  color: vars.color.surface,
  transform: "translateY(-1px)",
});

export const reconciliationBox = style({
  width: "100%",
  marginTop: "32px",
  padding: "28px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const reconciliationTitleBox = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px",
});

export const reconciliationTitle = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const reconciliationIcon = style({
  color: vars.color.primary,
  fontSize: "1.8rem",
  fontWeight: "700",
});

export const reconciliationDescription = style({
  marginTop: "8px",
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const reconciliationTabBox = style({
  width: "520px",
  height: "34px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  padding: "4px",
  borderRadius: "999px",
  background: vars.color.background,
  marginBottom: "24px",
});

export const reconciliationTab = style({
  border: "none",
  borderRadius: "999px",
  background: vars.color.transparent,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  color: vars.color.summaryTitle,
});

export const reconciliationTabActive = style({
  background: vars.color.surface,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
});

export const reconciliationList = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const reconciliationEmpty = style({
  ...vars.font.body_regular_14,
  padding: "18px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  color: vars.color.description,
  background: vars.color.surface,
});

export const reconciliationItem = style({
  padding: "18px",
  borderRadius: "10px",
  border: "1px solid",
});

export const reconciliationItemMatched = style({
  background: `linear-gradient(135deg, ${vars.color.mint.bgFrom} 0%, ${vars.color.mint.bgTo} 100%)`,
  borderColor: vars.color.mint.border,
});

export const reconciliationItemIssue = style({
  background: "linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)",
  borderColor: "#FECACA",
});

export const reconciliationItemTop = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "10px",
});

export const reconciliationDate = style({
  ...vars.font.body_regular_14,
  color: vars.color.gray,
});

export const reconciliationCategory = style({
  padding: "3px 9px",
  borderRadius: "7px",
  background: vars.color.summaryTitle,
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
});

export const reconciliationCheckIcon = style({
  color: vars.color.accent.green,
  ...vars.font.body_medium_14,
  fontWeight: "700",
});

export const reconciliationWarningIcon = style({
  color: vars.color.accent.red,
  ...vars.font.body_medium_14,
  fontWeight: "700",
});

export const reconciliationMerchant = style({
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
  marginBottom: "8px",
});

export const reconciliationAmount = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const reconciliationIssueMessage = style({
  marginTop: "12px",
  ...vars.font.caption_regular_12,
  color: vars.color.accent.red,
});

export const reconciliationStatsBox = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "10px",
  marginTop: "18px",
});

export const reconciliationStatsItem = style({
  ...vars.font.body_regular_14,
  padding: "12px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  color: vars.color.description,
  background: vars.color.surface,
});

export const reconciliationFooter = style({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "12px",
  marginTop: "28px",
  paddingTop: "24px",
  borderTop: `1px solid ${vars.color.ItemBorder}`,
});

export const reconciliationBackButton = style({
  height: "36px",
  padding: "0 20px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  color: vars.color.summaryTitle,
});

export const reconciliationGenerateButton = style({
  height: "36px",
  padding: "0 20px",
  border: "none",
  borderRadius: "8px",
  background: `linear-gradient(90deg, ${vars.color.gradient.violetFrom} 0%, ${vars.color.gradient.violetTo} 100%)`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.55,
    cursor: "not-allowed",
  },
});

export const reconciliationMerchantName = style({
  fontWeight: "500",
});

export const artifactPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "18px",
  padding: "18px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.mint.border}`,
  background: `linear-gradient(135deg, ${vars.color.mint.bgFrom} 0%, ${vars.color.mint.bgTo} 100%)`,
});

export const artifactPanelTitle = style({
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
});

export const artifactRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "12px 14px",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.86)",
  border: `1px solid ${vars.color.ItemBorder}`,
});

export const artifactName = style({
  ...vars.font.body_medium_14,
  color: vars.color.summaryTitle,
});

export const artifactDownloadButton = style({
  height: "34px",
  padding: "0 16px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.primary}`,
  background: vars.color.surface,
  color: vars.color.primary,
  cursor: "pointer",
  ...vars.font.body_medium_14,

  ":disabled": {
    opacity: 0.55,
    cursor: "not-allowed",
  },
});

export const artifactStatusFailed = style({
  ...vars.font.caption_regular_12,
  color: vars.color.accent.red,
});

export const reconciliationResolveButton = style({
  marginTop: "12px",
  height: "32px",
  padding: "0 14px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.accent.violet}`,
  background: vars.color.surface,
  color: vars.color.accent.violet,
  cursor: "pointer",
  ...vars.font.caption_regular_12,

  ":disabled": {
    opacity: 0.55,
    cursor: "not-allowed",
  },
});
