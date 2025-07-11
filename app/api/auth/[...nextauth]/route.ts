import NextAuth from 'next-auth';
import { authOptions } from '@/shared/lib/configs';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
