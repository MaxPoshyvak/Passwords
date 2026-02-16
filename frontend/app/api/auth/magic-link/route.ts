import { User } from '@/models/User';
import { MagicToken } from '@/models/MagicToken';
import { generateToken } from '@/utils/generateToken';
import { connectDB } from '@/lib/mongodb';
import { sendMagicLinkEmail } from '@/lib/email';

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return new Response(JSON.stringify({ message: 'Email required' }), { status: 400 });
    }

    await connectDB();
    await User.findOneAndUpdate({ email }, { email }, { upsert: true });

    const token = generateToken();

    await MagicToken.create({
        email,
        token,
        used: false,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 хв
    });

    const link = `${BASE_URL.replace(/\/$/, '')}/magic-login?token=${token}`;

    try {
        await sendMagicLinkEmail(email, link);
    } catch (err) {
        console.error('Failed to send magic link email:', err);
        return new Response(
            JSON.stringify({ message: 'Failed to send email. Check SMTP configuration.' }),
            { status: 500 }
        );
    }

    return new Response(JSON.stringify({ message: 'Magic link sent' }), { status: 200 });
}
