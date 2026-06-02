import { useEffect } from "react";
import useAuthApi from "@/hooks/useAuthApi";
import { tokenStorage } from "@/utils/token";

const DevAutoLogin = () => {
  const { postLogin } = useAuthApi();

  useEffect(() => {
    const token = tokenStorage.getAccessToken();

    if (token) return;

    const email = import.meta.env.VITE_DEV_EMAIL;
    const password = import.meta.env.VITE_DEV_PASSWORD;

    if (!email || !password) return;

    postLogin({
      email,
      password,
    });
  }, []);

  return null;
};

export default DevAutoLogin;
