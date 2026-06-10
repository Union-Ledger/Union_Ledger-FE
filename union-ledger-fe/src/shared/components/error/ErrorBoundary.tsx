import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorScreen from "./ErrorScreen";
import * as styles from "./ErrorScreen.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// 라우터 바깥(프로바이더 포함)에서 발생한 렌더링 오류의 최종 안전망.
// 라우트 내부 오류는 router의 errorElement(RouteErrorPage)가 먼저 처리한다.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("렌더링 오류:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
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
              <a className={styles.secondaryAction} href="/">
                홈으로 이동
              </a>
            </>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
