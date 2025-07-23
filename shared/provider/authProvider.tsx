'use client';

import { useGetCurrentUserUsers } from '@/entities/api/query/users';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getAccessToken } from '../lib/utils/accessToken';
import { useUserStore } from '../store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const accessToken = getAccessToken();

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
    if (userInfo?.data) {
      setUser(userInfo?.data);
    } else {
      setUser(null);
    }
  }, [userInfo]);

  return <>{children}</>
}
