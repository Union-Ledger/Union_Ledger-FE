import { Navigate } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardRouteByUser } from "@/pages/logIn/authRoute";
import Spinner from "@shared/components/feedback/Spinner";

// "/" 진입 시 실제 역할 기준 대시보드로 보낸다.
// (이전에는 역할과 무관하게 재정담당자 대시보드로 보내 가드에 튕겨 다녔다)
const RoleHomeRedirect = () => {
  const { me, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Spinner size="lg" label="대시보드로 이동 중" />
      </div>
    );
  }

  return <Navigate to={me ? getDashboardRouteByUser(me) : ROUTES.LOGIN} replace />;
};

export default RoleHomeRedirect;
