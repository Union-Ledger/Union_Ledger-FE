import { useNavigate } from "react-router-dom";
import * as styles from "@/components/dashboard/DashboardActivityOverview.css";

export type ActivityItem = {
  id: number;
  type: "receipt" | "expense" | "unmatched" | "audit";
  message: string;
  time: string;
  /** 있으면 행을 클릭해 해당 화면으로 이동 */
  to?: string;
};

interface DashboardActivityOverviewProps {
  activityData: ActivityItem[];
}

const DashboardActivityOverview = ({
  activityData,
}: DashboardActivityOverviewProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <span className={styles.title}>최근 활동</span>
      <div className={styles.contentContainer}>
        {activityData.map((activity) => {
          const target = activity.to;
          const inner = (
            <>
              <div
                className={`${styles.activityCircle} ${styles.activityCircleVariant[activity.type]}`}
              ></div>
              <div className={styles.activityTextContainer}>
                <span className={styles.activityTitle}>{activity.message}</span>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </>
          );

          return target ? (
            <button
              key={activity.id}
              type="button"
              className={styles.activityButton}
              onClick={() => navigate(target)}
            >
              {inner}
            </button>
          ) : (
            <div key={activity.id} className={styles.activityContainer}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardActivityOverview;
