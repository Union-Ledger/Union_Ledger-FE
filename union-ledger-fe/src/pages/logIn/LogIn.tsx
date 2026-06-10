import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthApi from "@/hooks/useAuthApi";
import { SESSION_EXPIRED_FLAG } from "@/hooks/useApi";
import { ROUTES } from "@/router/constant/router";
import { getDashboardRouteByUser } from "./authRoute";
import * as styles from "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { postLogin, getMe } = useAuthApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_EXPIRED_FLAG)) {
      sessionStorage.removeItem(SESSION_EXPIRED_FLAG);
      setShowSessionExpired(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await postLogin({ email: trimmedEmail, password: trimmedPassword });
    } catch (error) {
      console.error("로그인 실패", error);
      setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const me = await getMe();
      navigate(getDashboardRouteByUser(me));
    } catch (error) {
      console.error("내 정보 조회 실패", error);
      setErrorMessage("로그인은 성공했지만 사용자 정보를 불러오지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.logo}>UL</div>
        <h1 className={styles.brandTitle}>Union-Ledger</h1>
        <p className={styles.subtitle}>대학 학생회 결산 시스템</p>

        {showSessionExpired && (
          <p className={styles.infoText} role="status">
            세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>이메일</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              placeholder="your.name@konkuk.ac.kr"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value.trim())}
            />
          </label>

          <div className={styles.field}>
            <span className={styles.passwordLabelRow}>
              <span className={styles.label}>비밀번호</span>
              <button
                className={styles.forgotPasswordLink}
                type="button"
                onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              >
                비밀번호 찾기
              </button>
            </span>
            <input
              className={styles.input}
              type="password"
              aria-label="비밀번호"
              value={password}
              placeholder="비밀번호"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

          <button
            className={styles.primaryButton}
            type="submit"
            disabled={!email.trim() || !password.trim() || isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className={styles.linkText}>
          계정이 없으신가요?
          <button
            className={styles.linkButton}
            type="button"
            onClick={() => navigate(ROUTES.SIGNUP)}
          >
            회원가입
          </button>
        </p>
      </section>
    </main>
  );
};

export default Login;
