import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import Login from "@pages/logIn/LogIn";
import SignUp from "@pages/logIn/SignUp";
import AppLayout from "@shared/components/layout/AppLayout";
import RequireAuth from "@shared/components/auth/RequireAuth";
import Template from "@/pages/treasurer/template/Template";
import Upload from "@/pages/treasurer/upload/Upload";
import Compare from "@/pages/treasurer/compare/Compare";
import Create from "@/pages/treasurer/create/Create";
import AuditorDashboard from "@/pages/auditor/dashboard/AuditorDashboard";
import Dashboard from "@/pages/treasurer/dashboard/Dashboard";
import Review from "@/pages/auditor/review/Review";
import ReviewDetail from "@/pages/auditor/review/ReviewDetail";
import DevAutoLogin from "@/components/common/DevAutoLogin";
import StudentDashboard from "@/pages/student/dashboard/StudentDashboard";
import StudentSettlementLookup from "@/pages/student/settlement/StudentSettlementLookup";

const router = createBrowserRouter([
  {
    element: (
      <>
        {import.meta.env.DEV && <DevAutoLogin />}
        <Outlet />
      </>
    ),
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.SIGNUP,
        element: <SignUp />,
      },
      {
        element: (
          <RequireAuth>
            <AppLayout />
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
            children: [
              {
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "template",
                element: <Template />,
              },
              {
                path: "upload",
                element: <Upload />,
              },
              {
                path: "compare",
                element: <Compare />,
              },
              {
                path: "create",
                element: <Create />,
              },
            ],
          },

          // 감사위원 routes
          {
            path: "auditor",
            children: [
              {
                path: "dashboard",
                element: <AuditorDashboard />,
              },
              {
                path: "review",
                element: <Review />,
              },
              {
                path: "review/detail/:id",
                element: <ReviewDetail />,
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
              },
              {
                path: "settlements",
                element: <StudentSettlementLookup />,
              },
              // {
              //   path: "history",
              //   element: <StudentHistory />,
              // },
            ],
          },

          {
            path: "*",
            element: <div>404 Not Found</div>,
          },
        ],
      },
    ],
  },
]);

export default router;
