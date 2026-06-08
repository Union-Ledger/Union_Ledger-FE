import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthApi from "@/hooks/useAuthApi";
import { ROUTES } from "@/router/constant/router";
import { getDashboardRouteByRoles } from "./authRoute";
import * as styles from "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { postLogin, getMe } = useAuthApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // 이메일은 가입 시 소문자로 저장되므로, 입력값(모바일 자동 대문자/공백 등)을
      // 정규화해서 보낸다. (대소문자·앞뒤 공백 때문에 로그인 실패하던 버그 수정)
      await postLogin({ email: email.trim().toLowerCase(), password });
      const me = await getMe();
      navigate(getDashboardRouteByRoles(me.roles));
    } catch (error) {
      console.error("로그인 실패", error);
      setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>이메일</span>
            <input
              className={styles.input}
              type="email"
              value={email}
              placeholder="your.name@konkuk.ac.kr"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>비밀번호</span>
            <input
              className={styles.input}
              type="password"
              value={password}
              placeholder="비밀번호"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {errorMessage && (
            <p className={styles.errorText}>{errorMessage}</p>
          )}

          <button
            className={styles.primaryButton}
            type="submit"
            disabled={!email || !password || isSubmitting}
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
