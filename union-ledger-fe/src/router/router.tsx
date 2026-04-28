import { createBrowserRouter, Outlet } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import Login from "@pages/logIn/LogIn";
import AppLayout from "@shared/components/layout/AppLayout";
import Dashboard from "@/pages/treasurer/dashboard/Dashboard";
import Template from "@/pages/treasurer/template/Template";
import Upload from "@/pages/treasurer/upload/Upload";
import Compare from "@/pages/treasurer/compare/Compare";
import Create from "@/pages/treasurer/create/Create";

const router = createBrowserRouter([
  {
    element: <Outlet />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: ROUTES.TEMPLATE,
            element: <Template />,
          },
          {
            path: ROUTES.UPLOAD,
            element: <Upload />,
          },
          {
            path: ROUTES.COMPARE,
            element: <Compare />,
          },
          {
            path: ROUTES.CREATE,
            element: <Create />,
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
