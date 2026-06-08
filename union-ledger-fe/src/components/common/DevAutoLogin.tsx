import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuthApi from "@/hooks/useAuthApi";
import { tokenStorage } from "@/utils/token";
import { ROUTES } from "@/router/constant/router";

const DevAutoLogin = () => {
  const { postLogin } = useAuthApi();
  const location = useLocation();
  const [postLoginOnce] = useState(() => postLogin);

  useEffect(() => {
    if (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP) {
      return;
    }

    const token = tokenStorage.getAccessToken();

    if (token) return;

    const email = import.meta.env.VITE_DEV_EMAIL;
    const password = import.meta.env.VITE_DEV_PASSWORD;

    if (!email || !password) return;

    postLoginOnce({
      email,
      password,
    }).catch(() => undefined);
  }, [location.pathname, postLoginOnce]);

  return null;
};

export default DevAutoLogin;
