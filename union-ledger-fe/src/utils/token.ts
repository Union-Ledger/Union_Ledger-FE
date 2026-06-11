export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

export const tokenStorage = {
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  removeAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

/** 액세스 토큰(JWT)의 만료 시각(exp, epoch 초)을 디코딩한다. 없거나 깨졌으면 null. */
export const getAccessTokenExpiry = (): number | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;

  const segments = token.split(".");
  if (segments.length < 2) return null;

  try {
    const payloadJson = atob(segments[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
};
