'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

function MagicLoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const effectRan = useRef(false);
    const [status, setStatus] = useState('Перевірка токена...');

    useEffect(() => {
        if (effectRan.current === true) return;

        const token = searchParams.get('token');

        if (!token) {
            queueMicrotask(() => setStatus('Токен не знайдено'));
            return;
        }

        effectRan.current = true;
        queueMicrotask(() => setStatus('Авторизація...'));

        signIn('magiclink', {
            token,
            email: 'login-via-token',
            redirect: false,
        }).then((result) => {
            if (result?.error) {
                setStatus('Помилка входу');
            } else {
                setStatus('Успіх! Входимо...');
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

export default function MagicLoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-bold">Перевірка токена...</h1></div>}>
            <MagicLoginContent />
        </Suspense>
    );
}
