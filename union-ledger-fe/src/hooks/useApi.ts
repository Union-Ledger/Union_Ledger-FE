import axios, { type AxiosInstance } from "axios";
import { BASE_URL } from "../../config";
import { tokenStorage } from "@/utils/token";

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
  const api = applyAuthInterceptor(
    axios.create({
      baseURL: BASE_URL,
    }),
  );

  const organizationApi = applyAuthInterceptor(
    axios.create({
      baseURL: BASE_URL + "/organizations",
    }),
  );

  const settlementApi = applyAuthInterceptor(
    axios.create({
      baseURL: BASE_URL + "/settlements",
    }),
  );

  const auditApi = applyAuthInterceptor(
    axios.create({
      baseURL: BASE_URL + "/audits",
    }),
  );

  const dashboardApi = applyAuthInterceptor(
    axios.create({
      baseURL: BASE_URL + "/dashboard",
    }),
  );

  return { api, organizationApi, settlementApi, auditApi, dashboardApi };
};

export default useApi;
