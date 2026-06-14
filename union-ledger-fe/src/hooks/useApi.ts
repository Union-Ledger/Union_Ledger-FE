import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL, ENDPOINTS } from "../../config";
import { tokenStorage } from "@/utils/token";
import { ROUTES } from "@router/constant/router";
import { useMemo } from "react";

// 로그인 화면에서 세션 만료 안내를 띄우기 위한 sessionStorage 플래그
export const SESSION_EXPIRED_FLAG = "sessionExpired";
// 세션 만료로 튕겼을 때 원래 보던 경로 — 재로그인 후 복귀용
export const RETURN_TO_KEY = "returnTo";

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// 동시에 여러 요청이 401을 받아도 refresh는 한 번만 실행되도록 공유(single-flight)
let refreshPromise: Promise<boolean> | null = null;

export const refreshAccessToken = (): Promise<boolean> => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return Promise.resolve(false);

  if (!refreshPromise) {
    // 인터셉터가 붙지 않은 순수 axios로 호출 — 401 재귀를 피한다
    refreshPromise = axios
      .post(`${BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {
        refresh_token: refreshToken,
      })
      .then((response) => {
        const data = response.data as {
          access_token?: string;
          refresh_token?: string;
        };
        if (!data.access_token) return false;

        tokenStorage.setAccessToken(data.access_token);
        if (data.refresh_token) {
          tokenStorage.setRefreshToken(data.refresh_token);
        }
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// refresh/login/signup 자체의 401은 재시도 대상이 아니다
const isRetriableUrl = (url: string) =>
  !url.includes(ENDPOINTS.AUTH.LOGIN) &&
  !url.includes(ENDPOINTS.AUTH.REFRESH) &&
  !url.includes(ENDPOINTS.AUTH.SIGNUP);

const handleUnauthorized = (requestUrl: string) => {
  const hadToken = Boolean(tokenStorage.getAccessToken());
  tokenStorage.removeAccessToken();
  tokenStorage.removeRefreshToken();

  // 자격 증명 오류(로그인 요청 자체의 401)나 이미 로그인 화면이면 그대로 둔다
  const isLoginRequest = requestUrl.includes(ENDPOINTS.AUTH.LOGIN);
  const isOnLoginPage = window.location.pathname === ROUTES.LOGIN;

  if (hadToken && !isLoginRequest && !isOnLoginPage) {
    sessionStorage.setItem(SESSION_EXPIRED_FLAG, "1");
    // 만료 시점의 경로를 저장해 재로그인 후 그 화면으로 복귀
    const returnTo = window.location.pathname + window.location.search;
    if (returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      sessionStorage.setItem(RETURN_TO_KEY, returnTo);
    }
    window.location.replace(ROUTES.LOGIN);
  }
};

const applyAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config as RetriableRequestConfig | undefined;
      const status = error.response?.status;
      const url = String(original?.url ?? "");

      // 액세스 토큰 만료(401) → refresh 토큰으로 한 번 갱신 후 원요청 재시도
      if (
        status === 401 &&
        original &&
        !original._retry &&
        isRetriableUrl(url) &&
        tokenStorage.getRefreshToken()
      ) {
        original._retry = true;
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          return instance(original);
        }
      }

      if (status === 401) {
        handleUnauthorized(url);
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

const useApi = () => {
  const api = useMemo(
    () =>
      applyAuthInterceptor(
        axios.create({
          baseURL: BASE_URL,
        }),
      ),
    [],
  );

  const organizationApi = useMemo(
    () =>
      applyAuthInterceptor(
        axios.create({
          baseURL: BASE_URL + "/organizations",
        }),
      ),
    [],
  );

  const settlementApi = useMemo(
    () =>
      applyAuthInterceptor(
        axios.create({
          baseURL: BASE_URL + "/settlements",
        }),
      ),
    [],
  );

  const auditApi = useMemo(
    () =>
      applyAuthInterceptor(
        axios.create({
          baseURL: BASE_URL + "/audit",
        }),
      ),
    [],
  );

  const dashboardApi = useMemo(
    () =>
      applyAuthInterceptor(
        axios.create({
          baseURL: BASE_URL + "/dashboard",
        }),
      ),
    [],
  );

  const publicApi = useMemo(
    () =>
      applyAuthInterceptor(
        axios.create({
          baseURL: BASE_URL + "/public",
        }),
      ),
    [],
  );

  return {
    api,
    organizationApi,
    settlementApi,
    auditApi,
    dashboardApi,
    publicApi,
  };
};

export default useApi;
