import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardRouteByUser } from "@/pages/logIn/authRoute";

interface RequireRoleProps {
  allowedRoles?: string[];
  allowOperator?: boolean;
  children: ReactNode;
}

// 역할 기반 라우트 가드. 로그인은 됐지만 권한이 없는 역할의 화면으로 직접
// URL 접근하는 것을 막고, 본인 역할의 대시보드로 되돌려보낸다.
// (백엔드가 실제 권한을 403/404로 강제하므로 이건 방어적 UX 계층이다.)
const RequireRole = ({
  allowedRoles = [],
  allowOperator = false,
  children,
}: RequireRoleProps) => {
  const { me, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: 32, color: "#64748b" }}>불러오는 중...</div>;
  }

  if (!me) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const hasAllowedRole = allowedRoles.some((role) => me.roles?.includes(role));
  const authorized = (allowOperator && me.is_operator) || hasAllowedRole;

  if (!authorized) {
    return <Navigate to={getDashboardRouteByUser(me)} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
