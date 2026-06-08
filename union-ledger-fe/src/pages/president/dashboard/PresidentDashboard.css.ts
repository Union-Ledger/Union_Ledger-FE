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
});

export const desc = style({
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "24px",
});

export const statCard = style({
  padding: "22px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 16px 20px -6px rgba(0, 0, 0, 0.12), 0 6px 8px -6px rgba(0, 0, 0, 0.12)",
});

export const statIcon = recipe({
  base: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    color: vars.color.surface,
    marginBottom: "14px",
    fontSize: "1.8rem",
  },
  variants: {
    color: {
      blue: { background: vars.color.accent.blue },
      pink: { background: vars.color.accent.pink },
      green: { background: vars.color.accent.green },
      orange: { background: vars.color.accent.orange },
    },
  },
});

export const statLabel = style({
  display: "block",
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const statValue = style({
  display: "block",
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
  marginTop: "4px",
});

export const panel = style({
  padding: "28px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const sectionTitle = style({
  margin: 0,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const reportList = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "22px",
});

export const reportItem = style({
  padding: "22px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.blueSoft.border}`,
  background: vars.color.blueSoft.bgFrom,
});

export const reportHeader = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
});

export const memberName = style({
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
});

export const memberEmail = style({
  margin: "4px 0 0",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const statusBadge = style({
  display: "inline-flex",
  marginLeft: "8px",
  padding: "3px 8px",
  borderRadius: "999px",
  background: vars.color.accent.indigo,
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
  fontWeight: "700",
});

export const semesterBox = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const progressMeta = style({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "18px",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const progressTrack = style({
  height: "7px",
  borderRadius: "999px",
  background: "#DBEAFE",
  overflow: "hidden",
  marginTop: "7px",
});

export const progressBar = style({
  height: "100%",
  borderRadius: "999px",
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
});

export const reportStats = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "14px",
  marginTop: "16px",
  paddingTop: "14px",
  borderTop: `1px solid ${vars.color.blueSoft.border}`,
});

export const reportStatLabel = style({
  display: "block",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const reportStatValue = style({
  display: "block",
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
  marginTop: "2px",
});

export const reportFooter = style({
  margin: "14px 0 0",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const auditList = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "22px",
});

export const auditItem = style({
  padding: "22px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.mint.border}`,
  background: vars.color.mint.bgFrom,
});

export const auditHeader = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const auditStats = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "14px",
  marginTop: "16px",
});

export const auditStatItem = style({
  padding: "14px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.mint.border}`,
  background: vars.color.surface,
  textAlign: "center",
});

export const auditStatLabel = style({
  display: "block",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
});

export const auditStatValue = style({
  display: "block",
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
  marginTop: "5px",
});

export const successText = style({ color: `${vars.color.accent.green} !important` });
export const warningText = style({ color: `${vars.color.accent.orange} !important` });
export const primaryText = style({ color: `${vars.color.primary} !important` });

export const bottomGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "28px",
});

export const teamHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px",
});

export const inviteButton = style({
  height: "34px",
  padding: "0 14px",
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
  gap: "10px",
});

export const memberItem = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  padding: "14px",
  borderRadius: "8px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
});

export const roleBadge = style({
  padding: "3px 8px",
  borderRadius: "999px",
  background: "#F3E8FF",
  color: vars.color.accent.purple,
  ...vars.font.caption_regular_12,
  fontWeight: "700",
});

export const orgInfoList = style({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginTop: "18px",
});

export const orgInfoItem = style({
  padding: "18px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.subtitle}`,
  background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)",
});

export const orgInfoLabel = style({
  display: "block",
  ...vars.font.caption_regular_12,
  color: vars.color.description,
  marginBottom: "6px",
});

export const orgInfoValue = style({
  ...vars.font.title_bold_14,
  color: vars.color.summaryTitle,
});
