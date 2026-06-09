import {
  alarm,
  checkCircle,
  people,
  receipt,
} from "@/assets/dashboard";
import * as styles from "./PresidentDashboardCards.css";

interface PresidentDashboardCardsProps {
  teamMemberCount: number;
  submittedSettlementCount: number;
  auditCompletedCount: number;
  reviewPendingCount: number;
}

const PresidentDashboardCards = ({
  teamMemberCount,
  submittedSettlementCount,
  auditCompletedCount,
  reviewPendingCount,
}: PresidentDashboardCardsProps) => {
  const cards = [
    {
      id: "team" as const,
      icon: people,
      title: "팀 구성원",
      content: `${teamMemberCount}명`,
    },
    {
      id: "submitted" as const,
      icon: receipt,
      title: "제출된 결산안",
      content: `${submittedSettlementCount}건`,
    },
    {
      id: "completed" as const,
      icon: checkCircle,
      title: "감사 완료",
      content: `${auditCompletedCount}건`,
    },
    {
      id: "pending" as const,
      icon: alarm,
      title: "검토 대기",
      content: `${reviewPendingCount}건`,
    },
  ];

  return (
    <div className={styles.container}>
      {cards.map((card) => (
        <div key={card.id} className={styles.card}>
          <div
            className={`${styles.iconContainer} ${styles.iconVariant[card.id]}`}
          >
            <img
              className={styles.icon}
              src={card.icon}
              alt=""
              aria-hidden="true"
            />
          </div>
          <span className={styles.cardTitle}>{card.title}</span>
          <strong className={styles.cardContent}>{card.content}</strong>
        </div>
      ))}
    </div>
  );
};

export default PresidentDashboardCards;
