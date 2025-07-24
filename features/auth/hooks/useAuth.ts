'use client';

import { signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { clearTokens } from '@/shared/lib/utils/accessToken';
import { useUserStore } from '@/shared/store';

export function useAuth() {
  const pathname = usePathname();
  const { data: session, update } = useSession();
  const setUser = useUserStore((state) => state.setUser);

  const handleGithubLogin = async () => {
    if (!session?.accessToken) {
      await signIn('github', {
        callbackUrl: pathname,
      });
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    await update().then(() => {
      clearTokens();
      setUser(null);
      window.location.reload();
    });
  };

  return { handleGithubLogin, handleLogout };
}
