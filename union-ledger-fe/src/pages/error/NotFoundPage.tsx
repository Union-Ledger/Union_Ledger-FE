import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import ErrorScreen from "@shared/components/error/ErrorScreen";
import * as styles from "@shared/components/error/ErrorScreen.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorScreen
      code="404"
      title="페이지를 찾을 수 없습니다"
      description="주소가 잘못되었거나 이동·삭제된 페이지입니다."
      actions={
        <>
          <Link className={styles.primaryAction} to={ROUTES.DASHBOARD}>
            대시보드로 이동
          </Link>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => navigate(-1)}
          >
            이전 페이지
          </button>
        </>
      }
    />
  );
};

export default NotFoundPage;
