import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthApi from "@/hooks/useAuthApi";
import { ROUTES } from "@/router/constant/router";
import { useToast } from "@shared/components/feedback";
import PasswordStrengthMeter from "@shared/components/PasswordStrengthMeter";
import { getDashboardRouteByRoles, getDashboardRouteByUser } from "./authRoute";
import eyeGray from "@/assets/eye-gray.svg";
import * as styles from "./Auth.css";

type SignupStep = 1 | 2 | 3;

const KONKUK_EMAIL_DOMAIN = "@konkuk.ac.kr";

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

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { postSendVerificationCode, postVerifyEmail, postSignup, getMe } =
    useAuthApi();

  const [step, setStep] = useState<SignupStep>(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signedUpRoles, setSignedUpRoles] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const isKonkukEmail = useMemo(() => {
    return email.trim().endsWith(KONKUK_EMAIL_DOMAIN);
  }, [email]);

  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const canSubmitSignup =
    name &&
    password.length >= 8 &&
    password === passwordConfirm &&
    collegeName &&
    departmentName;

  // 비활성 버튼이 '왜' 막혀 있는지 — 첫 번째 미충족 항목을 안내
  const signupHint = !name
    ? "이름을 입력해주세요."
    : password.length < 8
      ? "비밀번호를 8자 이상 입력해주세요."
      : password !== passwordConfirm
        ? "비밀번호 확인이 일치하지 않습니다."
        : !collegeName
          ? "단과대학을 입력해주세요."
          : !departmentName
            ? "학과를 입력해주세요."
            : "";

  // 인증 코드 재발송 쿨다운 카운트다운
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  // 초대 코드 인증 대기 모달 ESC 닫기
  useEffect(() => {
    if (!modalVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalVisible]);

  const showToast = () => {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 3000);
  };

  const handleSendCode = async () => {
    if (!isKonkukEmail) {
      setErrorMessage("건국대학교 이메일(@konkuk.ac.kr)을 입력해주세요.");
      return;
    }

    try {
      setIsSendingCode(true);
      setErrorMessage("");
      await postSendVerificationCode({ email });
      setCodeSent(true);
      setResendCooldown(60);
      showToast();
    } catch (error) {
      console.error("인증 코드 발송 실패", error);
      setCodeSent(false);
      setErrorMessage(
        getApiErrorMessage(error, "인증 코드 발송에 실패했습니다."),
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length < 6) {
      setErrorMessage("6자리 인증 코드를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage("");
      await postVerifyEmail({ email, code: verificationCode });
      setStep(3);
    } catch (error) {
      console.error("이메일 인증 실패", error);
      setErrorMessage(
        getApiErrorMessage(error, "인증 코드를 확인해주세요."),
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignup = async () => {
    if (!canSubmitSignup) {
      setErrorMessage("필수 정보를 모두 올바르게 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await postSignup({
        email,
        password,
        passwordConfirm,
        name,
        collegeName,
        departmentName,
        invitationCode: inviteCode,
      });
      const me = await getMe();
      setSignedUpRoles(me.roles);

      if (inviteCode.trim()) {
        setModalVisible(true);
        return;
      }

      toast.info(
        "학생회장이신가요? 사이드바의 '회장 신청'에서 조직 등록을 신청할 수 있습니다.",
        { duration: 8000 },
      );
      navigate(getDashboardRouteByUser(me));
    } catch (error) {
      console.error("회원가입 실패", error);
      setErrorMessage(getApiErrorMessage(error, "회원가입에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.signupPage}>
      <section className={styles.signupCard}>
        <div className={styles.documentIcon} aria-hidden="true" />
        <h1 className={styles.signupTitle}>회원가입</h1>
        <p className={styles.subtitle}>
          대학 이메일로 가입하여 학생회 결산 내역을 투명하게 확인하세요
        </p>

        <div className={styles.stepper}>
          <Step number={1} label="이메일 인증" currentStep={step} />
          <div
            className={`${styles.stepLine} ${step > 1 ? styles.stepLineDone : ""}`}
          />
          <Step number={2} label="코드 확인" currentStep={step} />
          <div
            className={`${styles.stepLine} ${step > 2 ? styles.stepLineDone : ""}`}
          />
          <Step number={3} label="정보 입력" currentStep={step} />
        </div>

        <div className={styles.signupForm}>
          {step === 1 && (
            <>
              <label className={styles.field}>
                <span className={styles.label}>대학 이메일</span>
                <div className={styles.emailRow}>
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    placeholder="your.name@konkuk.ac.kr"
                    autoComplete="email"
                    autoFocus
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setCodeSent(false);
                      setErrorMessage("");
                      setEmailHint("");
                    }}
                    onBlur={(event) => {
                      const value = event.target.value.trim();
                      setEmailHint(
                        value && !value.endsWith(KONKUK_EMAIL_DOMAIN)
                          ? "건국대학교 이메일(@konkuk.ac.kr)만 가입할 수 있습니다."
                          : "",
                      );
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      if (codeSent) {
                        setStep(2);
                      } else if (email && !isSendingCode) {
                        void handleSendCode();
                      }
                    }}
                  />
                  <button
                    className={styles.primaryButton}
                    type="button"
                    disabled={!email || isSendingCode}
                    onClick={handleSendCode}
                  >
                    {codeSent
                      ? "발송완료"
                      : isSendingCode
                        ? "발송 중"
                        : "인증 코드 발송"}
                  </button>
                </div>
              </label>
              {emailHint && (
                <p className={styles.fieldErrorText} role="alert">
                  {emailHint}
                </p>
              )}
              <p className={styles.helperText}>
                건국대학교 이메일(@konkuk.ac.kr)만 가입 가능합니다.
              </p>

              {codeSent && (
                <div className={styles.successBox}>
                  <strong>{email}</strong>
                  <br />로 인증 코드가 발송되었습니다.
                  <br />
                  이메일을 확인하고 다음 단계에서 인증 코드를 입력해주세요.
                </div>
              )}

              {errorMessage && (
                <p className={styles.errorText} role="alert">
                  {errorMessage}
                </p>
              )}

              <button
                className={styles.primaryButton}
                type="button"
                disabled={!codeSent}
                onClick={() => setStep(2)}
              >
                다음 단계
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className={styles.field}>
                <span className={styles.label}>인증 코드</span>
                <input
                  className={styles.input}
                  value={verificationCode}
                  placeholder="6자리 인증 코드"
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                  onChange={(event) =>
                    setVerificationCode(event.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    if (verificationCode.length === 6 && !isVerifying) {
                      void handleVerifyCode();
                    }
                  }}
                />
              </label>
              <p className={styles.helperText}>
                <strong>{email}</strong>로 발송된 6자리 인증 코드를
                입력해주세요.
              </p>

              {errorMessage && (
                <p className={styles.errorText} role="alert">
                  {errorMessage}
                </p>
              )}

              <div className={styles.actionRow}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSendingCode || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `재발송 (${resendCooldown}s)`
                    : "인증 코드 재발송"}
                </button>
                <button
                  className={styles.primaryButton}
                  type="button"
                  disabled={verificationCode.length !== 6 || isVerifying}
                  onClick={handleVerifyCode}
                >
                  {isVerifying ? "확인 중" : "인증 확인"}
                </button>
              </div>

              <button
                className={styles.linkButton}
                type="button"
                onClick={() => setStep(1)}
              >
                이전 단계
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className={styles.successBox}>
                ✓ 이메일 인증이 완료되었습니다. 나머지 정보를 입력해주세요.
              </div>

              <div className={styles.grid}>
                <label className={styles.field}>
                  <span className={styles.label}>이름 *</span>
                  <input
                    className={styles.input}
                    value={name}
                    placeholder="홍길동"
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>이메일</span>
                  <input className={styles.input} value={email} disabled />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>비밀번호 *</span>
                  <span className={styles.inputShell}>
                    <input
                      className={`${styles.input} ${styles.inputWithToggle}`}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="최소 8자 이상"
                      autoComplete="new-password"
                      onChange={(event) => setPassword(event.target.value)}
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
                      <img src={eyeGray} alt="" aria-hidden="true" />
                    </button>
                  </span>
                  {isCapsLockOn && (
                    <p className={styles.capsLockHint} role="status">
                      Caps Lock이 켜져 있습니다.
                    </p>
                  )}
                  <PasswordStrengthMeter password={password} />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>비밀번호 확인 *</span>
                  <span className={styles.inputShell}>
                    <input
                      className={`${styles.input} ${styles.inputWithToggle}`}
                      type={showPasswordConfirm ? "text" : "password"}
                      value={passwordConfirm}
                      placeholder="비밀번호 재입력"
                      autoComplete="new-password"
                      onChange={(event) =>
                        setPasswordConfirm(event.target.value)
                      }
                    />
                    <button
                      className={styles.visibilityButton}
                      type="button"
                      aria-label={
                        showPasswordConfirm
                          ? "비밀번호 숨기기"
                          : "비밀번호 보기"
                      }
                      onClick={() =>
                        setShowPasswordConfirm((visible) => !visible)
                      }
                    >
                      <img src={eyeGray} alt="" aria-hidden="true" />
                    </button>
                  </span>
                  {passwordMismatch && (
                    <p className={styles.fieldErrorText} role="alert">
                      비밀번호가 일치하지 않습니다
                    </p>
                  )}
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>단과대학 *</span>
                  <input
                    className={styles.input}
                    value={collegeName}
                    placeholder="예: 공과대학"
                    onChange={(event) => setCollegeName(event.target.value)}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>학과 *</span>
                  <input
                    className={styles.input}
                    value={departmentName}
                    placeholder="예: 컴퓨터공학과"
                    onChange={(event) => setDepartmentName(event.target.value)}
                  />
                </label>

                <label className={`${styles.field} ${styles.fullWidth}`}>
                  <span className={styles.label}>초대 코드 (선택)</span>
                  <input
                    className={styles.input}
                    value={inviteCode}
                    placeholder="재정담당자 또는 감사위원 초대 코드"
                    onChange={(event) => setInviteCode(event.target.value)}
                  />
                </label>
              </div>

              <p className={styles.helperText}>
                초대 코드가 없으면 일반 학우로 가입됩니다. 재정담당자나
                감사위원 권한은 초대 코드로만 부여됩니다. 학생회장이라면 가입
                후 사이드바의 &lsquo;회장 신청&rsquo;에서 조직 등록을 신청할
                수 있습니다.
              </p>

              {errorMessage && (
                <p className={styles.errorText} role="alert">
                  {errorMessage}
                </p>
              )}

              <div className={styles.actionRow}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => setStep(2)}
                >
                  이전 단계
                </button>
                <button
                  className={styles.primaryButton}
                  type="button"
                  disabled={!canSubmitSignup || isSubmitting}
                  onClick={handleSignup}
                >
                  {isSubmitting ? "가입 중" : "회원가입 완료"}
                </button>
              </div>
              {!canSubmitSignup && signupHint && (
                <p className={styles.helperText} role="status">
                  {signupHint}
                </p>
              )}
            </>
          )}

          <p className={styles.linkText}>
            이미 계정이 있으신가요?
            <button
              className={styles.linkButton}
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              로그인
            </button>
          </p>
        </div>
      </section>

      {toastVisible && (
        <div className={styles.toast}>
          <p className={styles.toastTitle}>✓ 인증 코드가 발송되었습니다.</p>
          <p className={styles.toastDesc}>이메일을 확인해주세요.</p>
        </div>
      )}

      {modalVisible && (
        <div className={styles.modalOverlay} role="presentation">
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-pending-modal-title"
          >
            <button
              className={styles.modalClose}
              type="button"
              aria-label="닫기"
              onClick={() => setModalVisible(false)}
            >
              ×
            </button>
            <div className={styles.modalIcon}>◷</div>
            <h2 id="signup-pending-modal-title" className={styles.modalTitle}>
              초대 코드 인증 대기 중
            </h2>
            <p className={styles.modalText}>
              재정담당자 또는 감사위원 권한 인증까지 <strong>평균 1~2일</strong>{" "}
              소요됩니다.
              <br />
              인증이 완료되면 <strong>{email}</strong>로 안내드립니다.
            </p>
            <div className={styles.modalNote}>
              인증 완료 전까지는 일반 학우 권한으로 먼저 이용하실 수 있습니다.
            </div>
            <button
              className={`${styles.primaryButton} ${styles.modalAction}`}
              type="button"
              onClick={() => navigate(getDashboardRouteByRoles(signedUpRoles))}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

interface StepProps {
  number: SignupStep;
  label: string;
  currentStep: SignupStep;
}

const Step = ({ number, label, currentStep }: StepProps) => {
  const state =
    currentStep > number ? "done" : currentStep === number ? "active" : "pending";

  return (
    <div className={styles.stepItem}>
      <span
        className={`${styles.stepCircle} ${styles.stepCircleVariant[state]}`}
      >
        {state === "done" ? "✓" : number}
      </span>
      <span
        className={`${styles.stepLabel} ${
          state === "pending" ? styles.stepLabelMuted : ""
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default SignUp;
