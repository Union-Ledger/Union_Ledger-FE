import { ROUTES } from "@/router/constant/router";

export const getDashboardRouteByRoles = (roles: string[]) => {
  if (roles.includes("treasurer")) {
    return "/treasurer/dashboard";
  }

  if (roles.includes("auditor")) {
    return ROUTES.AUDITOR_DASHBOARD;
  }

  return ROUTES.STUDENT_DASHBOARD;
};
