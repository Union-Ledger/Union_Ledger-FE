import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const page = style({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  background:
    "linear-gradient(135deg, #4F39F6 0%, #B30FFF 52%, #1F6FFF 100%)",
});

export const signupPage = style([
  page,
  {
    minHeight: "100dvh",
    height: "100dvh",
    overflowY: "auto",
    alignItems: "flex-start",
    padding: "72px 20px 96px",
    backgroundAttachment: "fixed",
    "@media": {
      "screen and (max-width: 760px)": {
        padding: "32px 14px 64px",
      },
    },
  },
]);

export const card = style({
  width: "min(100%, 520px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "32px 28px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 24px 70px rgba(31, 27, 90, 0.34)",
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "28px 22px",
    },
    "screen and (max-width: 480px)": {
      padding: "24px 16px",
    },
  },
});

export const signupCard = style([
  card,
  {
    width: "min(100%, 900px)",
    padding: "48px 52px 56px",
    "@media": {
      "screen and (max-width: 760px)": {
        padding: "32px 22px",
      },
    },
  },
]);

export const logo = style({
  width: "72px",
  height: "72px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #4F39F6 0%, #B30FFF 100%)",
  boxShadow: "0 12px 18px rgba(49, 44, 133, 0.28)",
  color: vars.color.surface,
  fontSize: "2.8rem",
  fontWeight: 800,
  lineHeight: 1,
});

export const documentIcon = style([
  logo,
  {
    position: "relative",
    fontSize: 0,
    "::before": {
      content: '""',
      width: "28px",
      height: "36px",
      border: "4px solid rgba(255, 255, 255, 0.92)",
      borderRadius: "5px",
    },
    "::after": {
      content: '""',
      position: "absolute",
      width: "16px",
      height: "4px",
      borderRadius: "999px",
      background: "rgba(255, 255, 255, 0.92)",
      boxShadow: "0 10px 0 rgba(255, 255, 255, 0.92)",
    },
  },
]);

export const brandTitle = style({
  ...vars.font.display_bold_30,
  marginTop: "24px",
  color: vars.color.primary,
  textAlign: "center",
});

export const signupTitle = style({
  fontSize: "4.2rem",
  fontWeight: 800,
  lineHeight: "1.2",
  marginTop: "28px",
  color: vars.color.primary,
  textAlign: "center",
});

export const subtitle = style({
  ...vars.font.body_regular_16,
  marginTop: "4px",
  color: "#6B7280",
  textAlign: "center",
});

export const form = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  marginTop: "28px",
});

export const field = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const label = style({
  ...vars.font.body_medium_14,
  color: "#111827",
  fontWeight: 700,
});

export const passwordLabelRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
});

export const forgotPasswordLink = style({
  border: "none",
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  fontSize: "1.3rem",
  fontWeight: 700,
});

export const input = style({
  ...vars.font.body_regular_16,
  width: "100%",
  height: "54px",
  padding: "0 16px",
  border: "none",
  borderRadius: "8px",
  background: "#F3F4F6",
  color: "#111827",
  outline: "none",
  "::placeholder": {
    color: "#8A8F98",
  },
  ":focus": {
    boxShadow: "0 0 0 3px rgba(79, 57, 246, 0.18)",
  },
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.65,
  },
});

export const primaryButton = style({
  ...vars.font.body_medium_14,
  width: "100%",
  height: "54px",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(90deg, #4F39F6 0%, #B30FFF 100%)",
  color: vars.color.surface,
  cursor: "pointer",
  boxShadow: "0 12px 18px rgba(79, 57, 246, 0.22)",
  fontWeight: 700,
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.42,
  },
});

export const secondaryButton = style({
  ...vars.font.body_medium_14,
  height: "54px",
  border: `1px solid ${vars.color.ItemBorder}`,
  borderRadius: "8px",
  background: vars.color.surface,
  color: "#111827",
  cursor: "pointer",
  fontWeight: 700,
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.52,
  },
});

export const linkText = style({
  ...vars.font.body_regular_14,
  marginTop: "22px",
  color: "#4B5563",
  textAlign: "center",
});

export const linkButton = style({
  marginLeft: "2px",
  border: "none",
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  font: "inherit",
  fontWeight: 800,
});

export const errorText = style({
  ...vars.font.body_regular_14,
  color: vars.color.accent.red,
  textAlign: "center",
});

export const inputShell = style({
  position: "relative",
  width: "100%",
});

export const inputWithToggle = style({
  paddingRight: "52px",
});

export const visibilityButton = style({
  position: "absolute",
  right: "8px",
  top: "50%",
  width: "42px",
  height: "42px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: "50%",
  background: "transparent",
  color: "#94A3B8",
  cursor: "pointer",
  transform: "translateY(-50%)",
});

export const fieldErrorText = style({
  ...vars.font.caption_regular_12,
  color: vars.color.semantic.danger.strong,
  textAlign: "left",
});

export const capsLockHint = style({
  ...vars.font.caption_regular_12,
  color: vars.color.semantic.warning.text,
  textAlign: "left",
});

export const infoText = style({
  ...vars.font.body_regular_14,
  width: "100%",
  marginTop: vars.space.lg,
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderRadius: vars.radius.md,
  background: vars.color.semantic.info.bg,
  border: `1px solid ${vars.color.semantic.info.border}`,
  color: vars.color.semantic.info.text,
  textAlign: "center",
});

export const stepper = style({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  marginTop: "42px",
  "@media": {
    "screen and (max-width: 760px)": {
      gap: "8px",
    },
  },
});

export const stepItem = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

export const stepCircle = style({
  width: "52px",
  height: "52px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  fontSize: "2rem",
  fontWeight: 800,
});

export const stepCircleVariant = styleVariants({
  active: {
    background: "linear-gradient(135deg, #4F39F6 0%, #B30FFF 100%)",
    color: vars.color.surface,
  },
  done: {
    background: vars.color.accent.green,
    color: vars.color.surface,
  },
  pending: {
    background: "#E6EDF4",
    color: "#64748B",
  },
});

export const stepLabel = style({
  fontSize: "1.8rem",
  fontWeight: 800,
  color: "#111827",
  "@media": {
    "screen and (max-width: 760px)": {
      display: "none",
    },
  },
});

export const stepLabelMuted = style({
  color: "#94A3B8",
});

export const stepLine = style({
  width: "62px",
  height: "3px",
  borderRadius: "999px",
  background: "#E5E7EB",
  "@media": {
    "screen and (max-width: 760px)": {
      width: "34px",
    },
  },
});

export const stepLineDone = style({
  background: vars.color.accent.green,
});

export const signupForm = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  marginTop: "40px",
});

export const emailRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 170px",
  gap: "16px",
  "@media": {
    "screen and (max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const helperText = style({
  ...vars.font.body_regular_14,
  color: "#6B7280",
});

export const successBox = style({
  ...vars.font.body_regular_16,
  width: "100%",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #BBF7D0",
  background: "#F0FDF4",
  color: "#047857",
  lineHeight: "1.8",
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  "@media": {
    "screen and (max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const fullWidth = style({
  gridColumn: "1 / -1",
});

export const actionRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginTop: "12px",
  "@media": {
    "screen and (max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const toast = style({
  position: "fixed",
  right: "32px",
  bottom: "32px",
  width: "360px",
  padding: "22px 24px",
  borderRadius: "10px",
  background: vars.color.surface,
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.22)",
  color: "#111827",
  zIndex: 10,
});

export const toastTitle = style({
  ...vars.font.title_bold_16,
});

export const toastDesc = style({
  ...vars.font.body_regular_14,
  marginTop: "4px",
  color: "#94A3B8",
});

export const modalOverlay = style({
  position: "fixed",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
  background: "rgba(15, 23, 42, 0.48)",
  zIndex: 20,
});

export const modal = style({
  width: "min(100%, 620px)",
  padding: "40px 34px 34px",
  borderRadius: "14px",
  background: vars.color.surface,
  boxShadow: "0 28px 60px rgba(15, 23, 42, 0.36)",
  position: "relative",
  textAlign: "center",
});

export const modalClose = style({
  position: "absolute",
  top: "18px",
  right: "22px",
  border: "none",
  background: "transparent",
  fontSize: "2.4rem",
  color: "#4B5563",
  cursor: "pointer",
});

export const modalIcon = style({
  width: "84px",
  height: "84px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  margin: "0 auto 28px",
  background: "#FEF3C7",
  color: "#EA580C",
  fontSize: "4rem",
});

export const modalTitle = style({
  fontSize: "2.8rem",
  fontWeight: 800,
  color: "#111827",
});

export const modalText = style({
  ...vars.font.body_regular_16,
  marginTop: "22px",
  color: "#6B7280",
  lineHeight: "1.7",
});

export const modalNote = style({
  ...vars.font.body_regular_16,
  marginTop: "26px",
  padding: "20px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: "#F8FAFC",
  color: "#475569",
});

export const modalAction = style({
  marginTop: "24px",
});
