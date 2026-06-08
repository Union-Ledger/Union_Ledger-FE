import { questionCircle } from "@/assets/dashboard";
import * as styles from "@components/student/StudentDashboardQuestion.css";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

const faqDummyData: FaqItem[] = [
  {
    id: 1,
    question: "결산안은 언제 공개되나요?",
    answer: "감사 승인 후 즉시 공개됩니다.",
  },
  {
    id: 2,
    question: "증빙자료도 확인할 수 있나요?",
    answer: "네, 각 지출 항목의 영수증을 확인할 수 있습니다.",
  },
  {
    id: 3,
    question: "문의사항은 어디로 하나요?",
    answer: "학생회 이메일로 문의해주세요.",
  },
];

const StudentDashboardQuestion = () => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>
        <img src={questionCircle} alt="Question" /> <span>자주 묻는 질문</span>
      </span>
      <div className={styles.contentContainer}>
        {faqDummyData.map((item) => (
          <div key={item.id} className={styles.faqItem}>
            <p className={styles.question}>
              <span className={styles.questionHighlight}>Q.</span>{" "}
              {item.question}
            </p>
            <p className={styles.answer}>
              <span className={styles.answerHighlight}>A.</span> {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboardQuestion;
