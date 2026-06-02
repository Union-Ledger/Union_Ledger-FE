import * as styles from "@/components/dashboard/DashboardActivityOverview.css";

export type ActivityItem = {
  id: number;
  type: "receipt" | "expense" | "unmatched" | "audit";
  message: string;
  time: string;
};

interface DashboardActivityOverviewProps {
  activityData: ActivityItem[];
}

const DashboardActivityOverview = ({
  activityData,
}: DashboardActivityOverviewProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>최근 활동</span>
      <div className={styles.contentContainer}>
        {activityData.map((activity) => (
          <div key={activity.id} className={styles.activityContainer}>
            <div
              className={`${styles.activityCircle} ${styles.activityCircleVariant[activity.type]}`}
            ></div>
            <div className={styles.activityTextContainer}>
              <span className={styles.activityTitle}>{activity.message}</span>
              <span className={styles.activityTime}>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardActivityOverview;
