import * as styles from "./Skeleton.css";

interface SkeletonProps {
  /** CSS 길이 값. 기본 100% */
  width?: string;
  /** CSS 길이 값. 기본 1.6rem (텍스트 한 줄) */
  height?: string;
  /** true면 width 기준 원형 */
  circle?: boolean;
  radius?: string;
  className?: string;
}

const Skeleton = ({
  width = "100%",
  height = "1.6rem",
  circle = false,
  radius,
  className,
}: SkeletonProps) => {
  return (
    <span
      className={className ? `${styles.skeleton} ${className}` : styles.skeleton}
      style={{
        width,
        height: circle ? width : height,
        borderRadius: circle ? "50%" : radius,
      }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
