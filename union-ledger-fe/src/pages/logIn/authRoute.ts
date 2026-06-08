import { ROUTES } from "@/router/constant/router";
import type { MeResponse } from "@/hooks/useAuthApi";

export const getDashboardRouteByUser = (user: Pick<MeResponse, "roles" | "is_operator">) => {
  if (user.is_operator) {
    return ROUTES.ADMIN_APPLICATIONS;
  }

  if (user.roles.includes("president")) {
    return ROUTES.PRESIDENT_DASHBOARD;
  }

  if (user.roles.includes("treasurer")) {
    return ROUTES.TREASURER_DASHBOARD;
  }

  if (user.roles.includes("auditor")) {
    return ROUTES.AUDITOR_DASHBOARD;
  }

  return ROUTES.STUDENT_DASHBOARD;
};

export const getDashboardRouteByRoles = (roles: string[]) => {
  if (roles.includes("treasurer")) {
    return ROUTES.TREASURER_DASHBOARD;
  }

  if (roles.includes("auditor")) {
    return ROUTES.AUDITOR_DASHBOARD;
  }

  return ROUTES.STUDENT_DASHBOARD;
};
