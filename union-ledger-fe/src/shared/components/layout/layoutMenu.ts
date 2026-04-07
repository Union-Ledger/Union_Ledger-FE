import { ROUTES } from "@router/constant/router";
import dashboardIcon from "@assets/dashboard.svg";
import templateIcon from "@assets/template.svg";
import uploadIcon from "@assets/upload.svg";
import compareIcon from "@assets/compare.svg";
import createIcon from "@assets/create.svg";

export type LayoutMenu = {
  label: string;
  to: string;
  icon: string;
};

export const layoutMenus: LayoutMenu[] = [
  { label: "대시보드", to: ROUTES.DASHBOARD, icon: dashboardIcon },
  { label: "양식 등록", to: ROUTES.TEMPLATE, icon: templateIcon },
  { label: "업로드", to: ROUTES.UPLOAD, icon: uploadIcon },
  { label: "거래내역 대조", to: ROUTES.COMPARE, icon: compareIcon },
  { label: "결산안 생성", to: ROUTES.CREATE, icon: createIcon },
];
