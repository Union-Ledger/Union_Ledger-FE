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

export const typeSelectorContainer = style({
  width: "100%",
  height: "88px",
  display: "flex",
  gap: "16px",
});

export const typeCard = style({
  display: "flex",
  flexDirection: "column",
  flex: "1",
  gap: "4px",
  padding: "22px",
  borderRadius: "14px",
});

export const typeCardSelected = style({
  border: `2px solid ${vars.color.accent.indigo}`,
  background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)",
  boxShadow:
    "0 10px 15px -3px rgba(97, 95, 255, 0.20), 0 4px 6px -4px rgba(97, 95, 255, 0.20)",
});

export const typeCardDefault = style({
  border: "2px solid #E2E8F0",
  background: "rgba(255, 255, 255, 0.80)",
});

export const typeCardTitle = style({
  ...vars.font.head_bold_16,
  color: "#0F172B",
  width: "100%",
  textAlign: "start",
});

export const typeCardDesc = style({
  ...vars.font.caption_regular_12,
  color: vars.color.gray,
  width: "100%",
  textAlign: "start",
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
});

export const reviewTitle = style({
  ...vars.font.display_bold_30,
  color: "#0F172B",
  margin: 0,
});

export const reviewGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 320px))",
  gap: "24px",
});

export const reviewCard = style({
  overflow: "hidden",
  borderRadius: "18px",
  background: "#FFFFFF",
  boxShadow:
    "0 12px 18px -8px rgba(15, 23, 43, 0.22), 0 4px 8px -6px rgba(15, 23, 43, 0.18)",
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
  textAlign: "center",
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
});

export const modal = style({
  width: "min(960px, 100%)",
  maxHeight: "calc(100vh - 64px)",
  overflowY: "auto",
  borderRadius: "18px",
  background: "#FFFFFF",
  boxShadow:
    "0 24px 48px -16px rgba(15, 23, 42, 0.35), 0 10px 18px -12px rgba(15, 23, 42, 0.28)",
});

export const modalHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "32px 32px 16px",
});

export const modalTitle = style({
  ...vars.font.display_bold_30,
  margin: 0,
  color: "#0F172B",
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
