'use client';

import React from 'react';
import Swal from 'sweetalert2';

interface Props {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategory: Category;
    setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
    entries: Array<any>;
}

import { Lock, Globe, Key, ShieldCheck, LogOut } from 'lucide-react';
import { SidebarItem } from '@/Components/Ui';
import { Category } from '@/types/PasswordsTypes/PasswordTypes';
import { signOut } from 'next-auth/react';

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, selectedCategory, setSelectedCategory, entries }: Props) {
    return (
        <aside
            className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                </div>
                <h1 className="text-xl font-bold text-slate-800">Passwords</h1>
            </div>

            <nav className="p-4 space-y-1">
                <SidebarItem
                    icon={<Lock size={18} />}
                    label="Усі паролі"
                    active={selectedCategory === 'all'}
                    onClick={() => {
                        setSelectedCategory('all');
                        setIsSidebarOpen(false);
                    }}
                    count={entries.length}
                />
                <SidebarItem
                    icon={<Globe size={18} />}
                    label="Соціальні мережі"
                    active={selectedCategory === 'social'}
                    onClick={() => {
                        setSelectedCategory('social');
                        setIsSidebarOpen(false);
                    }}
                />
                <SidebarItem
                    icon={<Key size={18} />}
                    label="Робота"
                    active={selectedCategory === 'work'}
                    onClick={() => {
                        setSelectedCategory('work');
                        setIsSidebarOpen(false);
                    }}
                />
                <SidebarItem
                    icon={<ShieldCheck size={18} />}
                    label="Фінанси"
                    active={selectedCategory === 'finance'}
                    onClick={() => {
                        setSelectedCategory('finance');
                        setIsSidebarOpen(false);
                    }}
                />
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
                <button
                    onClick={async () => {
                        const result = await Swal.fire({
                            title: 'Вийти з акаунта?',
                            text: 'Вам доведеться знову увійти, щоб отримати доступ до паролів.',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Вийти',
                            cancelButtonText: 'Скасувати',
                            reverseButtons: true,
                            confirmButtonColor: '#ef4444',
                            cancelButtonColor: '#6b7280',
                            focusCancel: true,
                        });

                        if (result.isConfirmed) {
                            signOut({ callbackUrl: '/login' });
                        }
                    }}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-600 w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                    <LogOut size={18} />
                    <span>Вийти</span>
                </button>
            </div>
        </aside>
    );
}
