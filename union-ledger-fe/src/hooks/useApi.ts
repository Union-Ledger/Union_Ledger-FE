import axios, { type AxiosInstance } from "axios";
import { BASE_URL } from "../../config";
import { tokenStorage } from "@/utils/token";
import { useMemo } from "react";

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
        tokenStorage.removeAccessToken();
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
