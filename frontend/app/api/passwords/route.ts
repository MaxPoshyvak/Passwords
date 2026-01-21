import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PasswordEntry } from '@/models/Password';
// import { decrypt } from '@/lib/crypto';
import { checkUserByToken } from '@/lib/checkUserByToken';
import { encrypt, decrypt } from '@/lib/crypto';

export async function GET() {
    try {
        await connectDB();

        const user = await checkUserByToken(); // з JWT / cookie
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const entries = await PasswordEntry.find({ userId: user._id }).lean();

        const data = entries.map((entry) => ({
            _id: entry._id,
            title: entry.title,
            username: entry.username,
            password: decrypt(entry.encryptedPassword),
            url: entry.url,
            category: entry.category,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const user = await checkUserByToken(); // з JWT / cookie
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { title, username, password, url, category } = await request.json();

        const newEntry = new PasswordEntry({
            userId: user._id,
            title,
            username,
            encryptedPassword: encrypt(password),
            url,
            category,
        });

        await newEntry.save();

        return NextResponse.json(
            {
                _id: newEntry._id,
                title: newEntry.title,
                username: newEntry.username,
                password: decrypt(newEntry.encryptedPassword),
                url: newEntry.url,
                category: newEntry.category,
                createdAt: newEntry.createdAt,
                updatedAt: newEntry.updatedAt,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
