import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const ACCESS_TOKEN_KEY =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'access-token'
    : `${process.env.NEXT_PUBLIC_ENV ?? 'local'}-access-token`;

export const REFRESH_TOKEN_KEY =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? 'refresh-token'
    : `${process.env.NEXT_PUBLIC_ENV ?? 'local'}-refresh-token`;

const getAccessToken = (key = ACCESS_TOKEN_KEY) => {
  return getCookie(key, {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });
};
const getRefreshToken = (key = REFRESH_TOKEN_KEY) => {
  return getCookie(key, {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });
};

const setAccessToken = (token: string, key = ACCESS_TOKEN_KEY) => {
  setCookie(key, token, {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60 * 24,
  });
};

const setRefreshToken = (token: string, key = REFRESH_TOKEN_KEY) => {
  setCookie(key, token, {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    path: '/',
    sameSite: 'none',
    secure: true,
  });
};

const clearTokens = () => {
  const cookieOptions = {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    path: '/',
    sameSite: 'none' as const,
    secure: true,
  };

  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(ACCESS_TOKEN_KEY, cookieOptions);
  deleteCookie(REFRESH_TOKEN_KEY, cookieOptions);
};

export {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
};
