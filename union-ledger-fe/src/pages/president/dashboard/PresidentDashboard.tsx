import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/constant/router";
import useDashboardApi, {
  type PresidentDashboardResponse,
} from "@/hooks/useDashboardApi";
import useSettlementApi from "@/hooks/useSettlementApi";
import { useConfirm, useToast } from "@shared/components/feedback";
import PresidentDashboardCards from "@/components/president/PresidentDashboardCards";
import PresidentSettlementStatus from "@/components/president/PresidentSettlementStatus";
import PresidentAuditorActivity from "@/components/president/PresidentAuditorActivity";
import PresidentTeamMembers from "@/components/president/PresidentTeamMembers";
import PresidentOrganizationInfo from "@/components/president/PresidentOrganizationInfo";
import PresidentOnboarding from "@/components/president/PresidentOnboarding";
import * as styles from "./PresidentDashboard.css";

const PresidentDashboard = () => {
  const navigate = useNavigate();
  const { getPresidentDashboard } = useDashboardApi();
  const { postPublishSettlement } = useSettlementApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [getPresidentDashboardOnce] = useState(() => getPresidentDashboard);
  const [postPublishSettlementOnce] = useState(() => postPublishSettlement);
  const [dashboard, setDashboard] =
    useState<PresidentDashboardResponse | null>(null);
  const [publishingSettlementId, setPublishingSettlementId] = useState<
    string | null
  >(null);
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

  const handlePublish = async (settlementId: string) => {
    const target = dashboard?.treasurer_work.find(
      (settlement) => settlement.settlement_id === settlementId,
    );
    const confirmed = await confirm({
      title: "결산안을 공개할까요?",
      description: `공개하면 모든 학우가 ${
        target ? `'${target.title}' ` : ""
      }결산 내역을 열람할 수 있습니다. 공개 후에는 되돌릴 수 없습니다.`,
      confirmLabel: "공개하기",
      tone: "danger",
    });

    if (!confirmed) return;

    try {
      setPublishingSettlementId(settlementId);
      await postPublishSettlementOnce(settlementId);
      setDashboard((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          treasurer_work: prev.treasurer_work.map((settlement) =>
            settlement.settlement_id === settlementId
              ? {
                  ...settlement,
                  status: "published",
                  status_label: "공개 완료",
                }
              : settlement,
          ),
        };
      });
      toast.success("결산안이 공개되었습니다. 이제 학생들이 열람할 수 있어요.");
    } catch (error) {
      console.error("결산안 공개 실패", error);
      toast.error("결산안 공개에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setPublishingSettlementId(null);
    }
  };

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

      {dashboard.team_member_count === 0 && <PresidentOnboarding />}

      <PresidentDashboardCards
        teamMemberCount={dashboard.team_member_count}
        submittedSettlementCount={dashboard.submitted_settlement_count}
        auditCompletedCount={dashboard.audit_completed_count}
        reviewPendingCount={dashboard.review_pending_count}
      />

      <PresidentSettlementStatus
        settlements={dashboard.treasurer_work}
        publishingSettlementId={publishingSettlementId}
        onPublish={handlePublish}
      />

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
