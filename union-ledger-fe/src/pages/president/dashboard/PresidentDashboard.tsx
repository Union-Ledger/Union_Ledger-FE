import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/constant/router";
import useDashboardApi, {
  type PresidentDashboardResponse,
} from "@/hooks/useDashboardApi";
import PresidentDashboardCards from "@/components/president/PresidentDashboardCards";
import PresidentSettlementStatus from "@/components/president/PresidentSettlementStatus";
import PresidentAuditorActivity from "@/components/president/PresidentAuditorActivity";
import PresidentTeamMembers from "@/components/president/PresidentTeamMembers";
import PresidentOrganizationInfo from "@/components/president/PresidentOrganizationInfo";
import * as styles from "./PresidentDashboard.css";

const PresidentDashboard = () => {
  const navigate = useNavigate();
  const { getPresidentDashboard } = useDashboardApi();
  const [getPresidentDashboardOnce] = useState(() => getPresidentDashboard);
  const [dashboard, setDashboard] =
    useState<PresidentDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getPresidentDashboardOnce(undefined, 10);
        setDashboard(response ?? null);
      } catch (error) {
        console.error("회장 대시보드 조회 실패", error);
        setErrorMessage("대시보드 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [getPresidentDashboardOnce]);

  if (isLoading) {
    return (
      <div className={styles.stateBox}>회장 대시보드를 불러오는 중입니다.</div>
    );
  }

  if (errorMessage || !dashboard) {
    return (
      <div className={styles.stateBox}>
        {errorMessage || "표시할 대시보드 정보가 없습니다."}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.titleContainer}>
        <h1 className={styles.title}>회장 대시보드</h1>
        <p className={styles.desc}>
          {dashboard.organization.name}의 결산 업무 진행 상황을 확인하세요
        </p>
      </header>

      <PresidentDashboardCards
        teamMemberCount={dashboard.team_member_count}
        submittedSettlementCount={dashboard.submitted_settlement_count}
        auditCompletedCount={dashboard.audit_completed_count}
        reviewPendingCount={dashboard.review_pending_count}
      />

      <PresidentSettlementStatus settlements={dashboard.treasurer_work} />

      <PresidentAuditorActivity auditors={dashboard.auditor_activity} />

      <div className={styles.bottomGrid}>
        <PresidentTeamMembers
          members={dashboard.members}
          onInvite={() => navigate(ROUTES.PRESIDENT_INVITE)}
        />
        <PresidentOrganizationInfo organization={dashboard.organization} />
      </div>
    </div>
  );
};

export default PresidentDashboard;
