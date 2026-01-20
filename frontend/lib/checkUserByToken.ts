import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models/User';

export async function checkUserByToken() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return null; //
    }

    const user = await User.findOne({
        email: session.user.email,
    });

    return user; // User | null
}
