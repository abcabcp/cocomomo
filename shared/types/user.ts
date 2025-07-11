import { DefaultSession } from 'next-auth';

export type User = DefaultSession['user'] & {
  id?: number;
  role?: string;
  accessToken?: string;
  refreshToken?: string;
};
