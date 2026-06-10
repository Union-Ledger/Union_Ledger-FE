import { lazy } from "react";

// 라우트 단위 코드 스플리팅 — 첫 화면 번들에서 각 페이지를 분리한다.
// (router.tsx와 분리된 이유: react-refresh 규칙상 컴포넌트 정의와
//  비컴포넌트 export(router)를 한 파일에 둘 수 없다)
export const Login = lazy(() => import("@pages/logIn/LogIn"));
export const SignUp = lazy(() => import("@pages/logIn/SignUp"));
export const ForgotPassword = lazy(() => import("@pages/logIn/ForgotPassword"));
export const Template = lazy(() => import("@/pages/treasurer/template/Template"));
export const Upload = lazy(() => import("@/pages/treasurer/upload/Upload"));
export const Compare = lazy(() => import("@/pages/treasurer/compare/Compare"));
export const Create = lazy(() => import("@/pages/treasurer/create/Create"));
export const Dashboard = lazy(() => import("@/pages/treasurer/dashboard/Dashboard"));
export const AuditorDashboard = lazy(
  () => import("@/pages/auditor/dashboard/AuditorDashboard"),
);
export const Review = lazy(() => import("@/pages/auditor/review/Review"));
export const ReviewDetail = lazy(() => import("@/pages/auditor/review/ReviewDetail"));
export const StudentDashboard = lazy(
  () => import("@/pages/student/dashboard/StudentDashboard"),
);
export const StudentSettlementLookup = lazy(
  () => import("@/pages/student/settlement/StudentSettlementLookup"),
);
export const StudentInvitations = lazy(
  () => import("@/pages/student/invitations/StudentInvitations"),
);
export const StudentPresidentApplication = lazy(
  () => import("@/pages/student/presidentApplication/StudentPresidentApplication"),
);
export const PresidentDashboard = lazy(
  () => import("@/pages/president/dashboard/PresidentDashboard"),
);
export const PresidentInvite = lazy(
  () => import("@/pages/president/invite/PresidentInvite"),
);
export const AdminApplications = lazy(
  () => import("@/pages/admin/applications/AdminApplications"),
);
