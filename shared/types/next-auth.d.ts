import type { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user?: DefaultSession['user'] & {
      id?: number;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id?: number;
      name?: string;
      email?: string;
      image?: string;
    };
    error?: 'RefreshAccessTokenError' | 'AuthenticationFailed';
  }
}
