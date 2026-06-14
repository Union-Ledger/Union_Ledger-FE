import { useMemo } from "react";
import type { PeriodSettlementCard } from "@/hooks/useDashboardApi";
import { formatKrw } from "@/utils/format";
import * as styles from "./StudentDashboardComparison.css";

const MAX_ROWS = 6;

const toAmount = (value: string | null | undefined) => {
  if (value == null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

interface StudentDashboardComparisonProps {
  cards: PeriodSettlementCard[];
  periodLabel?: string;
}

// 같은 학기 단과대 내 학생회들의 지출을 비교 — "이 금액이 적절한가?"의 기준선 제공.
const StudentDashboardComparison = ({
  cards,
  periodLabel,
}: StudentDashboardComparisonProps) => {
  const { rows, average, myAmount, hasMyOrg, maxAmount } = useMemo(() => {
    const published = cards
      .filter((card) => card.is_published && card.total_amount != null)
      .map((card) => ({
        id: card.organization_id,
        name: card.organization_name || `${card.department_name} 학생회`,
        amount: toAmount(card.total_amount),
        isMine: card.is_my_organization,
      }));

    const total = published.reduce((sum, card) => sum + card.amount, 0);
    const avg = published.length > 0 ? total / published.length : 0;
    const max = published.reduce((acc, card) => Math.max(acc, card.amount), 0);
    const mine = published.find((card) => card.isMine);

    // 우리 학과를 먼저, 그다음 지출 큰 순으로 정렬
    const sorted = [...published].sort((a, b) => {
      if (a.isMine !== b.isMine) return a.isMine ? -1 : 1;
      return b.amount - a.amount;
    });

    return {
      rows: sorted.slice(0, MAX_ROWS),
      average: avg,
      myAmount: mine?.amount ?? 0,
      hasMyOrg: Boolean(mine),
      maxAmount: max,
    };
  }, [cards]);

  // 비교 대상이 2곳 미만이면 비교 자체가 무의미하므로 표시하지 않음
  if (rows.length < 2) return null;

  const deltaPercent =
    hasMyOrg && average > 0
      ? Math.round(((myAmount - average) / average) * 100)
      : null;

  return (
    <section className={styles.container} aria-label="단과대 결산 비교">
      <div className={styles.header}>
        <h2 className={styles.title}>우리 학과 vs 단과대 비교</h2>
        {periodLabel && <span className={styles.period}>{periodLabel}</span>}
      </div>

      {deltaPercent !== null && (
        <p className={styles.summary}>
          단과대 평균{" "}
          <strong className={styles.summaryStrong}>{formatKrw(Math.round(average))}</strong> 대비 우리 학과는{" "}
          <strong className={deltaPercent > 0 ? styles.deltaUp : styles.deltaDown}>
            {deltaPercent > 0 ? "+" : ""}
            {deltaPercent}%
          </strong>{" "}
          입니다.
        </p>
      )}

      <ul className={styles.list}>
        {rows.map((row) => {
          const width =
            maxAmount > 0 ? Math.round((row.amount / maxAmount) * 100) : 0;

          return (
            <li className={styles.row} key={row.id}>
              <div className={styles.rowHead}>
                <span className={styles.orgName}>
                  {row.name}
                  {row.isMine && <span className={styles.mineBadge}>우리 학과</span>}
                </span>
                <span className={styles.amount}>{formatKrw(row.amount)}</span>
              </div>
              <div className={styles.track}>
                <div
                  className={row.isMine ? styles.barMine : styles.bar}
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default StudentDashboardComparison;
