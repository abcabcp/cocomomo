'use client';

import { signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function useAuth() {
  const pathname = usePathname();
  const handleGithubLogin = async () => {
    const result = await signIn('github', {
      redirect: true,
      callbackUrl: pathname,
    });
    return result;
  };

  const handleGithubLogout = async () => {
    const result = await signOut();
    return result;
  };

  return { handleGithubLogin, handleGithubLogout };
}
