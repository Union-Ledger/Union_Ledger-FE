import { createBrowserRouter, Outlet } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import Dashboard from "@pages/dashboard/Dashboard";
import Login from "@pages/logIn/LogIn";
import Template from "@pages/template/Template";
import Upload from "@pages/upload/Upload";
import Compare from "@pages/compare/Compare";
import Create from "@pages/create/Create";
import AppLayout from "@shared/components/layout/AppLayout";

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
