import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import { tokenStorage } from "@/utils/token";

// 로그인(토큰) 여부를 확인하는 라우트 가드. 토큰이 없으면 로그인 페이지로 보낸다.
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const token = tokenStorage.getAccessToken();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
