import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import type { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            id: 'magiclink',
            name: 'magiclink',
            credentials: {
                email: { label: 'Email', type: 'email' },
                token: { label: 'Token', type: 'text' },
            },
            async authorize(credentials) {
                try {
                    await connectDB();

                    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/auth/verify?token=${credentials?.token}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        console.log('Failed to verify token:', response.statusText);
                        return null;
                    }
                    const data = await response.json();

                    return {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        username: data.user.username,
                        accessToken: data.token,
                    };
                } catch (error) {
                    console.log(error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },

    callbacks: {
        // Тут ми переносимо дані з User (від authorize) в Token (JWT cookie)
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = (user as any).accessToken; // Зберігаємо токен
                token.username = (user as any).username; // Зберігаємо юзернейм
            }
            return token;
        },

        // Тут ми переносимо дані з Token в Session (те, що доступно в useSession)
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).accessToken = token.accessToken;
                (session.user as any).username = token.username;
            }
            return session;
        },
    },
};
