import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

export const container = style({
  minHeight: "100vh",
  padding: "48px 56px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  background: "linear-gradient(135deg, #F8FAFC 0%, #FAF5FF 50%, #EFF6FF 100%)",
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const title = style({
  margin: 0,
  ...vars.font.display_bold_30,
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const description = style({
  margin: 0,
  ...vars.font.body_regular_16,
  color: vars.color.gray,
});

export const panel = style({
  padding: "32px",
  borderRadius: "14px",
  background: vars.color.white95,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
});

export const sectionHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "28px",
});

export const sectionTitle = style({
  margin: 0,
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const countBadge = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "44px",
  height: "28px",
  borderRadius: "999px",
  border: "1px solid #FDBA74",
  background: "#FFF7ED",
  color: "#C2410C",
  ...vars.font.body_medium_14,
  fontWeight: "700",
});

export const applicationList = style({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const pendingCard = style({
  padding: "28px",
  borderRadius: "10px",
  border: "1px solid #FCD34D",
  background: "#FFFBEB",
});

export const cardTop = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "20px",
});

export const nameRow = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

export const applicantName = style({
  ...vars.font.title_bold_18,
  color: vars.color.summaryTitle,
});

export const pendingBadge = style({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "999px",
  background: "#F59E0B",
  color: vars.color.surface,
  ...vars.font.caption_regular_12,
  fontWeight: "700",
});

export const email = style({
  margin: "8px 0 0",
  ...vars.font.body_regular_16,
  color: vars.color.description,
});

export const appliedAt = style({
  whiteSpace: "nowrap",
  ...vars.font.body_regular_16,
  color: vars.color.description,
});

export const metaGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "28px",
  marginBottom: "24px",
});

export const organizationBlock = style({
  marginBottom: "24px",
});

export const metaLabel = style({
  marginBottom: "4px",
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const metaValue = style({
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
});

export const organizationName = style({
  ...vars.font.heading_medium_20,
  fontWeight: "700",
  color: vars.color.summaryTitle,
});

export const documentRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
});

export const documentList = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "8px",
});

export const documentName = style({
  ...vars.font.body_regular_16,
  color: vars.color.description,
});

export const downloadButton = style({
  border: "none",
  background: vars.color.transparent,
  color: vars.color.summaryTitle,
  cursor: "pointer",
  ...vars.font.body_medium_14,
  fontWeight: "700",

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const documentEmpty = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const actionRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "20px",
});

const actionButtonBase = {
  height: "44px",
  borderRadius: "8px",
  cursor: "pointer",
  ...vars.font.body_medium_14,
  fontWeight: "700",
};

export const approveButton = style({
  ...actionButtonBase,
  border: "none",
  background: `linear-gradient(90deg, ${vars.color.gradient.greenFrom} 0%, ${vars.color.gradient.greenTo} 100%)`,
  color: vars.color.surface,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const rejectButton = style({
  ...actionButtonBase,
  border: `1px solid ${vars.color.accent.red}`,
  background: vars.color.surface,
  color: vars.color.accent.red,

  ":disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

export const emptyBox = style({
  padding: "22px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  color: vars.color.description,
  ...vars.font.body_regular_16,
});

export const errorBox = style({
  padding: "22px",
  borderRadius: "10px",
  border: "1px solid #FCA5A5",
  background: "#FEF2F2",
  color: vars.color.accent.red,
  ...vars.font.body_regular_16,
});

export const completedList = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "28px",
});

export const completedItem = recipe({
  base: {
    minHeight: "78px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    padding: "18px 20px",
    borderRadius: "10px",
  },
  variants: {
    status: {
      approved: {
        border: "1px solid #86EFAC",
        background: "#F0FDF4",
      },
      rejected: {
        border: "1px solid #FCA5A5",
        background: "#FEF2F2",
      },
      pending: {
        border: "1px solid #FCD34D",
        background: "#FFFBEB",
      },
    },
  },
});

export const completedInfo = style({
  minWidth: 0,
});

export const completedName = style({
  marginRight: "10px",
  ...vars.font.title_bold_16,
  color: vars.color.summaryTitle,
});

export const completedBadge = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "999px",
    color: vars.color.surface,
    ...vars.font.caption_regular_12,
    fontWeight: "700",
  },
  variants: {
    status: {
      approved: {
        background: vars.color.accent.green,
      },
      rejected: {
        background: vars.color.accent.red,
      },
      pending: {
        background: vars.color.accent.orange,
      },
    },
  },
});

export const completedMeta = style({
  margin: "8px 0 0",
  ...vars.font.body_regular_16,
  color: vars.color.description,
});
