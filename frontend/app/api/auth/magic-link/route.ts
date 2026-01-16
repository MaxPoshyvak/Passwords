import { User } from '@/models/User';
import { MagicToken } from '@/models/MagicToken';
import { generateToken } from '@/utils/generateToken';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return new Response(JSON.stringify({ message: 'Email required' }), { status: 400 });
    }

    await connectDB();
    // створюємо користувача, якщо нема
    await User.findOneAndUpdate({ email }, { email }, { upsert: true });

    const token = generateToken();

    await MagicToken.create({
        email,
        token,
        used: false,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 хв
    });

    const link = `http://localhost:3000/magic-login?token=${token}`;

    // await sendMagicLinkEmail(email, link);

    console.log('Magic link sent to:', email, link);

    return new Response(JSON.stringify({ message: 'Magic link sent' }), { status: 200 });
}
