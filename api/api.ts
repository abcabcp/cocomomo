import axios, { AxiosRequestConfig } from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

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
  const accessToken = getCookie(ACCESS_TOKEN);
  if (accessToken) {
    return {
      ...config,
      headers: {
        ...config.headers,
        [ACCESS_TOKEN]: accessToken,
      },
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error) {
      clearTokens();
      window.location.href = '/';
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
