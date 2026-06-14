import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/constant/router";
import * as styles from "./PresidentOnboarding.css";

const STEPS = [
  {
    n: 1,
    title: "팀원 초대",
    desc: "재정담당자와 감사위원을 초대해 역할을 배정하세요.",
  },
  {
    n: 2,
    title: "결산안 작성·제출",
    desc: "재정담당자가 증빙을 올리고 결산안을 작성해 감사위원에게 제출합니다.",
  },
  {
    n: 3,
    title: "공개",
    desc: "감사 승인된 결산안을 학우에게 공개합니다.",
  },
];

// 신규 회장(팀원 0명) 첫 실행 안내 — 빈 대시보드 대신 다음 행동을 제시한다.
const PresidentOnboarding = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.card} aria-label="시작하기 안내">
      <h2 className={styles.title}>학생회 결산, 이렇게 시작하세요</h2>
      <p className={styles.subtitle}>
        아직 팀원이 없어요. 아래 순서로 결산 업무를 시작할 수 있습니다.
      </p>
      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li className={styles.step} key={step.n}>
            <span className={styles.num}>{step.n}</span>
            <div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.desc}</div>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className={styles.cta}
        onClick={() => navigate(ROUTES.PRESIDENT_INVITE)}
      >
        팀원 초대하러 가기 →
      </button>
    </section>
  );
};

export default PresidentOnboarding;
