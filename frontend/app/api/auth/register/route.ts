import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    await connectDB();

    const { email, password, name } = await req.json();

    const user = await User.create({ email, password, name });

    return NextResponse.json(user);
}
