'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Menu, Plus, Search } from 'lucide-react';

interface Props {
    className?: string;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const Header: React.FC<Props> = ({ setIsModalOpen, setIsSidebarOpen, searchQuery, setSearchQuery }) => {
    return (
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 flex items-center justify-between gap-4">
            <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
            </button>

            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Пошук паролів..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm hover:shadow-indigo-200 shadow-indigo-100">
                <Plus size={18} />
                <span className="hidden sm:inline">Додати</span>
            </button>
        </header>
    );
};
