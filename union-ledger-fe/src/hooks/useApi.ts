import axios, { type AxiosInstance } from "axios";
import { BASE_URL, ENDPOINTS } from "../../config";
import { tokenStorage } from "@/utils/token";
import { ROUTES } from "@router/constant/router";
import { useMemo } from "react";

// 로그인 화면에서 세션 만료 안내를 띄우기 위한 sessionStorage 플래그
export const SESSION_EXPIRED_FLAG = "sessionExpired";

const handleUnauthorized = (requestUrl: string) => {
  const hadToken = Boolean(tokenStorage.getAccessToken());
  tokenStorage.removeAccessToken();

  // 자격 증명 오류(로그인 요청 자체의 401)나 이미 로그인 화면이면 그대로 둔다
  const isLoginRequest = requestUrl.includes(ENDPOINTS.AUTH.LOGIN);
  const isOnLoginPage = window.location.pathname === ROUTES.LOGIN;

  if (hadToken && !isLoginRequest && !isOnLoginPage) {
    sessionStorage.setItem(SESSION_EXPIRED_FLAG, "1");
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
    (error) => {
      if (error.response?.status === 401) {
        handleUnauthorized(String(error.config?.url ?? ""));
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
