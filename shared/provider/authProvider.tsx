'use client';

import { useGetCurrentUserUsers } from '@/entities/api/query/users';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getAccessToken, setAccessToken, setRefreshToken } from '../lib/utils/accessToken';
import { useUserStore } from '../store';
import { useLoginAuth } from '@/entities/api/query/auth';
import { clearTokens } from '@/entities/api/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const accessToken = getAccessToken();


  const onError = () => {
    clearTokens();
    setUser(null);
    sessionStorage.clear();
  };


  const { mutateAsync: login, isPending: isLoginPending } = useLoginAuth({
    mutation: {
      onSuccess: (result) => {
        const { data } = result;
        if (data?.accessToken && data?.refreshToken) {
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
        } else {
          onError();
        }
      },
      onError,
    },
  });

  const {
    data: userInfo,
  } = useGetCurrentUserUsers({
    query: {
      enabled: status === 'authenticated' && !!accessToken,
      staleTime: 0,
      gcTime: 0,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  });

  useEffect(() => {
    if (session?.accessToken && !accessToken && !isLoginPending) {
      login({ data: { platform: 'github', accessToken: session.accessToken } });
    }
  }, [session?.accessToken, accessToken, isLoginPending])

  useEffect(() => {
    if (userInfo?.data) {
      setUser(userInfo?.data);
    } else {
      setUser(null);
    }
  }, [userInfo]);

  return <>{children}</>
}
