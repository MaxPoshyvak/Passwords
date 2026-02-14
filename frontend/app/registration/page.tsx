'use client';

import React, { useState } from 'react';

import { Input } from '@/Components/Ui/Input';
import Link from 'next/link';

export default function Registration() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Успішна реєстрація:', data);
        } catch (error) {
            console.log(error);
        }

        console.log('Дані форми:', formData);
        alert('Реєстрація успішна! (Демо)');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClasses =
        'w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 focus:bg-white outline-none';
    const labelClasses = 'block text-sm font-medium text-gray-600 mb-1.5';

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 font-sans p-4">
            <div className="w-full max-w-sm">
                {/* Заголовок */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Створити акаунт</h1>
                    <p className="text-gray-500 text-sm">Введіть свої дані для реєстрації</p>
                </div>

                {/* Форма */}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        title="Повне ім'я"
                        type="text"
                        placeholder="Іван Франко"
                        labelClasses={labelClasses}
                        className={inputClasses}
                        handleChange={handleChange}
                    />
                    <Input
                        title="Email"
                        type="email"
                        placeholder="ivan@example.com"
                        labelClasses={labelClasses}
                        className={inputClasses}
                        handleChange={handleChange}
                    />
                    <Input
                        title="Пароль"
                        type="password"
                        placeholder="••••••••"
                        labelClasses={labelClasses}
                        className={inputClasses}
                        handleChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors mt-2 active:scale-95 transform duration-100">
                        Зареєструватися
                    </button>
                </form>

                {/* Футер */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    Вже маєте акаунт?{' '}
                    <Link href="/login" className="font-semibold text-black hover:underline">
                        Увійти
                    </Link>
                </p>
            </div>
        </div>
    );
}
