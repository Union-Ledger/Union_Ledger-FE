import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useDashboardApi, {
  type StudentDashboardResponse,
} from "@/hooks/useDashboardApi";
import * as styles from "@/pages/student/dashboard/StudentDashboard.css";
import StudentDashboardCards from "@/components/student/StudentDashboardCards";
import StudentDashboardAuditResult, {
  type StudentAuditResultItem,
} from "@/components/student/StudentDashboardAuditResult";
import StudentDashboardComparison from "@/components/student/StudentDashboardComparison";
import StudentDashboardQuestion from "@/components/student/StudentDashboardQuestion";
import { ROUTES } from "@/router/constant/router";
import { ErrorState, Skeleton } from "@/shared/components/feedback";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [showApplicationToast, setShowApplicationToast] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getStudentDashboardOnce();
      if (data) {
        setDashboardData(data);
      }
    } catch {
      setErrorMessage("결산 요약을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [getStudentDashboardOnce]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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
        <div className={styles.headerRow}>
          <div className={styles.titleContainer}>
            <span className={styles.title}>학생 대시보드</span>
            <span className={styles.desc}>결산 내역을 불러오는 중입니다</span>
          </div>
        </div>
        <div className={styles.summarySkeletonGrid} aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={styles.summarySkeletonCard} key={index}>
              <Skeleton width="4.2rem" height="4.2rem" radius="1.2rem" />
              <Skeleton width="58%" height="1.4rem" />
              <Skeleton width="74%" height="2.4rem" />
              <Skeleton width="82%" height="1.2rem" />
            </div>
          ))}
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.panelSkeleton}>
            <Skeleton width="42%" height="2rem" />
            <Skeleton width="100%" height="8rem" radius="1.2rem" />
            <Skeleton width="92%" height="8rem" radius="1.2rem" />
          </div>
          <div className={styles.panelSkeleton}>
            <Skeleton width="54%" height="2rem" />
            <Skeleton width="100%" height="4.4rem" radius="1rem" />
            <Skeleton width="100%" height="4.4rem" radius="1rem" />
            <Skeleton width="100%" height="4.4rem" radius="1rem" />
          </div>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>학생 대시보드</span>
          <span className={styles.desc}>
            {dashboardData?.organization?.name
              ? `${dashboardData.organization.name} 결산 내역을 투명하게 확인하세요`
              : "학생회 결산 내역을 투명하게 확인하세요"}
          </span>
        </div>
        <Link className={styles.primaryLink} to={ROUTES.STUDENT_SETTLEMENTS}>
          결산안 조회
        </Link>
      </div>

      {errorMessage && (
        <div className={styles.errorPanel}>
          <ErrorState description={errorMessage} onRetry={loadDashboard} />
        </div>
      )}

      {!errorMessage && (
        <>
          <StudentDashboardCards
            totalEvidenceCount={summary?.published_settlement_count ?? 0}
            totalEvidenceAmount={parseAmount(
              summary?.current_period_total_amount ?? "0",
            )}
            recentApprovedAt={summary?.last_published_at ?? null}
            periodLabel={dashboardData?.current_period?.label}
          />

          <StudentDashboardComparison
            cards={dashboardData?.college_period_overview ?? []}
            periodLabel={dashboardData?.current_period?.label}
          />

          <div className={styles.contentContainer}>
            <StudentDashboardAuditResult results={toAuditResults(dashboardData)} />
            <StudentDashboardQuestion />
          </div>
        </>
      )}

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
