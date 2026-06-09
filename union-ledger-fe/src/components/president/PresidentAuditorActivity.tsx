import type { PresidentAuditorActivity as AuditorActivity } from "@/hooks/useDashboardApi";
import { formatPresidentDashboardRelativeTime } from "./presidentDashboardFormatters";
import * as styles from "./PresidentDashboardSections.css";

interface PresidentAuditorActivityProps {
  auditors: AuditorActivity[];
}

const PresidentAuditorActivity = ({
  auditors,
}: PresidentAuditorActivityProps) => {
  return (
    <section className={styles.panel}>
      <div className={styles.auditTitleRow}>
        <h2 className={styles.sectionTitle}>감사위원 활동 현황</h2>
        <span className={styles.estimateBadge}>추정치</span>
      </div>
      <p className={styles.sectionDescription}>
        활동 데이터 기반 추정값입니다. 실제 배정/검토 수와 다를 수 있습니다.
      </p>

      {auditors.length === 0 ? (
        <div className={styles.emptyState}>감사위원 활동 내역이 없습니다.</div>
      ) : (
        <div className={styles.auditList}>
          {auditors.map((auditor) => (
            <article key={auditor.user_id} className={styles.auditItem}>
              <div className={styles.auditHeader}>
                <div>
                  <h3 className={styles.memberName}>{auditor.name}</h3>
                  <p className={styles.memberEmail}>{auditor.email}</p>
                </div>
                <div className={styles.recentActivity}>
                  <span>최근 활동</span>
                  <strong className={styles.recentActivityValue}>
                    {formatPresidentDashboardRelativeTime(
                      auditor.last_activity_at,
                    )}
                  </strong>
                </div>
              </div>
              <div className={styles.auditStats}>
                <div className={styles.auditStatItem}>
                  <span className={styles.auditStatLabel}>
                    검토 완료 (추정)
                  </span>
                  <strong className={styles.auditCompletedValue}>
                    {auditor.completed_count}건
                  </strong>
                </div>
                <div className={styles.auditStatItem}>
                  <span className={styles.auditStatLabel}>
                    평균 검토 시간 (추정)
                  </span>
                  <strong className={styles.auditDaysValue}>
                    {auditor.avg_review_days}일
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default PresidentAuditorActivity;
