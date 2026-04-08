import * as styles from "./DashboardProgressOverview.css";

type ProgressItem = {
  id: "receipt" | "transaction" | "audit";
  label: string;
  current: number;
  total: number;
  displayText?: string;
};

const progressDummyData: ProgressItem[] = [
  {
    id: "receipt",
    label: "증빙 수집",
    current: 47,
    total: 60,
  },
  {
    id: "transaction",
    label: "거래내역 대조",
    current: 44,
    total: 47,
  },
  {
    id: "audit",
    label: "감사 제출",
    current: 60,
    total: 100,
    displayText: "준비중",
  },
];

const getProgressPercent = (current: number, total: number) => {
  if (!total) return 0;
  return Math.min((current / total) * 100, 100);
};

const DashboardProgressOverview = () => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>진행률</span>

      <div className={styles.contentContainer}>
        {progressDummyData.map((progress) => {
          const percent = getProgressPercent(progress.current, progress.total);

          return (
            <div key={progress.id} className={styles.progressContainer}>
              <div className={styles.progressTextContainer}>
                <span className={styles.progressTitle}>{progress.label}</span>
                <span
                  className={`${styles.progressDisplayText} ${styles.progressDisplayTextVariant[progress.id]}`}
                >
                  {progress.displayText
                    ? progress.displayText
                    : `${progress.current}/${progress.total}`}
                </span>
              </div>

              <div className={styles.progressTotalBar}>
                <div
                  className={`${styles.progressCurrentBar} ${styles.progressCurrentBarVariant[progress.id]}`}
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
