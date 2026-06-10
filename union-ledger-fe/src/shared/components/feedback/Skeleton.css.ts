import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const shimmer = keyframes({
  from: { backgroundPosition: "200% 0" },
  to: { backgroundPosition: "-200% 0" },
});

export const skeleton = style({
  display: "inline-block",
  background: "linear-gradient(90deg, #EEF0F4 25%, #E3E6EC 37%, #EEF0F4 63%)",
  backgroundSize: "400% 100%",
  animation: `${shimmer} 1.4s ease infinite`,
  borderRadius: vars.radius.sm,
});
