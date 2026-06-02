import {
  receipt,
  trendingUp,
  alertCircle,
  checkCircle,
} from "@assets/dashboard";
import * as styles from "@/components/dashboard/DashboardCards.css";

interface DashboardCardsProps {
  totalEvidenceCount: number;
  totalEvidenceAmount: number;
  matchedCount: number;
  unmatchedCount: number;
  progressPercent: number;
}

type DashboardCardItem = {
  id: "receipt" | "expense" | "unmatched" | "audit";
  icon: string;
  title: string;
  content: string;
};

const formatMoney = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

const DashboardCards = ({
  totalEvidenceCount,
  totalEvidenceAmount,
  matchedCount,
  unmatchedCount,
  progressPercent,
}: DashboardCardsProps) => {
  const auditStatus =
    unmatchedCount > 0
      ? "확인 필요"
      : progressPercent >= 100
        ? "완료"
        : matchedCount > 0
          ? "진행중"
          : "준비중";

  const dashboardCardData: DashboardCardItem[] = [
    {
      id: "receipt",
      icon: receipt,
      title: "등록된 증빙",
      content: `${totalEvidenceCount}건`,
    },
    {
      id: "expense",
      icon: trendingUp,
      title: "총 지출액",
      content: formatMoney(totalEvidenceAmount),
    },
    {
      id: "unmatched",
      icon: alertCircle,
      title: "미매칭",
      content: `${unmatchedCount}건`,
    },
    {
      id: "audit",
      icon: checkCircle,
      title: "감사 상태",
      content: auditStatus,
    },
  ];

  return (
    <div className={styles.container}>
      {dashboardCardData.map((card) => (
        <div key={card.id} className={styles.card}>
          <div
            className={`${styles.iconContainer} ${styles.iconVariant[card.id]}`}
          >
            <img src={card.icon} alt="대시보드 요약 카드 아이콘" />
          </div>
          <span className={styles.cardTitle}>{card.title}</span>
          <span className={styles.cardContent}>{card.content}</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
