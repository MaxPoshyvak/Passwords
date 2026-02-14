'use client';

import { useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function MagicLoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const effectRan = useRef(false); // 👈 Цей реф - ключ до успіху
    const [status, setStatus] = useState('Перевірка токена...');

    useEffect(() => {
        // Якщо цей код вже виконувався - стоп. Не йди далі.
        if (effectRan.current === true) return;

        const token = searchParams.get('token');

        if (!token) {
            setStatus('Токен не знайдено');
            return;
        }

        // Ставимо прапорець, що ми почали процес
        effectRan.current = true;
        setStatus('Авторизація...');

        // Викликаємо NextAuth
        signIn('magiclink', {
            token,
            email: 'login-via-token', // Ми не використовуємо email тут, але NextAuth чекає цей параметр
            redirect: false, // 👈 Ставимо false, щоб ми самі керували редіректом
        }).then((result) => {
            if (result?.error) {
                setStatus('Помилка входу');
            } else {
                setStatus('Успіх! Входимо...');

                // ❌ БУЛО (м'який перехід, сесія не оновлюється):
                // router.push('/dashboard');

                // ✅ СТАЛО (жорстке перезавантаження, змушує браузер прочитати нову сесію):
                window.location.href = '/';
            }
        });
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">{status}</h1>
        </div>
    );
}
