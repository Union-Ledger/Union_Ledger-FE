import { keyframes, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const pop = keyframes({
  "0%": { opacity: 0, transform: "translateY(10px) scale(0.98)" },
  "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
});

export const page = style({
  width: "100%",
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  overflowY: "auto",
  background:
    "linear-gradient(135deg, #4F39F6 0%, #B30FFF 52%, #1F6FFF 100%)",
  "@media": {
    "screen and (max-width: 640px)": {
      alignItems: "flex-start",
      padding: "24px 14px 48px",
    },
  },
});

export const card = style({
  width: "min(100%, 560px)",
  minHeight: "620px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "44px 38px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 26px 70px rgba(31, 27, 90, 0.34)",
  animation: `${pop} 220ms ease-out`,
  "@media": {
    "screen and (max-width: 640px)": {
      minHeight: "calc(100dvh - 72px)",
      padding: "34px 22px",
    },
  },
});

export const logo = style({
  width: "72px",
  height: "72px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #4F39F6 0%, #B30FFF 100%)",
  boxShadow: "0 12px 18px rgba(49, 44, 133, 0.28)",
  color: vars.color.surface,
  fontSize: "2.8rem",
  fontWeight: 800,
  lineHeight: 1,
});

export const title = style({
  marginTop: "28px",
  color: vars.color.primary,
  fontSize: "3.2rem",
  fontWeight: 800,
  textAlign: "center",
});

export const subtitle = style({
  marginTop: "10px",
  color: "#6B7280",
  fontSize: "1.6rem",
  lineHeight: 1.55,
  textAlign: "center",
});

export const stepper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "42px",
});

export const stepCircle = style({
  width: "42px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  fontSize: "1.6rem",
  fontWeight: 800,
});

export const stepCircleVariant = styleVariants({
  active: {
    background: "linear-gradient(135deg, #4F39F6 0%, #B30FFF 100%)",
    color: "#FFFFFF",
    boxShadow: "0 7px 14px rgba(79, 57, 246, 0.25)",
  },
  done: {
    background: "#13C483",
    color: "#FFFFFF",
  },
  pending: {
    background: "#E6EDF4",
    color: "#94A3B8",
  },
});

export const stepLine = style({
  width: "48px",
  height: "3px",
  margin: "0 8px",
  borderRadius: "999px",
  background: "#E2E8F0",
});

export const stepLineDone = style({
  background: "#13C483",
});

export const form = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  marginTop: "52px",
});

export const label = style({
  display: "flex",
  flexDirection: "column",
  gap: "9px",
  color: "#111827",
  fontSize: "1.6rem",
  fontWeight: 700,
});

export const inputShell = style({
  position: "relative",
  width: "100%",
});

export const inputIcon = style({
  position: "absolute",
  left: "16px",
  top: "50%",
  color: "#94A3B8",
  fontSize: "2rem",
  transform: "translateY(-50%)",
  pointerEvents: "none",
});

export const input = style({
  width: "100%",
  height: "58px",
  padding: "0 48px",
  border: "1px solid transparent",
  borderRadius: "8px",
  outline: "none",
  background: "#F3F4F6",
  color: "#111827",
  fontSize: "1.6rem",
  ":focus": {
    borderColor: "#8068FA",
    boxShadow: "0 0 0 3px rgba(79, 57, 246, 0.12)",
  },
  "::placeholder": {
    color: "#8A8F98",
  },
});

export const invalidInput = style({
  borderColor: "#FF5A63",
  ":focus": {
    borderColor: "#FF5A63",
    boxShadow: "0 0 0 3px rgba(255, 90, 99, 0.12)",
  },
});

export const visibilityButton = style({
  position: "absolute",
  right: "8px",
  top: "50%",
  width: "42px",
  height: "42px",
  border: "none",
  borderRadius: "50%",
  background: "transparent",
  color: "#94A3B8",
  cursor: "pointer",
  fontSize: "1.8rem",
  transform: "translateY(-50%)",
});

export const primaryButton = style({
  width: "100%",
  height: "56px",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(90deg, #4F39F6 0%, #B30FFF 100%)",
  boxShadow: "0 12px 18px rgba(79, 57, 246, 0.22)",
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: "1.6rem",
  fontWeight: 800,
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.42,
  },
});

export const textButton = style({
  alignSelf: "center",
  border: "none",
  background: "transparent",
  color: "#64748B",
  cursor: "pointer",
  fontSize: "1.5rem",
  fontWeight: 700,
});

export const otpLabel = style({
  color: "#111827",
  fontSize: "1.6rem",
  fontWeight: 700,
});

export const otpRow = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gap: "10px",
});

export const otpInput = style({
  width: "100%",
  aspectRatio: "0.82",
  minHeight: "62px",
  border: "2px solid #D8E0E8",
  borderRadius: "10px",
  outline: "none",
  background: "#FFFFFF",
  color: "#4F39F6",
  fontSize: "2.2rem",
  fontWeight: 800,
  textAlign: "center",
  ":focus": {
    borderColor: "#5C55EA",
    boxShadow: "0 0 0 3px rgba(79, 57, 246, 0.1)",
  },
});

export const resendRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  color: "#6B7280",
  fontSize: "1.4rem",
});

export const resendButton = style({
  border: "none",
  background: "transparent",
  color: vars.color.primary,
  cursor: "pointer",
  fontSize: "1.5rem",
  fontWeight: 800,
  ":disabled": {
    color: "#94A3B8",
    cursor: "not-allowed",
  },
});

export const strengthBars = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "5px",
  marginTop: "-10px",
});

export const strengthBar = style({
  height: "5px",
  borderRadius: "999px",
  background: "#E2E8F0",
});

export const strengthBarVariant = styleVariants({
  weak: { background: "#FF5A63" },
  medium: { background: "#FBBF24" },
  strong: { background: "#10B981" },
});

export const strengthText = style({
  marginTop: "-12px",
  color: "#6B7280",
  fontSize: "1.3rem",
});

export const weakText = style({ color: "#EF4444", fontWeight: 800 });
export const mediumText = style({ color: "#D97706", fontWeight: 800 });
export const strongText = style({ color: "#059669", fontWeight: 800 });

export const errorText = style({
  marginTop: "-10px",
  color: "#EF4444",
  fontSize: "1.3rem",
});

export const capsLockHint = style({
  marginTop: "-10px",
  color: "#B45309",
  fontSize: "1.3rem",
});

export const completeContent = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "68px",
});

export const completeIcon = style({
  width: "84px",
  height: "84px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "#D1FAE5",
  color: "#10B981",
  fontSize: "4rem",
  fontWeight: 800,
});

export const completeTitle = style({
  marginTop: "26px",
  color: "#111827",
  fontSize: "2rem",
  fontWeight: 800,
});

export const completeDescription = style({
  marginTop: "8px",
  color: "#6B7280",
  fontSize: "1.5rem",
});

export const completeButton = style({
  marginTop: "30px",
});
