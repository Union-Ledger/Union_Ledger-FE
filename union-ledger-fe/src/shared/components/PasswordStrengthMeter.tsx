import * as styles from "./PasswordStrengthMeter.css";

type StrengthLevel = "none" | "weak" | "medium" | "strong";

const getStrength = (password: string): StrengthLevel => {
  if (!password) return "none";

  const score = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (score === 3) return "strong";
  if (score === 2) return "medium";
  return "weak";
};

const STRENGTH_LABELS: Record<Exclude<StrengthLevel, "none">, string> = {
  weak: "약함",
  medium: "보통",
  strong: "강함",
};

// 비밀번호 입력 필드 아래에 두는 강도 표시 막대 + 안내 문구
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const strength = getStrength(password);

  if (strength === "none") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.bars}>
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </div>
        <p className={styles.text}>
          8자 이상, 영문 대소문자·숫자·특수문자 조합을 권장합니다
        </p>
      </div>
    );
  }

  const activeBars = strength === "weak" ? 1 : strength === "medium" ? 2 : 3;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bars}>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={`${styles.bar} ${
              index < activeBars ? styles.barVariant[strength] : ""
            }`}
          />
        ))}
      </div>
      <p className={styles.text} aria-live="polite">
        비밀번호 강도:{" "}
        <span className={styles.labelVariant[strength]}>
          {STRENGTH_LABELS[strength]}
        </span>
        {strength !== "strong" && " · 8자 이상, 영문 대소문자, 숫자, 특수문자"}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
