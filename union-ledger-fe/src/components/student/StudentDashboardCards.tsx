import { receipt, trendingUp, callender } from "@assets/dashboard";
import eye from "@assets/dashboard/eye.svg";
import * as styles from "@/components/student/StudentDashboardCards.css";

interface StudentDashboardCardsProps {
  totalEvidenceCount: number;
  totalEvidenceAmount: number;
  matchedCount?: number;
  unmatchedCount?: number;
  progressPercent?: number;
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
  description: string;
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
      description: "감사 승인 후 공개된 결산안",
    },
    {
      id: "semesterExpense",
      variant: "semesterExpense",
      icon: trendingUp,
      title: "이번 학기 지출",
      content: formatMoney(totalEvidenceAmount),
      description: "현재 공개 학기 기준 총 지출",
    },
    {
      id: "recentApprovalDate",
      variant: "recentApprovalDate",
      icon: callender,
      title: "최근 승인일",
      content: formatDate(recentApprovedAt),
      description: "가장 최근 감사 완료일",
    },
    {
      id: "viewCount",
      variant: "viewCount",
      icon: eye,
      title: "조회수",
      content: `${viewCount.toLocaleString("ko-KR")}회`,
      description: "학생들이 확인한 누적 열람",
    },
  ];

  return (
    <section className={styles.container} aria-label="학생 결산 요약">
      {dashboardCardData.map((card) => (
        <article key={card.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div
              className={`${styles.iconContainer} ${
                styles.iconVariant[card.variant]
              }`}
              aria-hidden="true"
            >
              <img src={card.icon} alt="" />
            </div>
            <span className={styles.cardTitle}>{card.title}</span>
          </div>
          <span className={styles.cardContent}>{card.content}</span>
          <span className={styles.cardDescription}>{card.description}</span>
        </article>
      ))}
    </section>
  );
};

export default StudentDashboardCards;
