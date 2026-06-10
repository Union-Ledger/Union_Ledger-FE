import { keyframes } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/styles/theme.css";

const rotate = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinner = recipe({
  base: {
    display: "inline-block",
    borderStyle: "solid",
    borderColor: vars.color.ItemBorder,
    borderTopColor: vars.color.primary,
    borderRadius: vars.radius.full,
    animation: `${rotate} 0.7s linear infinite`,
  },
  variants: {
    size: {
      sm: { width: "1.6rem", height: "1.6rem", borderWidth: "2px" },
      md: { width: "2.4rem", height: "2.4rem", borderWidth: "3px" },
      lg: { width: "3.6rem", height: "3.6rem", borderWidth: "3px" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
