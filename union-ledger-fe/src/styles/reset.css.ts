import { globalStyle } from "@vanilla-extract/css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

globalStyle("html", {
  MozTextSizeAdjust: "none",
  WebkitTextSizeAdjust: "none",
  textSizeAdjust: "none",
});

globalStyle("ol, ul, li, menu, summary", {
  listStyle: "none",
});

globalStyle("img", {
  maxInlineSize: "100%",
  maxBlockSize: "100%",
});

globalStyle("table", {
  borderCollapse: "collapse",
});

globalStyle("[hidden]", {
  display: "none",
});

globalStyle("*", {
  margin: 0,
  padding: 0,
});

globalStyle("html, body, #root", {
  minHeight: "100%",
});
