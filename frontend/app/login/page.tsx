'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function MagicLinkLogin() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || isLoading) return;

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/magic-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                console.log('Failed to send magic link');
            }

            console.log(`Magic link надіслано на: ${email}`);
            setIsSent(true);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses =
        'w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 focus:bg-white outline-none';

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 font-sans p-4">
                <div className="w-full max-w-sm text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Перевірте пошту</h2>
                    <p className="text-gray-500 mb-6">
                        Ми надіслали посилання для входу на <br />
                        <span className="font-semibold text-gray-900">{email}</span>
                    </p>
                    <button
                        onClick={() => setIsSent(false)}
                        className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
                        ← Ввести іншу пошту
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 font-sans p-4">
            <div className="w-full max-w-sm">
                {/* Заголовок */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Вхід в акаунт</h1>
                    <p className="text-gray-500 text-sm">Введіть email для отримання Magic Link</p>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            value={email}
                            placeholder="name@company.com"
                            className={inputClasses}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors mt-2 active:scale-95 transform duration-100 disabled:opacity-60 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="inline-block h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                <span>Надсилання...</span>
                            </span>
                        ) : (
                            'Надіслати посилання'
                        )}
                    </button>
                </form>

                {/* Футер */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    Немає акаунту?{' '}
                    <Link href="/registration" className="font-semibold text-black hover:underline">
                        Створити
                    </Link>
                </p>
            </div>
        </div>
    );
}
