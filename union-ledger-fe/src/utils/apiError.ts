import axios from "axios";

/**
 * HTTP 상태별 사용자 안내 문구.
 * catch 블록에서 toast/인라인 메시지로 사용한다.
 *
 * overrides로 화면 맥락에 맞는 문구를 지정할 수 있다.
 * 예: 로그인 폼의 401은 "이메일 또는 비밀번호를 확인해주세요."
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
  overrides?: Partial<Record<number, string>>,
) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "네트워크 연결을 확인해주세요.";
    }

    const status = error.response.status;
    const override = overrides?.[status];
    if (override) return override;

    if (status === 401) return "인증이 만료되었습니다. 다시 로그인해주세요.";
    if (status === 403) return "이 작업을 수행할 권한이 없습니다.";
    if (status === 404) return "요청한 정보를 찾을 수 없습니다.";
    if (status === 429)
      return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    if (status >= 500)
      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

    const detail = (error.response.data as { detail?: unknown } | undefined)
      ?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;
  }

  return fallback;
};
