import useApi from "./useApi";
import { ENDPOINTS } from "../../config";
import { tokenStorage } from "@/utils/token";

interface LoginData {
  email: string;
  password: string;
}

interface SendVerificationCodeData {
  email: string;
}

interface VerifyEmailData {
  email: string;
  code: string;
}

interface SignupData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  collegeName: string;
  departmentName: string;
  invitationCode?: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface SendVerificationCodeResponse {
  message: string;
  expires_in_seconds: number;
  debug_code?: string;
}

interface VerifyEmailResponse {
  message: string;
  verified: boolean;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  roles: string[];
  is_operator?: boolean;
  organization_id?: string | null;
  organization?: {
    id?: string | null;
  } | null;
  organizations?: {
    id?: string | null;
  }[];
  memberships?: {
    organization_id?: string | null;
    organization?: {
      id?: string | null;
    } | null;
  }[];
}

const useAuthApi = () => {
  const { api } = useApi();

  const saveAccessToken = (data: TokenResponse) => {
    const accessToken = data.access_token;

    if (accessToken) {
      tokenStorage.setAccessToken(accessToken);
    }
  };

  const postLogin = (data: LoginData): Promise<TokenResponse> => {
    return api
      .post(ENDPOINTS.AUTH.LOGIN, data)
      .then((response) => {
        saveAccessToken(response.data);

        return response.data;
      })
      .catch((error) => {
        console.log("로그인 실패:", error.response?.data ?? error);
        throw error;
      });
  };

  const postSendVerificationCode = (
    data: SendVerificationCodeData,
  ): Promise<SendVerificationCodeResponse> => {
    return api
      .post(ENDPOINTS.AUTH.SEND_VERIFICATION_CODE, data)
      .then((response) => response.data)
      .catch((error) => {
        console.log("인증 코드 발송 실패:", error.response?.data ?? error);
        throw error;
      });
  };

  const postVerifyEmail = (
    data: VerifyEmailData,
  ): Promise<VerifyEmailResponse> => {
    return api
      .post(ENDPOINTS.AUTH.VERIFY_EMAIL, data)
      .then((response) => {
        if (!response.data.verified) {
          throw new Error(response.data.message ?? "이메일 인증 실패");
        }

        return response.data;
      })
      .catch((error) => {
        console.log("이메일 인증 실패:", error.response?.data ?? error);
        throw error;
      });
  };

  const postSignup = (data: SignupData): Promise<TokenResponse> => {
    return api
      .post(ENDPOINTS.AUTH.SIGNUP, {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirm: data.passwordConfirm,
        college_name: data.collegeName,
        department_name: data.departmentName,
        invitation_code: data.invitationCode || undefined,
      })
      .then((response) => {
        saveAccessToken(response.data);

        return response.data;
      })
      .catch((error) => {
        console.log("회원가입 실패:", error.response?.data ?? error);
        throw error;
      });
  };

  const getMe = (): Promise<MeResponse> => {
    return api
      .get(ENDPOINTS.AUTH.ME)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("내 정보 조회 실패:", error.response?.data ?? error);
        throw error;
      });
  };

  const logout = () => {
    tokenStorage.removeAccessToken();
  };

  return {
    postLogin,
    postSendVerificationCode,
    postVerifyEmail,
    postSignup,
    getMe,
    logout,
  };
};

export default useAuthApi;
