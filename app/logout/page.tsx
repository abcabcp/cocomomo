'use client';

import { clearTokens } from '@/shared/lib/utils/accessToken';
import { signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignOutPage() {
    const params = useSearchParams();
    const callbackUrl = params.get('callback_url') || '/';
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                await signOut({ redirect: false });

                if (typeof window !== 'undefined') {
                    sessionStorage.clear();
                    clearTokens();

                    setTimeout(() => {
                        window.location.replace(callbackUrl);
                    }, 3000);
                }
            } catch (error) {
                console.error('Cookie deletion error:', error);
                await signOut({ callbackUrl, redirect: true });
            }
        };

        if (isMounted) {
            handleSignOut();
        }
    }, [isMounted, callbackUrl]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return <div>Signing out...</div>
}
