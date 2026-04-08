import "@/styles/reset.css.ts";
import { globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css.ts";

globalStyle("html", {
  fontSize: "62.5%",
  scrollPaddingTop: "7rem",
});

globalStyle("body", {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: vars.color.background,
  color: vars.color.foreground,
  fontFamily: vars.font.body,
  lineHeight: 1.5,
  WebkitFontSmoothing: "antialiased",
});

globalStyle("#root", {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
});

globalStyle("main", {
  minHeight: "70vh",
  flexGrow: 1,
});

globalStyle("a", {
  color: vars.color.primary,
  textDecoration: "none",
});
