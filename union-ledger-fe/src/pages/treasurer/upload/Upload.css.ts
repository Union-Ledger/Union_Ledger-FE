import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "32px",
  background: "linear-gradient(135deg, #F8FAFC 0%, #FAF5FF 50%, #EFF6FF 100%);",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "16px",
      gap: "24px",
    },
  },
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "7.5px",
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

export const contentContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
});

export const categoryFieldContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const categoryLabel = style({
  ...vars.font.head_bold_16,
  color: "#0F172B",
});

export const categoryInput = style({
  ...vars.font.body_regular_16,
  width: "100%",
  height: "56px",
  padding: "0 18px",
  border: "2px solid #E2E8F0",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.80)",
  color: "#0F172B",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "::placeholder": {
    color: "#94A3B8",
  },
  ":focus": {
    borderColor: vars.color.accent.indigo,
    boxShadow: "0 0 0 3px rgba(97, 95, 255, 0.16)",
  },
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
});

export const cardContainer = style({
  width: "100%",
  height: "288px",
  padding: "32px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.80)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
  "@media": {
    "screen and (max-width: 768px)": {
      height: "auto",
      padding: "20px",
    },
  },
});

export const statusMessage = style({
  padding: "16px 18px",
  borderRadius: "12px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: "linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)",
  color: vars.color.blueSoft.text,
  ...vars.font.body_medium_14,
});

export const reviewSection = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  padding: "32px",
  borderRadius: "18px",
  background: "rgba(255, 255, 255, 0.86)",
  boxShadow:
    "0 20px 25px -5px rgba(15, 23, 43, 0.10), 0 8px 10px -6px rgba(15, 23, 43, 0.08)",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "20px",
      gap: "20px",
    },
  },
});

export const reviewTitle = style({
  ...vars.font.display_bold_30,
  color: "#0F172B",
  margin: 0,
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "2.2rem",
    },
  },
});

export const reviewGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 320px))",
  gap: "24px",
});

export const reviewCard = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: "18px",
  background: "#FFFFFF",
  boxShadow:
    "0 12px 18px -8px rgba(15, 23, 43, 0.22), 0 4px 8px -6px rgba(15, 23, 43, 0.18)",
});

export const reviewDeleteButton = style({
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 2,
  width: "42px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: 0,
  borderRadius: "50%",
  background: "#FF3347",
  color: "#FFFFFF",
  fontSize: "30px",
  fontWeight: 300,
  lineHeight: 1,
  boxShadow: "0 8px 18px rgba(220, 38, 38, 0.28)",
  cursor: "pointer",
  transition: "transform 0.16s ease, opacity 0.16s ease",
  ":hover": {
    transform: "scale(1.05)",
  },
  ":disabled": {
    cursor: "wait",
    opacity: 0.55,
    transform: "none",
  },
});

export const reviewImage = style({
  width: "100%",
  height: "220px",
  objectFit: "cover",
  display: "block",
  background: "#F1F5F9",
});

export const pdfPreview = style({
  width: "100%",
  height: "220px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#F1F5F9",
  color: "#475569",
  ...vars.font.head_bold_16,
});

export const reviewCardBody = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "20px",
});

export const reviewDate = style({
  ...vars.font.body_regular_16,
  color: "#64748B",
});

export const reviewMerchant = style({
  ...vars.font.title_bold_18,
  color: "#0F172B",
});

export const reviewAmount = style({
  ...vars.font.display_bold_30,
  color: vars.color.accent.indigo,
});

export const reviewCategory = style({
  ...vars.font.caption_regular_12,
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#F1F5F9",
  color: "#475569",
});

export const reviewButton = style({
  ...vars.font.head_bold_16,
  width: "100%",
  height: "48px",
  marginTop: "12px",
  border: 0,
  borderRadius: "12px",
  color: "#FFFFFF",
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  cursor: "pointer",
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.55,
  },
});

export const reviewExtractStatus = style({
  ...vars.font.caption_regular_12,
  color: "#64748B",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  flexWrap: "wrap",
});

export const reviewTitleRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
});

export const extractProgress = style({
  ...vars.font.body_medium_14,
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 14px",
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.blueSoft.bgFrom,
  color: vars.color.blueSoft.textStrong,
});

export const extractFailedSummary = style({
  ...vars.font.body_medium_14,
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 14px",
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.semantic.danger.border}`,
  background: vars.color.semantic.danger.bg,
  color: vars.color.semantic.danger.text,
});

export const retryExtractButton = style({
  ...vars.font.caption_regular_12,
  border: "none",
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  fontWeight: 700,
  padding: "2px 4px",
  textDecoration: "underline",
});

export const refundBadge = style({
  ...vars.font.caption_regular_12,
  alignSelf: "center",
  padding: "3px 10px",
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.semantic.warning.border}`,
  background: vars.color.semantic.warning.bg,
  color: vars.color.semantic.warning.text,
  fontWeight: 700,
});

export const evidenceTypeBadge = style({
  ...vars.font.caption_regular_12,
  alignSelf: "flex-start",
  padding: "2px 10px",
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.blueSoft.bgFrom,
  color: vars.color.blueSoft.textStrong,
  fontWeight: 700,
});

export const modalOverlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px",
  background: "rgba(15, 23, 42, 0.55)",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "16px",
    },
  },
});

export const modal = style({
  width: "min(960px, 100%)",
  maxHeight: "calc(100vh - 64px)",
  overflowY: "auto",
  borderRadius: "18px",
  background: "#FFFFFF",
  boxShadow:
    "0 24px 48px -16px rgba(15, 23, 42, 0.35), 0 10px 18px -12px rgba(15, 23, 42, 0.28)",
  "@media": {
    "screen and (max-width: 768px)": {
      maxHeight: "calc(100vh - 32px)",
    },
  },
});

export const modalHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "32px 32px 16px",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "20px 16px 12px",
    },
  },
});

export const modalTitle = style({
  ...vars.font.display_bold_30,
  margin: 0,
  color: "#0F172B",
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "2.2rem",
    },
  },
});

export const modalCloseButton = style({
  width: "44px",
  height: "44px",
  border: 0,
  borderRadius: "999px",
  background: "transparent",
  color: "#475569",
  fontSize: "36px",
  lineHeight: "36px",
  cursor: "pointer",
});

export const modalContent = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "32px",
  padding: "16px 32px 32px",
  "@media": {
    "(max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
    "screen and (max-width: 1024px)": {
      gridTemplateColumns: "1fr",
      gap: "24px",
    },
    "screen and (max-width: 768px)": {
      padding: "12px 16px 20px",
    },
  },
});

export const originalColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const modalSectionTitle = style({
  ...vars.font.heading_medium_20,
  margin: 0,
  color: "#0F172B",
});

export const modalImage = style({
  width: "100%",
  maxHeight: "560px",
  objectFit: "contain",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  background: "#F8FAFC",
});

export const modalPdfPreview = style({
  width: "100%",
  height: "420px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  background: "#F8FAFC",
  color: "#475569",
  ...vars.font.heading_medium_20,
});

export const formColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const formLabel = style({
  ...vars.font.heading_medium_20,
  color: "#0F172B",
  marginTop: "8px",
});

export const formInput = style({
  ...vars.font.body_regular_16,
  width: "100%",
  height: "56px",
  padding: "0 18px",
  border: 0,
  borderRadius: "12px",
  background: "#F1F5F9",
  color: "#0F172B",
  outline: "none",
  ":focus": {
    boxShadow: `0 0 0 3px rgba(97, 95, 255, 0.24)`,
  },
});

export const modalActions = style({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "16px",
  marginTop: "28px",
  "@media": {
    "screen and (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "10px",
      marginTop: "20px",
    },
  },
});

export const saveButton = style({
  ...vars.font.title_bold_18,
  height: "56px",
  border: 0,
  borderRadius: "12px",
  color: "#FFFFFF",
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  cursor: "pointer",
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.65,
  },
});

export const cancelButton = style({
  ...vars.font.title_bold_18,
  height: "56px",
  border: "2px solid #E2E8F0",
  borderRadius: "12px",
  color: "#0F172B",
  background: "#FFFFFF",
  cursor: "pointer",
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.65,
  },
});
