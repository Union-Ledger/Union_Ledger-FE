import * as styles from "./DashboardProgressOverview.css";

export type ProgressVariant = "violet" | "pink" | "blue" | "green";

export type ProgressItem = {
  id: string;
  label: string;
  current: number;
  total: number;
  displayText?: string;
  variant: ProgressVariant;
};

interface DashboardProgressOverviewProps {
  progressData: ProgressItem[];
}

const DashboardProgressOverview = ({
  progressData,
}: DashboardProgressOverviewProps) => {
  const getProgressPercent = (current: number, total: number) => {
    if (!total) return 0;
    return Math.min((current / total) * 100, 100);
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>진행률</span>

      <div className={styles.contentContainer}>
        {progressData.map((progress) => {
          const percent = getProgressPercent(progress.current, progress.total);

          return (
            <div key={progress.id} className={styles.progressContainer}>
              <div className={styles.progressTextContainer}>
                <span className={styles.progressTitle}>{progress.label}</span>
                <span
                  className={`${styles.progressDisplayText} ${styles.progressDisplayTextVariant[progress.variant]}`}
                >
                  {progress.displayText
                    ? progress.displayText
                    : `${progress.current}/${progress.total}`}
                </span>
              </div>

              <div className={styles.progressTotalBar}>
                <div
                  className={`${styles.progressCurrentBar} ${styles.progressCurrentBarVariant[progress.variant]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardProgressOverview;
