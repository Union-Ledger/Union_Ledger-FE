import buttonIcon from "@/assets/review/button-icon.svg";
import rightArrow from "@/assets/review/right-arrow.svg";
import * as styles from "./ReviewCard.css";
import { useNavigate } from "react-router-dom";

type SubmissionStatus = "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED";

type SubmissionStatusLabel = "제출됨" | "검사중" | "승인" | "반려";

export interface StudentCouncilSubmission {
  id: number;
  department: string;
  semester: string;
  submittedAt: string;
  status: SubmissionStatus;
  statusLabel: SubmissionStatusLabel;
  totalAmount: number;
  receiptCount: number;
}

const ReviewCard = ({ data }: { data: StudentCouncilSubmission }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.titleWrapper}>
          <span className={styles.title}>{data.department}</span>
          <div
            className={`${styles.status} ${styles.statusVariant[data.status]}`}
          >
            {data.statusLabel}
          </div>
        </div>
        <button
          className={styles.button}
          onClick={() => navigate(`/auditor/review/detail/${data.id}`)}
        >
          <img src={buttonIcon} alt="검토 시작" />
          <span>검토 시작</span>
          <img src={rightArrow} alt="화살표" />
        </button>
      </div>

      <span className={styles.desc}>
        {data.semester} | 제출일: {data.submittedAt}
      </span>

      <div className={styles.infoContainer}>
        <div className={`${styles.infoItem} ${styles.infoItemVariant.amount}`}>
          <span
            className={`${styles.infoTitle} ${styles.infoTitleVariant.amount}`}
          >
            총 지출액
          </span>
          <span
            className={`${styles.infoContent} ${styles.infoContentVariant.amount}`}
          >
            {data.totalAmount.toLocaleString()}원
          </span>
        </div>

        <div className={`${styles.infoItem} ${styles.infoItemVariant.receipt}`}>
          <span
            className={`${styles.infoTitle} ${styles.infoTitleVariant.receipt}`}
          >
            증빙 건수
          </span>
          <span
            className={`${styles.infoContent} ${styles.infoContentVariant.receipt}`}
          >
            {data.receiptCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
