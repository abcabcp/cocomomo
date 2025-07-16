'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginAuth } from '@/entities/api/query/auth';
import { setAccessToken, setRefreshToken } from '@/shared/lib/utils/accessToken';
import { clearTokens } from '@/entities/api/api';

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
          router.push(callbackUrl);
        }
      },
      onError: () => {
        console.log('[ERROR] useLoginAuth ', status, session);
        clearTokens();
        router.push(callbackUrl);
      }
    },
  });

  const handleLogin = async () => {
    console.log('[handleLogin] ', status, session);
    if (!session?.accessToken) {
      console.log('[handleLogin] accessToken is not found');
      clearTokens();
      router.push(callbackUrl);
      return;
    }
    const payload = {
      accessToken: session.accessToken,
      platform: 'github' as const,
    };
    console.log('[handleLogin] accessToken is found');
    await login({ data: payload });
  };


  useEffect(() => {
    console.log('[BEFORE] ', status, session);
    if (status === 'loading') return;
    console.log('[AFTER] ', status, session)
    handleLogin();
  }, [status, session]);

  return <div>Redirecting to login...</div>;
}