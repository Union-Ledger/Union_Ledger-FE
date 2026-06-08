import { ROUTES } from "@router/constant/router";
import dashboardIcon from "@assets/layout/dashboard.svg";
import templateIcon from "@assets/layout/template.svg";
import uploadIcon from "@assets/layout/upload.svg";
import compareIcon from "@assets/layout/compare.svg";
import createIcon from "@assets/layout/create.svg";
import checkIcon from "@assets/layout/check.svg";
import eyeIcon from "@assets/eye.svg";

export type LayoutMenu = {
  label: string;
  to: string;
  icon: string;
};

export const treasurerLayoutMenus: LayoutMenu[] = [
  { label: "대시보드", to: ROUTES.TREASURER_DASHBOARD, icon: dashboardIcon },
  { label: "양식 등록", to: ROUTES.TEMPLATE, icon: templateIcon },
  { label: "업로드", to: ROUTES.UPLOAD, icon: uploadIcon },
  { label: "거래내역 대조", to: ROUTES.COMPARE, icon: compareIcon },
  { label: "결산안 생성", to: ROUTES.CREATE, icon: createIcon },
];

export const auditorLayoutMenus: LayoutMenu[] = [
  { label: "대시보드", to: ROUTES.AUDITOR_DASHBOARD, icon: dashboardIcon },
  { label: "결산안 검토", to: ROUTES.AUDITOR_REVIEW, icon: checkIcon },
];

export const studentLayoutMenus: LayoutMenu[] = [
  { label: "대시보드", to: ROUTES.STUDENT_DASHBOARD, icon: dashboardIcon },
  { label: "결산안 조회", to: ROUTES.STUDENT_SETTLEMENTS, icon: eyeIcon },
  { label: "받은 초대", to: ROUTES.STUDENT_INVITATIONS, icon: checkIcon },
  {
    label: "회장 신청",
    to: ROUTES.STUDENT_PRESIDENT_APPLICATION,
    icon: createIcon,
  },
];

export const presidentLayoutMenus: LayoutMenu[] = [
  { label: "대시보드", to: ROUTES.PRESIDENT_DASHBOARD, icon: dashboardIcon },
  { label: "팀원 초대", to: ROUTES.PRESIDENT_INVITE, icon: checkIcon },
];

export const adminLayoutMenus: LayoutMenu[] = [
  { label: "회장 신청 검토", to: ROUTES.ADMIN_APPLICATIONS, icon: checkIcon },
];
