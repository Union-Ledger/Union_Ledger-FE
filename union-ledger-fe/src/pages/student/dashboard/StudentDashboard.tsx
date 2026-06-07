import { useEffect, useState } from "react";
import useDashboardApi, {
  type TreasurerDashboardResponse,
} from "@/hooks/useDashboardApi";
import * as styles from "@/pages/student/dashboard/StudentDashboard.css";
import StudentDashboardCards from "@/components/student/StudentDashboardCards";
import StudentDashboardAuditResult from "@/components/student/StudentDashboardAuditResult";
import StudentDashboardQuestion from "@/components/student/StudentDashboardQuestion";

const parseAmount = (amount: string) => {
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? parsed : 0;
};

const StudentDashboard = () => {
  const { getTreasurerDashboard } = useDashboardApi();

  const [dashboardData, setDashboardData] =
    useState<TreasurerDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getTreasurerDashboard(10);

        if (data) {
          setDashboardData(data);
          console.log("대시보드 조회 성공", data);
        }
      } catch (error) {
        console.error("대시보드 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>대시보드</span>
          <span className={styles.desc}>재정 현황을 불러오는 중입니다</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>학생 대시보드</span>
        <span className={styles.desc}>
          학생회 결산 내역을 투명하게 확인하세요
        </span>
      </div>

      <StudentDashboardCards
        totalEvidenceCount={dashboardData?.total_evidence_count ?? 0}
        totalEvidenceAmount={parseAmount(
          dashboardData?.total_evidence_amount ?? "0",
        )}
        matchedCount={dashboardData?.matched_count ?? 0}
        unmatchedCount={dashboardData?.unmatched_count ?? 0}
        progressPercent={dashboardData?.progress_percent ?? 0}
      />

      <div className={styles.contentContainer}>
        <StudentDashboardAuditResult />
        <StudentDashboardQuestion />
      </div>
    </div>
  );
};

export default StudentDashboard;
