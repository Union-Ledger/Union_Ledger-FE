import { useEffect, useMemo, useState } from "react";
import AuditorDashboardCards from "@/components/auditor/AuditorDashboardCards";
import DashboardActivityOverview, {
  type ActivityItem,
} from "@/components/dashboard/DashboardActivityOverview";
import DashboardProgressOverview, {
  type ProgressItem,
} from "@/components/dashboard/DashboardProgressOverview";
import useDashboardApi, {
  type AuditorDashboardResponse,
} from "@/hooks/useDashboardApi";
import * as styles from "@/pages/treasurer/dashboard/Dashboard.css";

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
  if (!dateString) return "시간 정보 없음";

  const targetTime = new Date(dateString).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - targetTime) / (1000 * 60));

  if (!Number.isFinite(diffMinutes) || diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
};

const getIssueCount = (
  reconciliation: AuditorDashboardResponse["pending_settlements"][number]["reconciliation"],
) => {
  return (
    reconciliation.amount_mismatch +
    reconciliation.date_mismatch +
    reconciliation.missing_bank_transaction +
    reconciliation.missing_evidence
  );
};

const createProgressData = (
  dashboardData: AuditorDashboardResponse | null,
): ProgressItem[] => {
  if (!dashboardData) return [];

  const total =
    dashboardData.pending_count +
    dashboardData.in_progress_count +
    dashboardData.completed_count;
  const progressTotal = Math.max(total, 1);

  return [
    {
      id: "pending",
      label: "검토 대기",
      current: dashboardData.pending_count,
      total: progressTotal,
      variant: "pink",
    },
    {
      id: "inProgress",
      label: "진행 중",
      current: dashboardData.in_progress_count,
      total: progressTotal,
      variant: "blue",
    },
    {
      id: "completed",
      label: "검토 완료",
      current: dashboardData.completed_count,
      total: progressTotal,
      variant: "green",
    },
  ];
};

const createActivityData = (
  dashboardData: AuditorDashboardResponse | null,
): ActivityItem[] => {
  if (!dashboardData) return [];

  return dashboardData.pending_settlements.map((settlement, index) => {
    const issueCount = getIssueCount(settlement.reconciliation);
    const organizationLabel =
      settlement.department_name || settlement.organization_name;

    return {
      id: index + 1,
      type: issueCount > 0 ? "unmatched" : "audit",
      message:
        issueCount > 0
          ? `${organizationLabel} 대조 문제 ${issueCount}건`
          : `${organizationLabel} ${getStatusLabel(settlement.status)}`,
      time: getTimeText(settlement.submitted_at ?? settlement.audited_at),
      to: `/auditor/review/detail/${settlement.settlement_id}`,
    };
  });
};

const AuditorDashboard = () => {
  const { getAuditorDashboard } = useDashboardApi();

  const [dashboardData, setDashboardData] =
    useState<AuditorDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [getAuditorDashboardOnce] = useState(() => getAuditorDashboard);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getAuditorDashboardOnce(10);

        if (data) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("감사위원 대시보드 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [getAuditorDashboardOnce]);

  const progressData = useMemo(
    () => createProgressData(dashboardData),
    [dashboardData],
  );
  const activityData = useMemo(
    () => createActivityData(dashboardData),
    [dashboardData],
  );
  const commentCount = useMemo(() => {
    if (!dashboardData) return 0;

    return dashboardData.pending_settlements.reduce(
      (sum, settlement) => sum + settlement.audit_comment_count,
      0,
    );
  }, [dashboardData]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>감사위원 대시보드</span>
        <span className={styles.desc}>
          제출된 결산안을 검토하고 승인/반려를 결정하세요
        </span>
      </div>
      <AuditorDashboardCards
        pendingCount={dashboardData?.pending_count ?? 0}
        inProgressCount={dashboardData?.in_progress_count ?? 0}
        completedCount={dashboardData?.completed_count ?? 0}
        commentCount={commentCount}
        isLoading={isLoading}
      />
      <div className={styles.contentContainer}>
        <DashboardProgressOverview progressData={progressData} />
        <DashboardActivityOverview activityData={activityData} />
      </div>
    </div>
  );
};

export default AuditorDashboard;
