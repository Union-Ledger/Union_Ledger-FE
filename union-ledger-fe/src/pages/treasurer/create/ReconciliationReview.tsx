import { useEffect, useMemo, useState } from "react";
import * as styles from "./Create.css";
import useSettlementApi, {
  type ReconciliationResult,
  type ReconciliationRunResponse,
  type ReconciliationStatus,
} from "@/hooks/useSettlementApi";

type ReviewFilter = "all" | "matched" | "issue";

interface ReconciliationReviewProps {
  onBack: () => void;
}

const statusLabelMap: Record<ReconciliationStatus, string> = {
  matched: "매칭",
  amount_mismatch: "금액 불일치",
  date_mismatch: "날짜 불일치",
  missing_bank_transaction: "거래내역 누락",
  missing_evidence: "증빙 누락",
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("ko-KR");
};

const formatShortId = (id: string | null) => {
  if (!id) return "-";

  return id.slice(0, 8);
};

const isIssueResult = (item: ReconciliationResult) => {
  return item.status !== "matched";
};

const ReconciliationReview = ({ onBack }: ReconciliationReviewProps) => {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>("all");
  const [reconciliationData, setReconciliationData] =
    useState<ReconciliationRunResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { postReconciliationRun } = useSettlementApi();
  const [postReconciliationRunOnce] = useState(() => postReconciliationRun);

  useEffect(() => {
    const runReconciliation = async () => {
      const settlementId = localStorage.getItem("currentSettlementId");

      if (!settlementId) {
        setErrorMessage("결산안 정보가 없습니다. 먼저 증빙을 업로드해주세요.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await postReconciliationRunOnce(settlementId);
        setReconciliationData(data);
      } catch (error) {
        console.error("자동 대조 실행 실패", error);
        setErrorMessage("거래내역 대조를 실행하지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    runReconciliation();
  }, [postReconciliationRunOnce]);

  const reconciliationItems = useMemo(() => {
    return reconciliationData?.results ?? [];
  }, [reconciliationData]);
  const totalCount = reconciliationData?.total ?? reconciliationItems.length;
  const matchedCount =
    reconciliationData?.matched ??
    reconciliationItems.filter((item) => item.status === "matched").length;
  const issueCount = Math.max(totalCount - matchedCount, 0);

  const filteredItems = useMemo(() => {
    if (selectedFilter === "matched") {
      return reconciliationItems.filter((item) => item.status === "matched");
    }

    if (selectedFilter === "issue") {
      return reconciliationItems.filter(isIssueResult);
    }

    return reconciliationItems;
  }, [reconciliationItems, selectedFilter]);

  const canGenerate = !isLoading && !errorMessage && issueCount === 0;

  const handleGenerate = () => {
    if (!canGenerate) return;

    console.log("결산안 생성");
  };

  return (
    <div className={styles.reconciliationBox}>
      <div className={styles.reconciliationTitleBox}>
        <div>
          <div className={styles.reconciliationTitle}>
            <span className={styles.reconciliationIcon}>⊙</span>
            거래내역 vs 결산안 검토
          </div>
          <div className={styles.reconciliationDescription}>
            생성 전에 모든 거래내역이 올바르게 반영되었는지 확인하세요
          </div>
        </div>
      </div>

      <div className={styles.reconciliationTabBox}>
        <button
          type="button"
          className={`${styles.reconciliationTab} ${
            selectedFilter === "all" ? styles.reconciliationTabActive : ""
          }`}
          onClick={() => setSelectedFilter("all")}
        >
          전체 ({totalCount})
        </button>

        <button
          type="button"
          className={`${styles.reconciliationTab} ${
            selectedFilter === "matched" ? styles.reconciliationTabActive : ""
          }`}
          onClick={() => setSelectedFilter("matched")}
        >
          매칭 ({matchedCount})
        </button>

        <button
          type="button"
          className={`${styles.reconciliationTab} ${
            selectedFilter === "issue" ? styles.reconciliationTabActive : ""
          }`}
          onClick={() => setSelectedFilter("issue")}
        >
          문제 ({issueCount})
        </button>
      </div>

      <div className={styles.reconciliationList}>
        {isLoading ? (
          <div className={styles.reconciliationEmpty}>
            거래내역과 증빙을 대조하는 중입니다.
          </div>
        ) : errorMessage ? (
          <div className={styles.reconciliationEmpty}>{errorMessage}</div>
        ) : filteredItems.length === 0 ? (
          <div className={styles.reconciliationEmpty}>
            표시할 대조 결과가 없습니다.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isMatched = item.status === "matched";

            return (
              <div
                key={item.id}
                className={`${styles.reconciliationItem} ${
                  isMatched
                    ? styles.reconciliationItemMatched
                    : styles.reconciliationItemIssue
                }`}
              >
                <div className={styles.reconciliationItemTop}>
                  <span className={styles.reconciliationDate}>
                    {formatDate(item.created_at)}
                  </span>
                  <span className={styles.reconciliationCategory}>
                    {statusLabelMap[item.status]}
                  </span>
                  <span
                    className={
                      isMatched
                        ? styles.reconciliationCheckIcon
                        : styles.reconciliationWarningIcon
                    }
                  >
                    {isMatched ? "✓" : "△"}
                  </span>
                </div>

                <div className={styles.reconciliationMerchant}>
                  증빙 {formatShortId(item.evidence_id)} · 거래내역{" "}
                  {formatShortId(item.bank_transaction_id)}
                </div>

                {item.notes && (
                  <div className={styles.reconciliationIssueMessage}>
                    {isMatched ? "메모" : "△"} {item.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {reconciliationData && (
        <div className={styles.reconciliationStatsBox}>
          <div className={styles.reconciliationStatsItem}>
            금액 불일치 {reconciliationData.amount_mismatch}건
          </div>
          <div className={styles.reconciliationStatsItem}>
            날짜 불일치 {reconciliationData.date_mismatch}건
          </div>
          <div className={styles.reconciliationStatsItem}>
            거래내역 누락 {reconciliationData.missing_bank_transaction}건
          </div>
          <div className={styles.reconciliationStatsItem}>
            증빙 누락 {reconciliationData.missing_evidence}건
          </div>
        </div>
      )}

      <div className={styles.reconciliationFooter}>
        <button
          type="button"
          className={styles.reconciliationBackButton}
          onClick={onBack}
        >
          뒤로
        </button>

        <button
          type="button"
          className={styles.reconciliationGenerateButton}
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          {canGenerate ? "결산안 생성하기" : "문제 해결 후 생성 가능"}
        </button>
      </div>
    </div>
  );
};

export default ReconciliationReview;
