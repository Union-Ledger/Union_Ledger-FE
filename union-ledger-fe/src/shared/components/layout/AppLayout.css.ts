import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@styles/theme.css.ts";

export const container = style({
  width: "100%",
  height: "100%",
  display: "flex",
});

export const sidebar = style({
  display: "flex",
  flexDirection: "column",
  maxWidth: "25.6rem",
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
});

export const menuBox = style({
  display: "flex",
  width: "256px",
  height: "554.5px",
  padding: "16px 16px 0 16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  marginBottom: "180px",
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
  padding: "17px 16px 0 16px",
  flexDirection: "column",
  alignItems: "center",
});

export const content = style({});

export const contentInner = style({});

export const mobileTopbar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.2rem 1.6rem",
  background: `linear-gradient(90deg, ${vars.color.gradient.brandFrom} 0%, ${vars.color.gradient.brandTo} 100%)`,
  color: vars.color.white95,
  "@media": {
    "(min-width: 901px)": {
      display: "none",
    },
  },
});

export const mobileNav = style({
  display: "flex",
  gap: "0.8rem",
  overflowX: "auto",
  padding: "1rem 1.6rem",
  background: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
  "@media": {
    "(min-width: 901px)": {
      display: "none",
    },
  },
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
