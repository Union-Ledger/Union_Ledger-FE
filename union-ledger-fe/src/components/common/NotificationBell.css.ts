import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css.ts";

export const wrapper = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "256px",
  padding: "8px 16px",
});

export const bellButton = style({
  ...vars.font.body_medium_14,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "40px",
  padding: "0 12px",
  border: `1px solid ${vars.color.white20}`,
  borderRadius: "10px",
  background: vars.color.white10,
  color: vars.color.surface,
  cursor: "pointer",

  selectors: {
    "&:hover": {
      background: vars.color.white20,
    },
  },
});

export const badge = style({
  ...vars.font.caption_regular_12,
  minWidth: "20px",
  height: "20px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 6px",
  borderRadius: "999px",
  background: "#EF4444",
  color: "#FFFFFF",
  fontWeight: 700,
});

export const panel = style({
  position: "absolute",
  left: "16px",
  right: "16px",
  bottom: "calc(100% + 4px)",
  zIndex: 50,
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  maxHeight: "320px",
  overflowY: "auto",
  padding: "8px",
  borderRadius: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  background: vars.color.surface,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.20), 0 8px 10px -6px rgba(0, 0, 0, 0.20)",
});

export const empty = style({
  ...vars.font.body_regular_14,
  padding: "16px",
  color: vars.color.description,
  textAlign: "center",
});

export const item = style({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  width: "100%",
  padding: "10px",
  border: `1px solid ${vars.color.ItemBorder}`,
  borderRadius: "8px",
  background: vars.color.surface,
  textAlign: "left",
  cursor: "pointer",
});

export const itemUnread = style({
  background: "#F5F3FF",
  borderColor: "#DDD6FE",
});

export const itemTitle = style({
  ...vars.font.title_bold_14,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: vars.color.summaryTitle,
});

export const unreadDot = style({
  width: "8px",
  height: "8px",
  borderRadius: "999px",
  background: "#8B5CF6",
  flexShrink: 0,
});

export const itemBody = style({
  ...vars.font.body_regular_14,
  color: vars.color.description,
});

export const itemTime = style({
  ...vars.font.caption_regular_12,
  color: vars.color.gray,
});
