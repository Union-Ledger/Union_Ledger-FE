import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import useAuthApi from "@/hooks/useAuthApi";
import { ROUTES } from "@/router/constant/router";
import * as styles from "./ForgotPassword.css";
import eyeGray from "@/assets/eye-gray.svg";

type ResetStep = 1 | 2 | 3 | 4;
type PasswordStrength = "none" | "weak" | "medium" | "strong";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as {
    message?: string;
    response?: {
      data?: {
        detail?: string | Array<{ msg?: string }>;
        message?: string;
      };
    };
  };
  const data = apiError.response?.data;

  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) {
    const message = data.detail.find((item) => item.msg)?.msg;
    if (message) return message;
  }

  return data?.message || apiError.message || fallback;
};

const isResetCodeError = (message: string) =>
  message.includes("인증 코드") ||
  message.includes("인증코드") ||
  message.toLowerCase().includes("code");

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { postForgotPassword, postResetPassword } = useAuthApi();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [step, setStep] = useState<ResetStep>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [remainingSeconds, setRemainingSeconds] = useState(RESEND_SECONDS);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedEmail = email.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const otpValue = otp.join("");

  const passwordStrength = useMemo<PasswordStrength>(() => {
    if (!password) return "none";

    const score = [
      password.length >= 8,
      /[a-z]/.test(password) && /[A-Z]/.test(password),
      /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    if (score === 3) return "strong";
    if (score === 2) return "medium";
    return "weak";
  }, [password]);

  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;
  const canResetPassword =
    password.length >= 8 &&
    passwordConfirm.length > 0 &&
    !passwordMismatch &&
    remainingSeconds > 0;

  useEffect(() => {
    if ((step !== 2 && step !== 3) || remainingSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds, step]);

  const sendResetCode = async () => {
    if (!isEmailValid || isSendingCode) return;

    setErrorMessage("");
    setIsSendingCode(true);

    try {
      const response = await postForgotPassword({ email: trimmedEmail });
      setOtp(Array(OTP_LENGTH).fill(""));
      setRemainingSeconds(
        response.expires_in_seconds > 0
          ? response.expires_in_seconds
          : RESEND_SECONDS,
      );
      setStep(2);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "인증코드 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleOtpChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    setErrorMessage("");

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!digits) return;

    const nextOtp = Array(OTP_LENGTH)
      .fill("")
      .map((_, index) => digits[index] ?? "");
    setOtp(nextOtp);
    setErrorMessage("");
    otpRefs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
  };

  const resendCode = async () => {
    if (remainingSeconds > 0) return;
    await sendResetCode();
  };

  const resetPassword = async () => {
    if (!canResetPassword || isResetting) return;

    setErrorMessage("");
    setIsResetting(true);

    try {
      await postResetPassword({
        email: trimmedEmail,
        code: otpValue,
        newPassword: password,
        newPasswordConfirm: passwordConfirm,
      });
      setStep(4);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "비밀번호 변경에 실패했습니다. 인증코드와 입력 정보를 확인해 주세요.",
      );

      if (isResetCodeError(message)) {
        setOtp(Array(OTP_LENGTH).fill(""));
        setRemainingSeconds(0);
        setStep(2);
        setErrorMessage(
          `${message} 새 인증코드를 발급받아 다시 시도해 주세요.`,
        );
        window.setTimeout(() => otpRefs.current[0]?.focus(), 0);
        return;
      }

      setErrorMessage(message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.logo}>UL</div>
        <h1 className={styles.title}>비밀번호 찾기</h1>
        <p className={styles.subtitle}>
          {step === 1 && "가입하신 이메일로 인증코드를 보내드립니다"}
          {step === 2 && `${trimmedEmail}로 발송된 인증코드를 입력해 주세요`}
          {step === 3 && "새로운 비밀번호를 설정해 주세요"}
          {step === 4 && "비밀번호가 성공적으로 변경되었습니다"}
        </p>

        {step < 4 && <ResetStepper step={step} />}

        {step === 1 && (
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              void sendResetCode();
            }}
          >
            <label className={styles.label}>
              이메일 주소
              <span className={styles.inputShell}>
                <span className={styles.inputIcon} aria-hidden="true">
                  ✉
                </span>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  placeholder="your.name@konkuk.ac.kr"
                  autoComplete="email"
                  autoFocus
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrorMessage("");
                  }}
                />
              </span>
            </label>
            {errorMessage && (
              <p className={styles.errorText} role="alert">
                {errorMessage}
              </p>
            )}
            <button
              className={styles.primaryButton}
              type="submit"
              disabled={!isEmailValid || isSendingCode}
            >
              {isSendingCode ? "인증코드 발송 중..." : "인증코드 받기"}
            </button>
            <button
              className={styles.textButton}
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              ← 로그인으로 돌아가기
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              if (otpValue.length === OTP_LENGTH) setStep(3);
            }}
          >
            <span className={styles.otpLabel}>인증코드 6자리</span>
            <div className={styles.otpRow}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  className={styles.otpInput}
                  value={digit}
                  maxLength={1}
                  inputMode="numeric"
                  aria-label={`인증코드 ${index + 1}번째 자리`}
                  onChange={(event) => handleOtpChange(index, event)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>
            <div className={styles.resendRow}>
              <span>코드를 받지 못하셨나요?</span>
              <button
                className={styles.resendButton}
                type="button"
                disabled={remainingSeconds > 0 || isSendingCode}
                onClick={() => void resendCode()}
              >
                {isSendingCode
                  ? "발송 중..."
                  : remainingSeconds > 0
                    ? `재전송 (${remainingSeconds}s)`
                    : "재전송"}
              </button>
            </div>
            {errorMessage && (
              <p className={styles.errorText} role="alert">
                {errorMessage}
              </p>
            )}
            <button
              className={styles.primaryButton}
              type="submit"
              disabled={otpValue.length !== OTP_LENGTH}
            >
              인증 확인
            </button>
            <button
              className={styles.textButton}
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(1);
              }}
            >
              ← 이메일 다시 입력
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              void resetPassword();
            }}
          >
            <label className={styles.label}>
              새 비밀번호
              <span className={styles.inputShell}>
                <span className={styles.inputIcon} aria-hidden="true">
                  ◇
                </span>
                <input
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="새 비밀번호"
                  autoComplete="new-password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrorMessage("");
                  }}
                  onKeyDown={(event) =>
                    setIsCapsLockOn(event.getModifierState("CapsLock"))
                  }
                  onKeyUp={(event) =>
                    setIsCapsLockOn(event.getModifierState("CapsLock"))
                  }
                />
                <button
                  className={styles.visibilityButton}
                  type="button"
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  <img src={eyeGray} alt="Toggle Password Visibility" />
                </button>
              </span>
            </label>

            {isCapsLockOn && (
              <p className={styles.capsLockHint} role="status">
                Caps Lock이 켜져 있습니다.
              </p>
            )}

            <PasswordStrength strength={passwordStrength} />

            <label className={styles.label}>
              새 비밀번호 확인
              <span className={styles.inputShell}>
                <span className={styles.inputIcon} aria-hidden="true">
                  ◇
                </span>
                <input
                  className={`${styles.input} ${
                    passwordMismatch ? styles.invalidInput : ""
                  }`}
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  placeholder="비밀번호 재입력"
                  autoComplete="new-password"
                  onChange={(event) => {
                    setPasswordConfirm(event.target.value);
                    setErrorMessage("");
                  }}
                />
                <button
                  className={styles.visibilityButton}
                  type="button"
                  aria-label={
                    showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                  onClick={() => setShowPasswordConfirm((visible) => !visible)}
                >
                  <img src={eyeGray} alt="Toggle Password Visibility" />
                </button>
              </span>
            </label>

            {passwordMismatch && (
              <p className={styles.errorText} role="alert">
                비밀번호가 일치하지 않습니다
              </p>
            )}
            {remainingSeconds <= 0 && (
              <p className={styles.errorText} role="alert">
                인증코드 유효 시간이 만료되었습니다.{" "}
                <button
                  className={styles.resendButton}
                  type="button"
                  disabled={isSendingCode}
                  onClick={() => void resendCode()}
                >
                  {isSendingCode ? "발송 중..." : "새 인증코드 받기"}
                </button>
              </p>
            )}
            {errorMessage && (
              <p className={styles.errorText} role="alert">
                {errorMessage}
              </p>
            )}

            <button
              className={styles.primaryButton}
              type="submit"
              disabled={!canResetPassword || isResetting}
            >
              {isResetting ? "비밀번호 변경 중..." : "비밀번호 변경"}
            </button>
            <button
              className={styles.textButton}
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(2);
                window.setTimeout(() => otpRefs.current[0]?.focus(), 0);
              }}
            >
              ← 인증코드 다시 입력
            </button>
          </form>
        )}

        {step === 4 && (
          <div className={styles.completeContent}>
            <div className={styles.completeIcon} aria-hidden="true">
              ✓
            </div>
            <h2 className={styles.completeTitle}>비밀번호 변경 완료!</h2>
            <p className={styles.completeDescription}>
              새 비밀번호로 로그인해 주세요
            </p>
            <button
              className={`${styles.primaryButton} ${styles.completeButton}`}
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              로그인하러 가기
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

const ResetStepper = ({ step }: { step: ResetStep }) => (
  <div className={styles.stepper} aria-label={`비밀번호 찾기 ${step}단계`}>
    {[1, 2, 3].map((number, index) => {
      const state =
        number < step ? "done" : number === step ? "active" : "pending";

      return (
        <div key={number} style={{ display: "contents" }}>
          {index > 0 && (
            <span
              className={`${styles.stepLine} ${
                number <= step ? styles.stepLineDone : ""
              }`}
            />
          )}
          <span
            className={`${styles.stepCircle} ${styles.stepCircleVariant[state]}`}
          >
            {state === "done" ? "✓" : number}
          </span>
        </div>
      );
    })}
  </div>
);

const PasswordStrength = ({ strength }: { strength: PasswordStrength }) => {
  if (strength === "none") {
    return (
      <>
        <div className={styles.strengthBars}>
          <span className={styles.strengthBar} />
          <span className={styles.strengthBar} />
          <span className={styles.strengthBar} />
        </div>
        <p className={styles.strengthText}>
          강도: 영문 대문자, 숫자, 특수문자를 포함해 주세요
        </p>
      </>
    );
  }

  const activeBars = strength === "weak" ? 1 : strength === "medium" ? 2 : 3;
  const label =
    strength === "weak" ? "약함" : strength === "medium" ? "보통" : "강함";
  const textClass =
    strength === "weak"
      ? styles.weakText
      : strength === "medium"
        ? styles.mediumText
        : styles.strongText;

  return (
    <>
      <div className={styles.strengthBars}>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={`${styles.strengthBar} ${
              index < activeBars ? styles.strengthBarVariant[strength] : ""
            }`}
          />
        ))}
      </div>
      <p className={styles.strengthText}>
        강도: <strong className={textClass}>{label}</strong>
        {strength !== "strong" && " · 8자 이상, 영문 대소문자, 숫자, 특수문자"}
      </p>
    </>
  );
};

export default ForgotPassword;
