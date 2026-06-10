import type { PresidentTreasurerWork } from "@/hooks/useDashboardApi";
import {
  formatPresidentDashboardDate,
  formatPresidentDashboardMoney,
} from "./presidentDashboardFormatters";
import * as styles from "./PresidentDashboardSections.css";

interface PresidentSettlementStatusProps {
  settlements: PresidentTreasurerWork[];
  publishingSettlementId: string | null;
  onPublish: (settlementId: string) => void;
}

const getStatusTone = (status: string) => {
  if (["approved", "published", "audited"].includes(status)) return "complete";
  if (["submitted", "under_audit", "ready_for_review"].includes(status)) {
    return "submitted";
  }
  return "progress";
};

const PresidentSettlementStatus = ({
  settlements,
  publishingSettlementId,
  onPublish,
}: PresidentSettlementStatusProps) => {
  return (
    <section className={styles.panel}>
      <h2 className={styles.sectionTitle}>결산안 현황</h2>

      {settlements.length === 0 ? (
        <div className={styles.emptyState}>진행 중인 결산안이 없습니다.</div>
      ) : (
        <div className={styles.reportList}>
          {settlements.map((settlement) => {
            const progress = Math.min(
              100,
              Math.max(0, settlement.progress_percent),
            );
            const isPublished =
              settlement.status === "published" ||
              settlement.status_label.includes("공개 완료");
            const canPublish =
              settlement.status === "approved" && !isPublished;

            return (
              <article
                key={settlement.settlement_id}
                className={styles.reportItem}
              >
                <div className={styles.reportTitleRow}>
                  <h3 className={styles.reportTitle}>{settlement.title}</h3>
                  <span
                    className={styles.statusBadge({
                      tone: getStatusTone(settlement.status),
                    })}
                  >
                    {settlement.status_label}
                  </span>
                </div>
                <p className={styles.semesterLabel}>
                  {settlement.semester_label ||
                    `${settlement.academic_year}-${settlement.semester}`}
                </p>

                <div className={styles.progressMeta}>
                  <span>작업 진행률</span>
                  <strong className={styles.progressValue}>{progress}%</strong>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className={styles.reportStats}>
                  <div>
                    <span className={styles.reportStatLabel}>총 지출액</span>
                    <strong className={styles.reportStatValue}>
                      {formatPresidentDashboardMoney(settlement.total_expense)}
                    </strong>
                  </div>
                  <div>
                    <span className={styles.reportStatLabel}>증빙 건수</span>
                    <strong className={styles.reportStatValue}>
                      {settlement.evidence_count}건
                    </strong>
                  </div>
                  <div>
                    <span className={styles.reportStatLabel}>최종 수정</span>
                    <strong className={styles.reportStatValue}>
                      {formatPresidentDashboardDate(
                        settlement.last_activity_at,
                      )}
                    </strong>
                  </div>
                </div>

                <p className={styles.reportFooter}>
                  제출일:{" "}
                  {formatPresidentDashboardDate(settlement.submitted_at)}
                </p>

                {canPublish && (
                  <button
                    type="button"
                    className={styles.publishButton}
                    disabled={
                      publishingSettlementId === settlement.settlement_id
                    }
                    onClick={() => onPublish(settlement.settlement_id)}
                  >
                    {publishingSettlementId === settlement.settlement_id
                      ? "공개 중..."
                      : "결산안 공개하기"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PresidentSettlementStatus;
