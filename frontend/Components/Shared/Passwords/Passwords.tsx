'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import type { Category, PasswordEntryWithId } from '@/types/PasswordsTypes/PasswordTypes';

import { AddPasswordModal, PasswordCard } from '@/Components/Ui';
import { Sidebar, Header } from '@/Components/Shared';

export function Passwords() {
    const [entries, setEntries] = useState<PasswordEntryWithId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Filter Logic
    const filteredEntries = useMemo(() => {
        return entries.filter((entry) => {
            const matchesSearch =
                entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.username.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [entries, searchQuery, selectedCategory]);

    // Fetch passwords from backend
    useEffect(() => {
        const getPasswordsFromBackend = async () => {
            try {
                setIsLoading(true);

                const response = await fetch('/api/passwords', { method: 'GET', credentials: 'include' });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch passwords');
                }

                setEntries(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        getPasswordsFromBackend();
    }, []);

    // Actions
    const handleDelete = async (id: string) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей пароль?')) return;

        try {
            const response = await fetch(`/api/passwords/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to delete password');

            setEntries((prev) => prev.filter((e) => e._id !== id));
            showToast('Пароль видалено');
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (formData: Omit<PasswordEntryWithId, '_id' | 'createdAt'>) => {
        try {
            const response = await fetch('/api/passwords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Failed to add password');

            setEntries((prev) => [data, ...prev]);
            setIsModalOpen(false);
            showToast('Новий пароль додано');
        } catch (error) {
            console.error(error);
        }
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                entries={entries}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <Header
                    setIsModalOpen={setIsModalOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 text-slate-400">Завантаження...</div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} />
                            </div>
                            <p className="text-lg font-medium">Нічого не знайдено</p>
                            <p className="text-sm">Спробуйте змінити запит або додати новий пароль</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredEntries.map((entry) => (
                                <PasswordCard
                                    key={entry._id}
                                    entry={entry}
                                    onDelete={handleDelete}
                                    onCopy={showToast}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="absolute bottom-6 right-6 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up z-50">
                        <CheckCircle2 size={18} className="text-green-400" />
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </div>
                )}
            </main>

            {/* Add Password Modal */}
            {isModalOpen && <AddPasswordModal onClose={() => setIsModalOpen(false)} onSave={handleAdd} />}
        </div>
    );
}
