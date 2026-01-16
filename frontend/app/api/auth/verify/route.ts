import { MagicToken } from '@/models/MagicToken';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    await connectDB();
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ message: 'Token required' }, { status: 400 });
    }

    const magicToken = await MagicToken.findOne({ token });

    if (!magicToken) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    if (magicToken.used) {
        return NextResponse.json({ message: 'Token already used' }, { status: 400 });
    }

    if (magicToken.expiresAt < new Date()) {
        return NextResponse.json({ message: 'Token expired' }, { status: 400 });
    }

    magicToken.used = true;
    await magicToken.save();

    const user = await User.findOne({ email: magicToken.email });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    // 🔐 створюємо JWT
    const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });

    if (!accessToken) {
        return NextResponse.json({ message: 'Failed to create access token' }, { status: 500 });
    }

    return NextResponse.json(
        {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
            token: accessToken,
        },
        { status: 200 }
    );
}
