import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const panel = style({
  padding: "38px",
  borderRadius: "8px",
  background: vars.color.surface,
  boxShadow: "0 12px 28px rgba(15, 23, 43, 0.08)",
  "@media": {
    "screen and (max-width: 700px)": {
      padding: "24px",
    },
  },
});

export const sectionTitle = style({
  margin: 0,
  ...vars.font.title_bold_24,
  color: vars.color.foreground,
});

export const compactSectionTitle = style({
  margin: 0,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.foreground,
});

export const sectionDescription = style({
  margin: "14px 0 0",
  ...vars.font.body_regular_16,
  color: "#5B7193",
});

export const emptyState = style({
  marginTop: "28px",
  padding: "32px",
  border: `1px solid ${vars.color.ItemBorder}`,
  borderRadius: "8px",
  textAlign: "center",
  color: vars.color.description,
  ...vars.font.body_regular_16,
});

export const compactEmptyState = style({
  padding: "24px 0",
  textAlign: "center",
  color: vars.color.description,
  ...vars.font.body_regular_14,
});

export const reportList = style({
  display: "flex",
  flexDirection: "column",
  gap: "26px",
  marginTop: "36px",
});

export const reportItem = style({
  padding: "34px 40px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: "#EEF4FF",
  "@media": {
    "screen and (max-width: 700px)": {
      padding: "26px 22px",
    },
  },
});

export const reportTitleRow = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "14px",
});

export const reportTitle = style({
  margin: 0,
  fontSize: "2.2rem",
  lineHeight: "1.35",
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const statusBadge = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "8px",
    color: vars.color.surface,
    ...vars.font.body_medium_14,
    fontWeight: "700",
  },
  variants: {
    tone: {
      complete: { background: vars.color.accent.green },
      submitted: { background: vars.color.accent.blue },
      progress: { background: "#FF9500" },
    },
  },
});

export const semesterLabel = style({
  margin: "14px 0 0",
  ...vars.font.body_regular_16,
  color: "#405574",
});

export const progressMeta = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "26px",
  ...vars.font.body_regular_16,
  color: "#405574",
});

export const progressValue = style({
  color: vars.color.primary,
  fontWeight: "700",
});

export const progressTrack = style({
  height: "10px",
  marginTop: "12px",
  overflow: "hidden",
  borderRadius: "999px",
  background: "#E9EEF6",
});

export const progressBar = style({
  height: "100%",
  borderRadius: "999px",
  background: `linear-gradient(90deg, ${vars.color.gradient.violetFrom}, ${vars.color.gradient.violetTo})`,
});

export const reportStats = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "28px",
  marginTop: "28px",
  "@media": {
    "screen and (max-width: 650px)": {
      gridTemplateColumns: "1fr",
      gap: "18px",
    },
  },
});

export const reportStatLabel = style({
  display: "block",
  ...vars.font.body_regular_16,
  color: "#405574",
});

export const reportStatValue = style({
  display: "block",
  marginTop: "5px",
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const reportFooter = style({
  margin: "24px 0 0",
  paddingTop: "20px",
  borderTop: `1px solid ${vars.color.blueSoft.border}`,
  ...vars.font.body_regular_14,
  color: "#405574",
});

export const publishButton = style({
  width: "100%",
  height: "52px",
  marginTop: "20px",
  border: "none",
  borderRadius: "8px",
  background: `linear-gradient(90deg, ${vars.color.gradient.violetFrom}, ${vars.color.gradient.violetTo})`,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  fontWeight: "700",

  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
});

export const auditTitleRow = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
});

export const estimateBadge = style({
  padding: "5px 10px",
  borderRadius: "8px",
  background: "#EEF0F4",
  ...vars.font.body_medium_14,
  color: vars.color.foreground,
  fontWeight: "700",
});

export const auditList = style({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  marginTop: "34px",
});

export const auditItem = style({
  padding: "32px 40px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.mint.border}`,
  background: "#EEFFF5",
  "@media": {
    "screen and (max-width: 700px)": {
      padding: "26px 22px",
    },
  },
});

export const auditHeader = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  "@media": {
    "screen and (max-width: 560px)": {
      flexDirection: "column",
    },
  },
});

export const memberName = style({
  margin: 0,
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const memberEmail = style({
  margin: "7px 0 0",
  ...vars.font.body_regular_16,
  color: "#405574",
});

export const recentActivity = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  ...vars.font.body_regular_14,
  color: "#405574",
  "@media": {
    "screen and (max-width: 560px)": {
      alignItems: "flex-start",
    },
  },
});

export const recentActivityValue = style({
  marginTop: "4px",
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const auditStats = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "24px",
  marginTop: "28px",
  "@media": {
    "screen and (max-width: 650px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const auditStatItem = style({
  minHeight: "132px",
  padding: "26px 30px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.mint.border}`,
  background: vars.color.surface,
});

export const auditStatLabel = style({
  display: "block",
  ...vars.font.body_regular_16,
  color: "#405574",
});

export const auditCompletedValue = style({
  display: "block",
  marginTop: "12px",
  fontSize: "2.8rem",
  lineHeight: "1.2",
  fontWeight: "700",
  color: "#00A63E",
});

export const auditDaysValue = style({
  display: "block",
  marginTop: "12px",
  fontSize: "2.8rem",
  lineHeight: "1.2",
  fontWeight: "700",
  color: "#155DFC",
});

export const teamHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "22px",
});

export const inviteButton = style({
  minHeight: "40px",
  padding: "0 18px",
  border: "none",
  borderRadius: "8px",
  background: vars.color.primary,
  color: vars.color.surface,
  cursor: "pointer",
  ...vars.font.body_medium_14,
});

export const memberList = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const memberItem = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  padding: "16px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
});

export const compactMemberName = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
});

export const compactMemberEmail = style({
  margin: "3px 0 0",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const roleBadge = style({
  flexShrink: 0,
  padding: "4px 9px",
  borderRadius: "8px",
  background: "#F3E8FF",
  color: vars.color.accent.purple,
  ...vars.font.caption_regular_12,
  fontWeight: "700",
});

export const orgInfoList = style({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginTop: "22px",
});

export const orgInfoItem = style({
  padding: "18px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.subtitle}`,
  background: "#F7F5FF",
});

export const orgInfoLabel = style({
  display: "block",
  marginBottom: "6px",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const orgInfoValue = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
});
