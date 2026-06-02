import { useMemo, useState } from "react";
import * as styles from "./Create.css";
import { reconciliationItems } from "@pages/treasurer/create/reconciliationData";

type ReviewFilter = "all" | "matched" | "issue";

interface ReconciliationReviewProps {
  onBack: () => void;
}

const formatMoney = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

const ReconciliationReview = ({ onBack }: ReconciliationReviewProps) => {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>("all");

  const matchedCount = reconciliationItems.filter(
    (item) => item.status === "matched",
  ).length;

  const issueCount = reconciliationItems.filter(
    (item) => item.status === "issue",
  ).length;

  const filteredItems = useMemo(() => {
    if (selectedFilter === "matched") {
      return reconciliationItems.filter((item) => item.status === "matched");
    }

    if (selectedFilter === "issue") {
      return reconciliationItems.filter((item) => item.status === "issue");
    }

    return reconciliationItems;
  }, [selectedFilter]);

  const canGenerate = issueCount === 0;

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
          전체 ({reconciliationItems.length})
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
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.reconciliationItem} ${
              item.status === "matched"
                ? styles.reconciliationItemMatched
                : styles.reconciliationItemIssue
            }`}
          >
            <div className={styles.reconciliationItemTop}>
              <span className={styles.reconciliationDate}>{item.date}</span>
              <span className={styles.reconciliationCategory}>
                {item.category}
              </span>
              <span
                className={
                  item.status === "matched"
                    ? styles.reconciliationCheckIcon
                    : styles.reconciliationWarningIcon
                }
              >
                {item.status === "matched" ? "✓" : "△"}
              </span>
            </div>

            <div className={styles.reconciliationMerchant}>
              {item.merchantName}
            </div>

            <div className={styles.reconciliationAmount}>
              {formatMoney(item.amount)}
            </div>

            {item.issueMessage && (
              <div className={styles.reconciliationIssueMessage}>
                △ {item.issueMessage}
              </div>
            )}
          </div>
        ))}
      </div>

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
