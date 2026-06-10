import * as styles from "./ErrorState.css";

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** 전달하면 "다시 시도" 버튼 표시 */
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState = ({
  title = "문제가 발생했습니다",
  description,
  onRetry,
  retryLabel = "다시 시도",
}: ErrorStateProps) => {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.iconCircle} aria-hidden="true">
        !
      </div>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
