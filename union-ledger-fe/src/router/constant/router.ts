export const ROUTES = {
  // 메인 대시보드 화면
  DASHBOARD: "/",
  // 재정담당자 대시보드 화면
  TREASURER_DASHBOARD: "/treasurer/dashboard",
  // 로그인 화면
  LOGIN: "/treasurer/login",
  // 회원가입 화면
  SIGNUP: "/treasurer/signup",
  // 비밀번호 찾기 화면
  FORGOT_PASSWORD: "/treasurer/forgot-password",
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
  // 학생 대시보드 화면
  STUDENT_DASHBOARD: "/student/dashboard",
  // 일반 학우 결산안 조회 화면
  STUDENT_SETTLEMENTS: "/student/settlements",
  // 일반 학우 받은 초대 화면
  STUDENT_INVITATIONS: "/student/invitations",
  // 일반 학우 회장 신청 화면
  STUDENT_PRESIDENT_APPLICATION: "/student/president-application",
  // 회장 대시보드 화면
  PRESIDENT_DASHBOARD: "/president/dashboard",
  // 회장 팀원 초대 화면
  PRESIDENT_INVITE: "/president/invite",
  // 운영자 회장 신청 검토 화면
  ADMIN_APPLICATIONS: "/admin/applications",
} as const;
