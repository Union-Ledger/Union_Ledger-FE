import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/constant/router";
import * as styles from "./TreasurerStepper.css";

const STEPS = [
  { label: "양식 등록", to: ROUTES.TEMPLATE },
  { label: "증빙 업로드", to: ROUTES.UPLOAD },
  { label: "거래내역 대조", to: ROUTES.COMPARE },
  { label: "결산안 생성", to: ROUTES.CREATE },
] as const;

type StepState = "done" | "current" | "upcoming";

// 재정 파이프라인(양식→업로드→대조→생성)의 현재 위치와 다음 단계를 항상 보여주는 진행 바.
const TreasurerStepper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = STEPS.findIndex((step) =>
    location.pathname.startsWith(step.to),
  );

  if (currentIndex === -1) return null;

  const next = STEPS[currentIndex + 1];

  return (
    <nav className={styles.container} aria-label="결산 작성 단계">
      <ol className={styles.list}>
        {STEPS.map((step, index) => {
          const state: StepState =
            index === currentIndex
              ? "current"
              : index < currentIndex
                ? "done"
                : "upcoming";

          return (
            <li className={styles.item} key={step.to}>
              <button
                type="button"
                className={styles.step}
                aria-current={state === "current" ? "step" : undefined}
                onClick={() => navigate(step.to)}
              >
                <span className={styles.num[state]}>
                  {state === "done" ? "✓" : index + 1}
                </span>
                <span className={styles.label[state]}>{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <span className={styles.connector} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      {next && (
        <button
          type="button"
          className={styles.nextButton}
          onClick={() => navigate(next.to)}
        >
          다음: {next.label} →
        </button>
      )}
    </nav>
  );
};

export default TreasurerStepper;
