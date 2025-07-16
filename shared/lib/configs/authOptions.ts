// shared/lib/configs/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? '',
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? '',
    }),
  ],
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url }) {
      return url;
    },
    async jwt({ token, trigger, account, session, user }) {
      if (trigger === 'update') {
        return { ...token, ...session };
      }
      if (account && user) {
        return {
          accessToken: account.access_token,
          user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV !== 'production',
};
