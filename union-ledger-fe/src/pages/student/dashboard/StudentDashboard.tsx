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

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "작성 중",
    submitted: "제출됨",
    auditing: "검토 중",
    approved: "승인됨",
    rejected: "반려됨",
    published: "공개됨",
  };

  return statusMap[status] ?? status;
};

const getTimeText = (dateString: string | null) => {
  if (!dateString) return "방금 전";

  const targetTime = new Date(dateString).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - targetTime) / (1000 * 60));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
};

const createProgressData = (
  dashboardData: TreasurerDashboardResponse | null,
): ProgressItem[] => {
  if (!dashboardData) return [];

  const totalMatchingCount =
    dashboardData.matched_count + dashboardData.unmatched_count;

  return [
    {
      id: "receipt",
      label: "증빙 수집",
      current: dashboardData.total_evidence_count,
      total: Math.max(dashboardData.total_evidence_count, 1),
      variant: "violet",
    },
    {
      id: "transaction",
      label: "거래내역 대조",
      current: dashboardData.matched_count,
      total: Math.max(totalMatchingCount, 1),
      variant: "pink",
    },
    {
      id: "audit",
      label: "감사 제출",
      current: dashboardData.progress_percent,
      total: 100,
      displayText: `${dashboardData.progress_percent}%`,
      variant: "blue",
    },
  ];
};

const createActivityData = (
  dashboardData: TreasurerDashboardResponse | null,
): ActivityItem[] => {
  if (!dashboardData) return [];

  return dashboardData.recent_settlements.map((settlement, index) => {
    const hasUnmatched = settlement.unmatched_count > 0;

    return {
      id: index + 1,
      type: hasUnmatched ? "unmatched" : "receipt",
      message: hasUnmatched
        ? `${settlement.organization_name} 거래내역 ${settlement.unmatched_count}건 매칭 필요`
        : `${settlement.organization_name} ${getStatusLabel(settlement.status)}`,
      time: getTimeText(settlement.submitted_at ?? settlement.audited_at),
    };
  });
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
