import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import Link from 'next/link';
import { Header } from '@/Components/Shared';
export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <>
                <h1>Please login</h1>
                <Link href="/login" className="underline">
                    here
                </Link>
            </>
        );
    }

    return (
        <div>
            <Header className="mb-8" />
            <h1 className="text-2xl font-bold mb-4">Home</h1>
            <p>Welcome, {session.user?.name}!</p>
        </div>
    );
}
