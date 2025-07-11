'use client';

import { useSession } from 'next-auth/react';
import { useUserStore } from '../store';
import { getAccessToken } from '../lib/utils/accessToken';
import { useGetCurrentUserUsers } from '@/entities/api/query/users';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const accessToken = getAccessToken();

  const { 
    data: userInfo,
  } = useGetCurrentUserUsers({
    query: {
      enabled: status === 'authenticated' && !!accessToken,
    },
  });

  useEffect(() => {
    if (userInfo?.data) {
      setUser(userInfo?.data);
    }
  }, [userInfo]);

  return <>{children}</>
}
