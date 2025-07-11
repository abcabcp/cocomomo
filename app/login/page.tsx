'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginAuth } from '@/entities/api/query/auth';
import { getAccessToken, setAccessToken, setRefreshToken } from '@/shared/lib/utils/accessToken';

export default function Page() {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';
  const router = useRouter();
  const { mutateAsync: login } = useLoginAuth({
    mutation: {
      onSuccess: (result) => {
        const { data } = result;
        if (data?.accessToken && data?.refreshToken) {
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
        }
        router.push(callbackUrl);
      },
    },
  });

  const handleLogin = async () => {
    if (!session?.accessToken) return;
    const payload = {
      accessToken: session.accessToken,
      platform: 'github' as const,
    };
    await login({ data: payload });
  };


  useEffect(() => {
    if (status === 'loading' || getAccessToken()) return;
    handleLogin();
  }, [status, session]);

  return <div>Redirecting to login...</div>;
}