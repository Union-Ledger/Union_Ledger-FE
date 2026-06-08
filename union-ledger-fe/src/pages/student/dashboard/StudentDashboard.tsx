import { useEffect, useState } from "react";
import useDashboardApi, {
  type StudentDashboardResponse,
} from "@/hooks/useDashboardApi";
import * as styles from "@/pages/student/dashboard/StudentDashboard.css";
import StudentDashboardCards from "@/components/student/StudentDashboardCards";
import StudentDashboardAuditResult, {
  type StudentAuditResultItem,
} from "@/components/student/StudentDashboardAuditResult";
import StudentDashboardQuestion from "@/components/student/StudentDashboardQuestion";

const parseAmount = (amount: string) => {
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toAuditResults = (
  data: StudentDashboardResponse | null,
): StudentAuditResultItem[] => {
  return (data?.recent_results ?? []).map((result) => ({
    id: result.settlement_id,
    semester: result.label,
    status: result.status === "approved" ? "APPROVED" : "UNAPPROVED",
    amount: parseAmount(result.total_amount),
    comment: result.summary_comment ?? "",
    approvedAt: result.audited_at ?? result.published_at ?? null,
  }));
};

const StudentDashboard = () => {
  const { getStudentDashboard } = useDashboardApi();
  const [getStudentDashboardOnce] = useState(() => getStudentDashboard);

  const [dashboardData, setDashboardData] =
    useState<StudentDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationToast, setShowApplicationToast] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getStudentDashboardOnce();
        if (data) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("학생 대시보드 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [getStudentDashboardOnce]);

  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem(
      "studentPresidentApplicationSubmitted",
    );

    if (!shouldShowToast) {
      return;
    }

    sessionStorage.removeItem("studentPresidentApplicationSubmitted");
    setShowApplicationToast(true);

    const timerId = window.setTimeout(() => {
      setShowApplicationToast(false);
    }, 4000);

    return () => window.clearTimeout(timerId);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>학생 대시보드</span>
          <span className={styles.desc}>결산 내역을 불러오는 중입니다</span>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>학생 대시보드</span>
        <span className={styles.desc}>
          {dashboardData?.organization?.name
            ? `${dashboardData.organization.name} 결산 내역을 투명하게 확인하세요`
            : "학생회 결산 내역을 투명하게 확인하세요"}
        </span>
      </div>

      <StudentDashboardCards
        totalEvidenceCount={summary?.published_settlement_count ?? 0}
        totalEvidenceAmount={parseAmount(
          summary?.current_period_total_amount ?? "0",
        )}
        recentApprovedAt={summary?.last_published_at ?? null}
        viewCount={summary?.total_view_count ?? 0}
      />

      <div className={styles.contentContainer}>
        <StudentDashboardAuditResult results={toAuditResults(dashboardData)} />
        <StudentDashboardQuestion />
      </div>

      {showApplicationToast && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✓</span>
          <span>
            회장 신청이 완료되었습니다. 운영자 검토까지 1~2일 소요됩니다.
          </span>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
