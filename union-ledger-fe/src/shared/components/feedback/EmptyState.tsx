import type { ReactNode } from "react";
import * as styles from "./EmptyState.css";

interface EmptyStateProps {
  /** 이모지 문자열 또는 아이콘 노드 */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** 다음 행동 CTA (버튼/링크) */
  action?: ReactNode;
}

const EmptyState = ({ icon = "📋", title, description, action }: EmptyStateProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconCircle} aria-hidden="true">
        {icon}
      </div>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.actionBox}>{action}</div>}
    </div>
  );
};

export default EmptyState;
