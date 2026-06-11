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

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
  newPasswordConfirm: string;
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
  refresh_token?: string;
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

interface ForgotPasswordResponse {
  message: string;
  expires_in_seconds: number;
  debug_code?: string;
}

interface MessageResponse {
  message: string;
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

  const saveTokens = (data: TokenResponse) => {
    if (data.access_token) {
      tokenStorage.setAccessToken(data.access_token);
    }
    if (data.refresh_token) {
      tokenStorage.setRefreshToken(data.refresh_token);
    }
  };

  const postLogin = (data: LoginData): Promise<TokenResponse> => {
    return api
      .post(ENDPOINTS.AUTH.LOGIN, data)
      .then((response) => {
        saveTokens(response.data);

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

  const postForgotPassword = (
    data: ForgotPasswordData,
  ): Promise<ForgotPasswordResponse> => {
    return api
      .post(ENDPOINTS.AUTH.PASSWORD_FORGOT, data)
      .then((response) => response.data)
      .catch((error) => {
        console.log(
          "비밀번호 재설정 코드 발송 실패:",
          error.response?.data ?? error,
        );
        throw error;
      });
  };

  const postResetPassword = (
    data: ResetPasswordData,
  ): Promise<MessageResponse> => {
    return api
      .post(ENDPOINTS.AUTH.PASSWORD_RESET, {
        email: data.email,
        code: data.code,
        new_password: data.newPassword,
        new_password_confirm: data.newPasswordConfirm,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("비밀번호 재설정 실패:", error.response?.data ?? error);
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
        saveTokens(response.data);

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

  const postRefresh = (): Promise<TokenResponse> => {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      return Promise.reject(new Error("리프레시 토큰이 없습니다."));
    }

    return api
      .post(ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken })
      .then((response) => {
        saveTokens(response.data);

        return response.data;
      });
  };

  const logout = () => {
    tokenStorage.removeAccessToken();
    tokenStorage.removeRefreshToken();
  };

  return {
    postLogin,
    postSendVerificationCode,
    postVerifyEmail,
    postForgotPassword,
    postResetPassword,
    postSignup,
    getMe,
    postRefresh,
    logout,
  };
};

export default useAuthApi;
