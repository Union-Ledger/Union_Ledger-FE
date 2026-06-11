import { useState } from "react";
import { questionCircle } from "@/assets/dashboard";
import * as styles from "@components/student/StudentDashboardQuestion.css";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    id: "published-timing",
    question: "결산안은 언제 공개되나요?",
    answer:
      "재정담당자가 결산안을 제출하고 감사위원이 승인하면 학생 화면에 공개됩니다.",
  },
  {
    id: "evidence",
    question: "증빙자료도 확인할 수 있나요?",
    answer:
      "네. 공개된 결산안의 상세 화면에서 항목별 영수증과 결산 산출물을 확인할 수 있습니다.",
  },
  {
    id: "question-route",
    question: "문의사항은 어디로 하나요?",
    answer:
      "금액이나 증빙이 이상해 보이면 소속 학생회에 먼저 문의하고, 감사 결과 코멘트도 함께 확인해 주세요.",
  },
];

const StudentDashboardQuestion = () => {
  const [openId, setOpenId] = useState(faqItems[0].id);

  return (
    <section className={styles.container} aria-labelledby="student-faq-title">
      <h2 className={styles.title} id="student-faq-title">
        <img src={questionCircle} alt="" aria-hidden="true" />
        <span>자주 묻는 질문</span>
      </h2>
      <div className={styles.contentContainer}>
        {faqItems.map((item) => (
          <div key={item.id} className={styles.faqItem}>
            <button
              className={styles.questionButton}
              type="button"
              aria-expanded={openId === item.id}
              aria-controls={`${item.id}-answer`}
              onClick={() =>
                setOpenId((currentId) =>
                  currentId === item.id ? "" : item.id,
                )
              }
            >
              <span className={styles.question}>
                <span className={styles.questionHighlight}>Q.</span>
                {item.question}
              </span>
              <span className={styles.toggleIcon} aria-hidden="true">
                {openId === item.id ? "−" : "+"}
              </span>
            </button>
            {openId === item.id && (
              <p className={styles.answer} id={`${item.id}-answer`}>
                <span className={styles.answerHighlight}>A.</span> {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentDashboardQuestion;
