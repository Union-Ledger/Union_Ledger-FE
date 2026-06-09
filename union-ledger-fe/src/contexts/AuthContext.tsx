/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useAuthApi, { type MeResponse } from "@/hooks/useAuthApi";

interface AuthContextValue {
  me: MeResponse | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  me: null,
  isLoading: true,
});

// 로그인 이후 /auth/me 를 한 번만 조회해 현재 사용자(역할/조직/운영자 여부)를
// 앱 전역에 공유한다. 역할 기반 라우트 가드(RequireRole)가 이 값을 사용한다.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getMe } = useAuthApi();
  const [getMeOnce] = useState(() => getMe);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getMeOnce()
      .then((data) => {
        if (active) setMe(data);
      })
      .catch(() => {
        if (active) setMe(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [getMeOnce]);

  return (
    <AuthContext.Provider value={{ me, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
