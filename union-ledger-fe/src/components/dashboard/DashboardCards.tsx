import {
  receipt,
  trendingUp,
  alertCircle,
  checkCircle,
} from "@assets/dashboard";
import * as styles from "@/components/dashboard/DashboardCards.css";

type DashboardCardItem = {
  id: "receipt" | "expense" | "unmatched" | "audit";
  icon: string;
  title: string;
  content: string;
};

const DashboardCards = () => {
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

const dashboardCardData: DashboardCardItem[] = [
  {
    id: "receipt",
    icon: receipt,
    title: "등록된 증빙",
    content: "47건",
  },
  {
    id: "expense",
    icon: trendingUp,
    title: "총 지출액",
    content: "₩8,420,000",
  },
  {
    id: "unmatched",
    icon: alertCircle,
    title: "미매칭",
    content: "3건",
  },
  {
    id: "audit",
    icon: checkCircle,
    title: "감사 상태",
    content: "검토중",
  },
];
