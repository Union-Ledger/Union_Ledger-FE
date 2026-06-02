export const ROUTES = {
  // 메인 대시보드 화면
  DASHBOARD: "/",
  // 로그인 화면
  LOGIN: "/treasurer/login",
  // 결산안 양식 등록 화면
  TEMPLATE: "/treasurer/template",
  // 증빙 업로드 화면
  UPLOAD: "/treasurer/upload",
  // 거래내역 대조 화면
  COMPARE: "/treasurer/compare",
  // 결산안 생성 화면
  CREATE: "/treasurer/create",
  // 감사위원 대시보드 화면
  AUDITOR_DASHBOARD: "/auditor/dashboard",
  // 감사위원 검토 화면
  AUDITOR_REVIEW: "/auditor/review",
} as const;
