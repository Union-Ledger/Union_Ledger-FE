import { useEffect, useMemo, useState } from "react";
import ReviewCard, {
  type StudentCouncilSubmission,
} from "@/components/auditor/ReviewCard";
import useAuditApi, {
  type AuditSettlementListItem,
} from "@/hooks/useAuditApi";
import * as styles from "@/pages/auditor/review/Review.css";

const parseAmount = (amount: string) => {
  const parsed = Number(amount);

  return Number.isFinite(parsed) ? Math.abs(parsed) : 0;
};

const getStatusMeta = (status: string) => {
  const statusMap: Record<
    string,
    {
      status: StudentCouncilSubmission["status"];
      statusLabel: StudentCouncilSubmission["statusLabel"];
    }
  > = {
    ready_for_review: { status: "SUBMITTED", statusLabel: "제출됨" },
    submitted: { status: "SUBMITTED", statusLabel: "제출됨" },
    resubmitted: { status: "SUBMITTED", statusLabel: "제출됨" },
    under_audit: { status: "REVIEWING", statusLabel: "검사중" },
    approved: { status: "APPROVED", statusLabel: "승인" },
    rejected: { status: "REJECTED", statusLabel: "반려" },
  };

  return statusMap[status] ?? { status: "SUBMITTED", statusLabel: "제출됨" };
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("ko-KR");
};

const createSubmission = (
  item: AuditSettlementListItem,
): StudentCouncilSubmission => {
  const statusMeta = getStatusMeta(item.status);
  const department = item.department_name || item.organization_name;

  return {
    id: item.settlement_id,
    department,
    semester: `${item.academic_year}-${item.semester}`,
    submittedAt: formatDate(item.submitted_at),
    status: statusMeta.status,
    statusLabel: statusMeta.statusLabel,
    totalAmount: parseAmount(item.total_evidence_amount),
    receiptCount: item.evidence_count,
  };
};

const Review = () => {
  const { getAuditSettlements } = useAuditApi();

  const [settlements, setSettlements] = useState<AuditSettlementListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [getAuditSettlementsOnce] = useState(() => getAuditSettlements);

  useEffect(() => {
    const loadSettlements = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getAuditSettlementsOnce();
        setSettlements(data);
      } catch (error) {
        console.error("감사 결산안 목록 조회 실패", error);
        setErrorMessage("결산안 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettlements();
  }, [getAuditSettlementsOnce]);

  const reviewItems = useMemo(() => {
    return settlements.map(createSubmission);
  }, [settlements]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>결산안 검토</span>
        <span className={styles.desc}>
          제출된 결산안을 검토하고 승인 또는 반려하세요
        </span>
      </div>
      <div className={styles.contentContainer}>
        {isLoading ? (
          <div className={styles.emptyBox}>결산안 목록을 불러오는 중입니다.</div>
        ) : errorMessage ? (
          <div className={styles.emptyBox}>{errorMessage}</div>
        ) : reviewItems.length === 0 ? (
          <div className={styles.emptyBox}>검토할 결산안이 없습니다.</div>
        ) : (
          reviewItems.map((data) => <ReviewCard key={data.id} data={data} />)
        )}
      </div>
    </div>
  );
};

export default Review;
