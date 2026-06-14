import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import { getAccessTokenExpiry } from "@/utils/token";
import {
  RETURN_TO_KEY,
  SESSION_EXPIRED_FLAG,
  refreshAccessToken,
} from "@/hooks/useApi";
import useAuthApi from "@/hooks/useAuthApi";
import { useConfirm } from "@/shared/components/feedback/confirm/ConfirmProvider";
import * as styles from "./SessionTimer.css";

// 만료 5분 전부터 경고 상태로 전환하고 연장 모달을 자동으로 띄운다.
const WARN_THRESHOLD_SEC = 5 * 60;

const formatTime = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const computeRemaining = () => {
  const exp = getAccessTokenExpiry();
  return exp == null ? null : exp - Math.floor(Date.now() / 1000);
};

const SessionTimer = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { logout } = useAuthApi();

  const [remaining, setRemaining] = useState<number | null>(computeRemaining);
  const warnedRef = useRef(false);
  const promptOpenRef = useRef(false);
  const expiredRef = useRef(false);
  const silentRefreshingRef = useRef(false);

  const handleExpired = useCallback(() => {
    if (expiredRef.current) return;
    expiredRef.current = true;
    logout();
    localStorage.removeItem("organizationId");
    sessionStorage.setItem(SESSION_EXPIRED_FLAG, "1");
    const returnTo = window.location.pathname + window.location.search;
    if (returnTo.startsWith("/") && returnTo !== ROUTES.LOGIN) {
      sessionStorage.setItem(RETURN_TO_KEY, returnTo);
    }
    navigate(ROUTES.LOGIN, { replace: true });
  }, [logout, navigate]);

  const promptExtend = useCallback(async () => {
    if (promptOpenRef.current || expiredRef.current) return;
    promptOpenRef.current = true;
    const left = computeRemaining() ?? 0;
    const ok = await confirm({
      title: "세션 연장",
      description:
        left > 0
          ? `로그인 세션이 ${formatTime(left)} 후 만료됩니다. 연장하시겠습니까?`
          : "로그인 세션이 만료되었습니다. 다시 연장하시겠습니까?",
      confirmLabel: "연장하기",
      cancelLabel: "닫기",
    });
    promptOpenRef.current = false;
    if (!ok) return;
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      warnedRef.current = false;
      setRemaining(computeRemaining());
    } else {
      handleExpired();
    }
  }, [confirm, handleExpired]);

  useEffect(() => {
    const tick = async () => {
      const rem = computeRemaining();
      setRemaining(rem);
      if (rem == null) return;
      if (rem <= 0) {
        // 액세스 토큰 만료 — refresh로 조용히 갱신 시도, 실패할 때만 만료 처리
        // (클라이언트 시계 오차로 멀쩡한 세션을 끊지 않도록 서버에 위임)
        if (silentRefreshingRef.current || expiredRef.current) return;
        silentRefreshingRef.current = true;
        const refreshed = await refreshAccessToken();
        silentRefreshingRef.current = false;
        if (refreshed) {
          warnedRef.current = false;
          setRemaining(computeRemaining());
        } else {
          handleExpired();
        }
        return;
      }
      if (rem > WARN_THRESHOLD_SEC) {
        // 연장되어 여유가 생기면 다음 임박 때 다시 경고하도록 리셋
        warnedRef.current = false;
        return;
      }
      if (!warnedRef.current && !promptOpenRef.current) {
        warnedRef.current = true;
        void promptExtend();
      }
    };
    const id = window.setInterval(() => void tick(), 1000);
    return () => window.clearInterval(id);
  }, [handleExpired, promptExtend]);

  if (remaining == null) return null;

  const isWarning = remaining <= WARN_THRESHOLD_SEC;

  return (
    <button
      type="button"
      className={isWarning ? styles.chipWarning : styles.chip}
      onClick={() => void promptExtend()}
      title="클릭하면 세션을 연장할 수 있습니다"
      aria-label={`세션 남은 시간 ${formatTime(remaining)}. 클릭하면 연장합니다.`}
    >
      <span
        className={isWarning ? styles.dotWarning : styles.dot}
        aria-hidden="true"
      />
      세션 {formatTime(remaining)}
    </button>
  );
};

export default SessionTimer;
