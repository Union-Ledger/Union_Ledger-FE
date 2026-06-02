import AuditorDashboardCards from "@/components/auditor/AuditorDashboardCards";
import DashboardActivityOverview, {
  type ActivityItem,
} from "@/components/dashboard/DashboardActivityOverview";
import DashboardProgressOverview, {
  type ProgressItem,
} from "@/components/dashboard/DashboardProgressOverview";
import * as styles from "@/pages/treasurer/dashboard/Dashboard.css";

const AuditorDashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>감사위원 대시보드</span>
        <span className={styles.desc}>
          제출된 결산안을 검토하고 승인/반려를 결정하세요
        </span>
      </div>
      <AuditorDashboardCards />
      <div className={styles.contentContainer}>
        <DashboardProgressOverview progressData={progressDummyData} />
        <DashboardActivityOverview activityData={activityData} />
      </div>
    </div>
  );
};

export default AuditorDashboard;

const progressDummyData: ProgressItem[] = [
  {
    id: "approvalRate",
    label: "검토 완료율",
    current: 9,
    total: 11,
    variant: "green",
  },
  {
    id: "averageReviewTime",
    label: "승인율",
    current: 8,
    total: 9,
    variant: "blue",
  },
  {
    id: "averageComment",
    label: "이번 달 검토 건수",
    current: 5,
    total: 7,
    variant: "pink",
  },
];

const activityData: ActivityItem[] = [
  {
    id: 1,
    type: "receipt",
    message: "기계공학과 결산안 승인",
    time: "1시간 전",
  },
  {
    id: 2,
    type: "audit",
    message: "건축학과 결산안에 코멘트 3건 작성",
    time: "5시간 전",
  },
  {
    id: 3,
    type: "unmatched",
    message: "화확공학과 결산안 반려",
    time: "1일 전",
  },
];
