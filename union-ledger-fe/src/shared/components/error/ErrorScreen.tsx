import type { ReactNode } from "react";
import * as styles from "./ErrorScreen.css";

interface ErrorScreenProps {
  /** "404" 같은 상태 코드 표시 (선택) */
  code?: string;
  title: string;
  description?: string;
  /** 행동 버튼들 — primaryAction/secondaryAction 스타일을 함께 export */
  actions?: ReactNode;
}

const ErrorScreen = ({ code, title, description, actions }: ErrorScreenProps) => {
  return (
    <div className={styles.container}>
      {code && <p className={styles.code}>{code}</p>}
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default ErrorScreen;
