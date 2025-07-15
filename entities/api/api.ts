import { getAccessToken } from '@/shared/lib/utils/accessToken';
import axios, { AxiosRequestConfig } from 'axios';
import { deleteCookie } from 'cookies-next';
import { signOut } from 'next-auth/react';

export const ACCESS_TOKEN = 'accessToken';

export async function clearTokens() {
  const cookieOptions = {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    path: '/',
    sameSite: 'none' as const,
    secure: true,
  };
  deleteCookie(ACCESS_TOKEN, cookieOptions);
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: any) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    return {
      ...config,
      headers: {
        ...config.headers,
        'access-token': accessToken,
      },
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // try {
      //   // const newAccessToken = await refreshToken(); // 토큰 갱신 로직 구현 필요
      //   // setAccessToken(newAccessToken);

      //   // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      //   return api(originalRequest);
      // } catch (refreshError) {
      //   await signOut();
      //   return Promise.reject(refreshError);
      // }
    }
    return Promise.reject(error);
  },
);

export const apiInstance = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    return await Promise.reject(error);
  }
};
