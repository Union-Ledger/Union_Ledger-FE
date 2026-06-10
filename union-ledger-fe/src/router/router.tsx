import {
  createBrowserRouter,
  Navigate,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import AppLayout from "@shared/components/layout/AppLayout";
import RequireAuth from "@shared/components/auth/RequireAuth";
import RequireRole from "@shared/components/auth/RequireRole";
import RouteTitle from "@shared/components/RouteTitle";
import NotFoundPage from "@pages/error/NotFoundPage";
import RouteErrorPage from "@pages/error/RouteErrorPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { EvidenceReviewProvider } from "@/contexts/EvidenceReviewContext";
import DevAutoLogin from "@/components/common/DevAutoLogin";
import {
  AdminApplications,
  AuditorDashboard,
  Compare,
  Create,
  Dashboard,
  ForgotPassword,
  Login,
  PresidentDashboard,
  PresidentInvite,
  Review,
  ReviewDetail,
  SignUp,
  StudentDashboard,
  StudentInvitations,
  StudentPresidentApplication,
  StudentSettlementLookup,
  Template,
  Upload,
} from "@router/lazyPages";

const router = createBrowserRouter([
  {
    element: (
      <>
        {import.meta.env.DEV && <DevAutoLogin />}
        <RouteTitle />
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
        handle: { title: "로그인" },
      },
      {
        path: ROUTES.SIGNUP,
        element: <SignUp />,
        handle: { title: "회원가입" },
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPassword />,
        handle: { title: "비밀번호 재설정" },
      },
      {
        element: (
          <RequireAuth>
            <AuthProvider>
              <EvidenceReviewProvider>
                <AppLayout />
              </EvidenceReviewProvider>
            </AuthProvider>
          </RequireAuth>
        ),
        children: [
          {
            path: "/",
            element: <Navigate to={ROUTES.TREASURER_DASHBOARD} replace />,
          },

          // 재정담당자 routes
          {
            path: "treasurer",
            element: (
              <RequireRole allowedRoles={["treasurer", "president"]}>
                <Outlet />
              </RequireRole>
            ),
            children: [
              {
                path: "dashboard",
                element: <Dashboard />,
                handle: { title: "대시보드" },
              },
              {
                path: "template",
                element: <Template />,
                handle: { title: "결산안 양식" },
              },
              {
                path: "upload",
                element: <Upload />,
                handle: { title: "증빙 업로드" },
              },
              {
                path: "compare",
                element: <Compare />,
                handle: { title: "거래내역 대조" },
              },
              {
                path: "create",
                element: <Create />,
                handle: { title: "결산안 생성" },
              },
            ],
          },

          // 감사위원 routes
          {
            path: "auditor",
            element: (
              <RequireRole allowedRoles={["auditor"]}>
                <Outlet />
              </RequireRole>
            ),
            children: [
              {
                path: "dashboard",
                element: <AuditorDashboard />,
                handle: { title: "감사 대시보드" },
              },
              {
                path: "review",
                element: <Review />,
                handle: { title: "결산안 검토" },
              },
              {
                path: "review/detail/:id",
                element: <ReviewDetail />,
                handle: { title: "검토 상세" },
              },
            ],
          },

          // 일반 학우 routes
          {
            path: "student",
            children: [
              {
                path: "dashboard",
                element: <StudentDashboard />,
                handle: { title: "학생 대시보드" },
              },
              {
                path: "settlements",
                element: <StudentSettlementLookup />,
                handle: { title: "결산안 조회" },
              },
              {
                path: "invitations",
                element: <StudentInvitations />,
                handle: { title: "받은 초대" },
              },
              {
                path: "president-application",
                element: <StudentPresidentApplication />,
                handle: { title: "회장 신청" },
              },
            ],
          },

          // 회장 routes
          {
            path: "president",
            element: (
              <RequireRole allowedRoles={["president"]}>
                <Outlet />
              </RequireRole>
            ),
            children: [
              {
                path: "dashboard",
                element: <PresidentDashboard />,
                handle: { title: "회장 대시보드" },
              },
              {
                path: "invite",
                element: <PresidentInvite />,
                handle: { title: "팀원 초대" },
              },
            ],
          },

          // 운영자 routes
          {
            path: "admin",
            element: (
              <RequireRole allowOperator>
                <Outlet />
              </RequireRole>
            ),
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.ADMIN_APPLICATIONS} replace />,
              },
              {
                path: "applications",
                element: <AdminApplications />,
                handle: { title: "회장 신청 관리" },
              },
            ],
          },

          {
            path: "*",
            element: <NotFoundPage />,
            handle: { title: "페이지를 찾을 수 없습니다" },
          },
        ],
      },
    ],
  },
]);

export default router;
