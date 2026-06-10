import * as styles from "./Spinner.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  /** 스크린 리더용 설명. 기본 "불러오는 중" */
  label?: string;
}

const Spinner = ({ size = "md", label = "불러오는 중" }: SpinnerProps) => {
  return <span className={styles.spinner({ size })} role="status" aria-label={label} />;
};

export default Spinner;
