'use client';

import { clearTokens } from '@/entities/api/api';
import { useLoginAuth } from '@/entities/api/query/auth';
import { setAccessToken, setRefreshToken } from '@/shared/lib/utils/accessToken';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Page() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const router = useRouter();
  const isProcessing = useRef(false);

  const { mutateAsync: login } = useLoginAuth({
    mutation: {
      onSuccess: (result) => {
        const { data } = result;
        if (data?.accessToken && data?.refreshToken) {
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          router.push(callbackUrl);
        } else {
          clearTokens();
          setTimeout(() => router.push('/'), 3000);
        }
      },
      onError: () => {
        clearTokens();
        setTimeout(() => router.push('/'), 3000);
      }
    },
  });

  const handleLogin = async () => {
    if (isProcessing.current) return;

    try {
      isProcessing.current = true;
      if (!session?.accessToken) {
        clearTokens();
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      const payload = {
        accessToken: session.accessToken,
        platform: 'github' as const,
      };

      await login({ data: payload });
    } catch (error) {
      clearTokens();
      setTimeout(() => router.push('/'), 3000);
    } finally {
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      handleLogin();
    } else if (status === 'unauthenticated') {
      clearTokens();
      setTimeout(() => router.push('/'), 3000);
    }
  }, [status, session]);

  return (
    <p>login...</p>
  );
}