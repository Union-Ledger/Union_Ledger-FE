import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import ErrorScreen from "@shared/components/error/ErrorScreen";
import * as styles from "@shared/components/error/ErrorScreen.css";

const RouteErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ErrorScreen
        code="404"
        title="페이지를 찾을 수 없습니다"
        description="주소가 잘못되었거나 이동·삭제된 페이지입니다."
        actions={
          <Link className={styles.primaryAction} to={ROUTES.DASHBOARD}>
            대시보드로 이동
          </Link>
        }
      />
    );
  }

  console.error("라우트 오류:", error);

  return (
    <ErrorScreen
      title="화면을 표시하는 중 문제가 발생했습니다"
      description="일시적인 오류일 수 있습니다. 새로고침 후에도 반복되면 관리자에게 문의해주세요."
      actions={
        <>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
          <Link className={styles.secondaryAction} to={ROUTES.DASHBOARD}>
            대시보드로 이동
          </Link>
        </>
      }
    />
  );
};

export default RouteErrorPage;
