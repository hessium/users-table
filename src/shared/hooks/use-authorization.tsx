import { useLayoutEffect, useState } from 'react';
import { deleteCookie, getCookie, setCookie } from '../utils/cookier';
import { COOKIES } from '../constants/cookies.ts';

export const useAuthorization = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useLayoutEffect(() => {
    const token = getCookie(COOKIES.authToken);
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const login = (token: string) => {
    setCookie(COOKIES.authToken, token);
    setAuthToken(token);
  };

  const logout = () => {
    deleteCookie(COOKIES.authToken);
    setAuthToken(null);
  };

  return { authToken, login, logout };
};
