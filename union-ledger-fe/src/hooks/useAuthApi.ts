import useApi from "./useApi";
import { ENDPOINTS } from "../../config";
import { tokenStorage } from "@/utils/token";

interface LoginData {
  email: string;
  password: string;
}

const useAuthApi = () => {
  const { api } = useApi();

  const postLogin = (data: LoginData) => {
    return api
      .post(ENDPOINTS.AUTH.LOGIN, data)
      .then((response) => {
        const accessToken =
          response.data.access_token ??
          response.data.accessToken ??
          response.data.token;

        if (accessToken) {
          tokenStorage.setAccessToken(accessToken);
        }

        return response.data;
      })
      .catch((error) => console.log(error));
  };

  const getMe = () => {
    return api
      .get(ENDPOINTS.AUTH.ME)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));
  };

  const logout = () => {
    tokenStorage.removeAccessToken();
  };

  return { postLogin, getMe, logout };
};

export default useAuthApi;
