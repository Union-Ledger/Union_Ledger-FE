import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@styles/theme.css.ts";

export const container = style({
  width: "100%",
  height: "100vh",
  display: "flex",
  overflow: "hidden",
});

export const sidebar = style({
  display: "flex",
  flexDirection: "column",
  width: "25.6rem",
  minWidth: "25.6rem",
  height: "100%",
  flexShrink: 0,
  background: `linear-gradient(180deg, ${vars.color.gradient.sidebarFrom} 0%, ${vars.color.gradient.sidebarMid} 50%, ${vars.color.gradient.sidebarTo} 100%)`,
});

export const titleBox = style({
  width: "100%",
  minHeight: "9.3rem",
  display: "flex",
  alignItems: "center",
  gap: "1.2rem",
  padding: "24px",
});

export const titleIconBox = style({
  width: "40px",
  height: "40px",
  padding: "0 12px",
  borderRadius: "10px",
  background: `linear-gradient(135deg, ${vars.color.gradient.skyFrom} 0%, ${vars.color.gradient.skyTo} 100%)`,
});

export const titleIcon = style({
  display: "flex",
  width: "40px",
  height: "40px",
  justifyContent: "center",
  alignItems: "center",
});

export const titleTextGroup = style({
  display: "flex",
  flexDirection: "column",
  height: "40px",
});

export const titleMain = style({
  ...vars.font.title_bold_18,
  color: vars.color.surface,
});

export const titleSub = style({
  ...vars.font.caption_regular_12,
  color: vars.color.subtitle,
});

export const divider = style({
  borderBottom: `1px solid ${vars.color.white10}`,
});
export const dropdownBox = style({
  display: "flex",
  width: "256px",
  height: "69.5px",
  padding: "16px 16px 1px 16px",
  flexDirection: "column",
  alignItems: "flex-start",
  flexShrink: 0,
});

export const dropdown = style({
  height: "36.5px",
  flexShrink: 0,
  alignSelf: "stretch",
  borderRadius: "10px",
  border: `1px solid ${vars.color.white20}`,
  background: vars.color.white10,
  color: "white",
  padding: "0 12px",
});

export const menuBox = style({
  display: "flex",
  width: "256px",
  padding: "16px 16px 0 16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  flex: 1,
});

export const eachmenuBox = style({
  width: "100%",
  textDecoration: "none",
});

export const footer = style({
  ...vars.font.caption_regular_12,
  color: vars.color.footer,
  display: "flex",
  width: "256px",
  height: "49px",
  marginTop: "auto",
  padding: "17px 16px 0 16px",
  flexDirection: "column",
  alignItems: "center",
});

export const content = style({
  flex: 1,
  minWidth: 0,
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
});

export const menuItem = recipe({
  base: {
    display: "flex",
    width: "100%",
    height: "44px",
    paddingLeft: "16px",
    alignItems: "center",
    gap: "12px",
  },
  variants: {
    active: {
      true: {
        borderRadius: "10px",
        background: "linear-gradient(90deg, #AD46FF 0%, #2B7FFF 100%)",
        boxShadow:
          "0 10px 15px -3px rgba(173, 70, 255, 0.50), 0 4px 6px -4px rgba(173, 70, 255, 0.50)",
      },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const menuLabel = style({
  ...vars.font.body_medium_14,
  color: vars.color.menuLabel,
  transform: "translateY(1px)",
  // 폰트 베이스라인 때문에 아이콘 대비 라벨이 살짝 위로 뜨는 전형적인 케이스
});

export const menuIcon = style({
  width: "20px",
  height: "20px",
  flexShrink: 0,
  lineHeight: "142.857%",
});
