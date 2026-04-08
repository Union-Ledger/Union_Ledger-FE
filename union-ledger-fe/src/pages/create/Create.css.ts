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
