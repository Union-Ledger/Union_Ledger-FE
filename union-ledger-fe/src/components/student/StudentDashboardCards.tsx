import { receipt, trendingUp, callender } from "@assets/dashboard";
import eye from "@assets/dashboard/eye.svg";
import * as styles from "@/components/student/StudentDashboardCards.css";

interface StudentDashboardCardsProps {
  totalEvidenceCount: number;
  totalEvidenceAmount: number;
  recentApprovedAt?: string | null;
  viewCount?: number;
}

type StudentDashboardCardId =
  | "settlement"
  | "semesterExpense"
  | "recentApprovalDate"
  | "viewCount";

type StudentDashboardCardVariant =
  | "settlement"
  | "semesterExpense"
  | "recentApprovalDate"
  | "viewCount";

type StudentDashboardCardItem = {
  id: StudentDashboardCardId;
  variant: StudentDashboardCardVariant;
  icon: string;
  title: string;
  content: string;
};

const formatMoney = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const StudentDashboardCards = ({
  totalEvidenceCount,
  totalEvidenceAmount,
  recentApprovedAt,
  viewCount = 0,
}: StudentDashboardCardsProps) => {
  const dashboardCardData: StudentDashboardCardItem[] = [
    {
      id: "settlement",
      variant: "settlement",
      icon: receipt,
      title: "우리 학과 결산안",
      content: `${totalEvidenceCount}건`,
    },
    {
      id: "semesterExpense",
      variant: "semesterExpense",
      icon: trendingUp,
      title: "이번 학기 지출",
      content: formatMoney(totalEvidenceAmount),
    },
    {
      id: "recentApprovalDate",
      variant: "recentApprovalDate",
      icon: callender,
      title: "최근 승인일",
      content: formatDate(recentApprovedAt),
    },
    {
      id: "viewCount",
      variant: "viewCount",
      icon: eye,
      title: "조회수",
      content: `${viewCount.toLocaleString("ko-KR")}회`,
    },
  ];

  return (
    <div className={styles.container}>
      {dashboardCardData.map((card) => (
        <div key={card.id} className={styles.card}>
          <div
            className={`${styles.iconContainer} ${
              styles.iconVariant[card.variant]
            }`}
          >
            <img src={card.icon} alt={`${card.title} 아이콘`} />
          </div>
          <span className={styles.cardTitle}>{card.title}</span>
          <span className={styles.cardContent}>{card.content}</span>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboardCards;
