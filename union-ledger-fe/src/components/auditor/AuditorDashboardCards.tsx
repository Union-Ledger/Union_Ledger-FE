import { alertCircle, alarm, comment, reject } from "@assets/dashboard";
import * as styles from "@/components/auditor/AuditorDashboardCards.css";

type DashboardCardItem = {
  id: "pendingReview" | "approved" | "rejected" | "writtenComments";
  icon: string;
  title: string;
  content: string;
};

interface AuditorDashboardCardsProps {
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  commentCount: number;
  isLoading?: boolean;
}

const AuditorDashboardCards = ({
  pendingCount,
  inProgressCount,
  completedCount,
  commentCount,
  isLoading = false,
}: AuditorDashboardCardsProps) => {
  const dashboardCardData: DashboardCardItem[] = [
    {
      id: "pendingReview",
      icon: alarm,
      title: "검토 대기",
      content: isLoading ? "-" : `${pendingCount}건`,
    },
    {
      id: "approved",
      icon: alertCircle,
      title: "진행 중",
      content: isLoading ? "-" : `${inProgressCount}건`,
    },
    {
      id: "rejected",
      icon: reject,
      title: "검토 완료",
      content: isLoading ? "-" : `${completedCount}건`,
    },
    {
      id: "writtenComments",
      icon: comment,
      title: "작성 코멘트",
      content: isLoading ? "-" : `${commentCount}개`,
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

export default AuditorDashboardCards;
