import ReviewCard, {
  type StudentCouncilSubmission,
} from "@/components/auditor/ReviewCard";
import * as styles from "@/pages/auditor/review/Review.css";

const Review = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>결산안 검토</span>
        <span className={styles.desc}>
          제출된 결산안을 검토하고 승인 또는 반려하세요
        </span>
      </div>
      <div className={styles.contentContainer}>
        {dummyData.map((data) => (
          <ReviewCard key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Review;

const dummyData: StudentCouncilSubmission[] = [
  {
    id: 1,
    department: "컴퓨터공학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-03-18",
    status: "SUBMITTED",
    statusLabel: "제출됨",
    totalAmount: 8420000,
    receiptCount: 47,
  },
  {
    id: 2,
    department: "전자공학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-03-15",
    status: "REVIEWING",
    statusLabel: "검사중",
    totalAmount: 6200000,
    receiptCount: 38,
  },
  {
    id: 3,
    department: "경영학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-03-10",
    status: "APPROVED",
    statusLabel: "승인",
    totalAmount: 9150000,
    receiptCount: 52,
  },
  {
    id: 4,
    department: "산업공학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-03-09",
    status: "REJECTED",
    statusLabel: "반려",
    totalAmount: 4780000,
    receiptCount: 29,
  },
  {
    id: 5,
    department: "화학공학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-03-07",
    status: "APPROVED",
    statusLabel: "승인",
    totalAmount: 7350000,
    receiptCount: 41,
  },
  {
    id: 6,
    department: "기계공학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-03-05",
    status: "SUBMITTED",
    statusLabel: "제출됨",
    totalAmount: 5680000,
    receiptCount: 33,
  },
  {
    id: 7,
    department: "신소재공학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-03-03",
    status: "REVIEWING",
    statusLabel: "검사중",
    totalAmount: 6890000,
    receiptCount: 45,
  },
  {
    id: 8,
    department: "미디어커뮤니케이션학과 학생회",
    semester: "2024-2학기",
    submittedAt: "2026-02-28",
    status: "APPROVED",
    statusLabel: "승인",
    totalAmount: 10250000,
    receiptCount: 61,
  },
];
