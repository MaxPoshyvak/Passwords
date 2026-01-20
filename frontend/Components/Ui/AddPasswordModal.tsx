import { useState } from 'react';
import type { PasswordEntry, Category } from '@/types/PasswordsTypes/PasswordTypes';
import React, { useMemo } from 'react';
import { Eye, EyeOff, X, RefreshCw } from 'lucide-react';

export function AddPasswordModal({ onClose, onSave }: { onClose: () => void; onSave: (entry: PasswordEntry) => void }) {
    const [formData, setFormData] = useState({
        title: '',
        username: '',
        password: '',
        url: '',
        category: 'personal' as Category,
    });
    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let pass = '';
        for (let i = 0; i < 16; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, password: pass });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.password) return;

        onSave({
            ...formData,
        });
    };

    // Strength simple calculator
    const strength = useMemo(() => {
        const l = formData.password.length;
        if (l === 0) return 0;
        if (l < 8) return 1;
        if (l < 12) return 2;
        return 3;
    }, [formData.password]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Додати пароль</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Назва сервісу</label>
                        <input
                            required
                            type="text"
                            placeholder="напр. Netflix"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Категорія</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}>
                                <option value="personal">Особисте</option>
                                <option value="work">Робота</option>
                                <option value="social">Соцмережі</option>
                                <option value="finance">Фінанси</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Веб-сайт (опц.)</label>
                            <input
                                type="text"
                                placeholder="netflix.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Ім'я користувача / Email
                        </label>
                        <input
                            type="text"
                            placeholder="email@example.com"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">Пароль</label>
                            <button
                                type="button"
                                onClick={generatePassword}
                                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                                <RefreshCw size={12} />
                                Згенерувати
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono pr-10"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        <div className="flex gap-1 mt-2 h-1">
                            <div
                                className={`flex-1 rounded-full transition-colors ${strength >= 1 ? (strength === 1 ? 'bg-red-400' : 'bg-yellow-400') : 'bg-slate-200'}`}></div>
                            <div
                                className={`flex-1 rounded-full transition-colors ${strength >= 2 ? (strength === 2 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-slate-200'}`}></div>
                            <div
                                className={`flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-200">
                            Зберегти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
