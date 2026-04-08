import * as styles from "@/components/dashboard/DashboardActivityOverview.css";

type ActivityItem = {
  id: number;
  type: "receipt" | "expense" | "unmatched" | "audit";
  message: string;
  time: string;
};

const DashboardActivityOverview = () => {
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

const activityData: ActivityItem[] = [
  {
    id: 1,
    type: "receipt",
    message: "증빙 5건 OCR 완료",
    time: "2시간 전",
  },
  {
    id: 2,
    type: "unmatched",
    message: "거래내역 3건 매칭 필요",
    time: "5시간 전",
  },
  {
    id: 3,
    type: "receipt",
    message: "결산안 양식 등록됨",
    time: "1일 전",
  },
];
