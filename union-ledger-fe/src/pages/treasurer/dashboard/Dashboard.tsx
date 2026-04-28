import DashboardActivityOverview from "@/components/dashboard/DashboardActivityOverview";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardProgressOverview from "@/components/dashboard/DashboardProgressOverview";
import * as styles from "@/pages/treasurer/dashboard/Dashboard.css";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>대시보드</span>
        <span className={styles.desc}>재정 현황을 한눈에 확인하세요</span>
      </div>
      <DashboardCards />
      <div className={styles.contentContainer}>
        <DashboardProgressOverview />
        <DashboardActivityOverview />
      </div>
    </div>
  );
};

export default Dashboard;
