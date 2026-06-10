import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  padding: "32px",
  background: "#F8FAFC",
});

export const titleGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const title = style({
  ...vars.font.display_bold_30,
  color: "#0F172A",
});

export const description = style({
  ...vars.font.body_regular_16,
  color: "#475569",
});

export const filterPanel = style({
  display: "flex",
  alignItems: "center",
  gap: "18px",
  width: "100%",
  padding: "22px 24px",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  background: "#FFFFFF",
});

export const filterIcon = style({
  width: "20px",
  height: "20px",
  flexShrink: 0,
});

export const filterControl = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const label = style({
  ...vars.font.body_medium_14,
  color: "#334155",
});

export const select = style({
  width: "300px",
  height: "44px",
  border: "1px solid #EEF2F7",
  borderRadius: "8px",
  background: "#F1F3F7",
  padding: "0 16px",
  color: "#0F172A",
  fontFamily: vars.font.body,
  fontSize: "1.4rem",
  fontWeight: 600,
  outline: "none",
});

export const cardGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(280px, 1fr))",
  gap: "24px",
  width: "100%",
  maxWidth: "900px",
  "@media": {
    "(max-width: 920px)": {
      gridTemplateColumns: "1fr",
      maxWidth: "100%",
    },
  },
});

export const stateMessage = style({
  ...vars.font.body_medium_14,
  width: "100%",
  maxWidth: "900px",
  padding: "18px 20px",
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  background: "#FFFFFF",
  color: "#475569",
});

export const errorMessage = style([
  stateMessage,
  {
    borderColor: "#FECACA",
    background: "#FEF2F2",
    color: "#B91C1C",
  },
]);

export const card = style({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  padding: "24px",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  background: "#FFFFFF",
  boxShadow: "0 10px 22px rgba(15, 23, 42, 0.04)",
});

export const cardHeader = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
});

export const cardTitleGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const cardTitle = style({
  ...vars.font.title_bold_18,
  color: "#0F172A",
});

export const semester = style({
  ...vars.font.caption_regular_12,
  color: "#475569",
});

export const approvedBadge = style({
  ...vars.font.caption_regular_12,
  padding: "4px 10px",
  borderRadius: "999px",
  background: "#DCFCE7",
  color: "#15803D",
  fontWeight: 700,
  whiteSpace: "nowrap",
});

export const statGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
});

export const amountBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "16px",
  borderRadius: "10px",
  background: "#EFF6FF",
});

export const countBox = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "16px",
  borderRadius: "10px",
  background: "#FAF5FF",
});

export const statLabel = style({
  ...vars.font.caption_regular_12,
  fontWeight: 700,
});

export const amountLabel = style({
  color: "#2563EB",
});

export const countLabel = style({
  color: "#9333EA",
});

export const statValue = style({
  fontSize: "2rem",
  lineHeight: "1.2",
  fontWeight: 800,
  color: "#172554",
  letterSpacing: "0",
});

export const cardMeta = style({
  display: "flex",
  alignItems: "center",
  gap: "7px",
  ...vars.font.caption_regular_12,
  color: "#475569",
});

export const metaIcon = style({
  width: "14px",
  height: "14px",
});

export const actionRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 44px",
  gap: "10px",
});

export const detailButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  height: "42px",
  border: "0",
  borderRadius: "8px",
  background: "#020617",
  color: "#FFFFFF",
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: "1.4rem",
  fontWeight: 700,
});

export const buttonIcon = style({
  width: "16px",
  height: "16px",
  filter: "brightness(0) invert(1)",
});

export const downloadButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "42px",
  border: "1px solid #E2E8F0",
  borderRadius: "8px",
  background: "#FFFFFF",
  color: "#0F172A",
  cursor: "pointer",
  fontSize: "1.8rem",
  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.45,
    },
  },
});

export const infoBanner = style({
  display: "grid",
  gridTemplateColumns: "44px 1fr",
  gap: "16px",
  alignItems: "center",
  width: "100%",
  maxWidth: "900px",
  padding: "18px 22px",
  border: "1px solid #BFDBFE",
  borderRadius: "12px",
  background: "#EFF6FF",
});

export const infoIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "44px",
  borderRadius: "10px",
  background: "#2563EB",
  color: "#FFFFFF",
  fontSize: "2rem",
  fontWeight: 800,
});

export const infoTitle = style({
  ...vars.font.body_medium_14,
  color: "#1E40AF",
  fontWeight: 800,
});

export const infoText = style({
  ...vars.font.caption_regular_12,
  color: "#1D4ED8",
  marginTop: "4px",
});

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px",
  background: "rgba(15, 23, 42, 0.55)",
});

export const modal = style({
  width: "min(760px, 100%)",
  maxHeight: "calc(100vh - 64px)",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  padding: "34px 36px 32px",
  borderRadius: "12px",
  background: "#FFFFFF",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.25)",
});

export const modalHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
});

export const modalTitle = style({
  ...vars.font.title_bold_24,
  color: "#0F172A",
});

export const closeButton = style({
  width: "36px",
  height: "36px",
  border: "0",
  borderRadius: "8px",
  background: "#F8FAFC",
  color: "#334155",
  cursor: "pointer",
  fontSize: "2rem",
});

export const categoryList = style({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
});

export const categoryRow = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const categoryMeta = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  color: "#0F172A",
  fontSize: "1.8rem",
  fontWeight: 800,
  letterSpacing: "0",
});

export const categoryAmount = style({
  color: "#475569",
  fontWeight: 500,
});

export const progressTrack = style({
  width: "100%",
  height: "10px",
  borderRadius: "999px",
  background: "#F1F5F9",
  overflow: "hidden",
});

export const progressBar = style({
  height: "100%",
  borderRadius: "999px",
  background: "#2563EB",
});

export const sectionTitle = style({
  ...vars.font.title_bold_24,
  color: "#0F172A",
});

export const tableToolbar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "12px",
});

export const tableSearchInput = style({
  ...vars.font.body_regular_14,
  width: "min(24rem, 100%)",
  height: "38px",
  padding: "0 14px",
  border: "1px solid #E2E8F0",
  borderRadius: vars.radius.md,
  background: "#F8FAFC",
  color: "#0F172A",
  outline: "none",
  ":focus": {
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
    background: vars.color.surface,
  },
  "::placeholder": {
    color: "#94A3B8",
  },
});

export const pagination = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginTop: "14px",
});

export const pageButton = style({
  ...vars.font.body_medium_14,
  minWidth: "64px",
  height: "34px",
  padding: "0 14px",
  border: "1px solid #E2E8F0",
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  color: "#0F172A",
  cursor: "pointer",
  fontWeight: 700,
  ":hover": {
    background: "#F8FAFC",
  },
  ":disabled": {
    opacity: 0.4,
    cursor: "not-allowed",
  },
});

export const pageInfo = style({
  ...vars.font.body_medium_14,
  color: "#475569",
  fontVariantNumeric: "tabular-nums",
});

export const tableWrap = style({
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  overflow: "hidden",
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
});

export const tableHeader = style({
  background: "#F8FAFC",
});

export const tableCell = style({
  padding: "16px",
  borderBottom: "1px solid #E2E8F0",
  textAlign: "left",
  color: "#334155",
  fontSize: "1.5rem",
});

export const tableHeadCell = style([
  tableCell,
  {
    color: "#475569",
    fontWeight: 800,
  },
]);

export const tableAmount = style({
  color: "#0F172A",
  fontWeight: 800,
  textAlign: "right",
});

export const categoryChip = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 10px",
  borderRadius: "999px",
  background: "#F1F5F9",
  color: "#0F172A",
  fontSize: "1.3rem",
  fontWeight: 800,
  whiteSpace: "nowrap",
});

export const evidenceButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "58px",
  height: "30px",
  border: "1px solid #E2E8F0",
  borderRadius: "8px",
  background: "#FFFFFF",
  color: "#0F172A",
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: "1.3rem",
  fontWeight: 800,
  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.45,
    },
  },
});

export const modalActions = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px",
  paddingTop: "8px",
  borderTop: "1px solid #E2E8F0",
});

export const outlineButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  height: "50px",
  border: "1px solid #E2E8F0",
  borderRadius: "10px",
  background: "#FFFFFF",
  color: "#0F172A",
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: "1.5rem",
  fontWeight: 800,
  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.55,
    },
  },
});
