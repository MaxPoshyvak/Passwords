import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // перевір шлях
import { PasswordEntry } from '@/models/Password'; // перевір шлях

// Зверни увагу: params тепер Promise
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Обов'язково чекаємо params (для Next.js 15)
        const { id } = await params;

        console.log('Delete request for ID:', id); // Лог для перевірки

        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        await connectDB();

        // 2. Видаляємо зайві пробіли (trim) на випадок помилок копіювання
        const deleted = await PasswordEntry.findByIdAndDelete(id.trim());

        if (!deleted) {
            return NextResponse.json({ message: 'Password not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Password deleted' }, { status: 200 });
    } catch (error) {
        console.error('Delete Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
