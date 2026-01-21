import { useState } from 'react';
import type { Category, PasswordEntryWithId } from '@/types/PasswordsTypes/PasswordTypes';
import { Eye, EyeOff, Trash2, Copy } from 'lucide-react';
import Link from 'next/link';
import getFullUrl from '@/lib/getFullUrl';

export function PasswordCard({
    entry,
    onDelete,
    onCopy,
}: {
    entry: PasswordEntryWithId;
    onDelete: (id: string) => void;
    onCopy: (msg: string) => void;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        onCopy(`${type} скопійовано!`);
    };

    const getCategoryColor = (cat: Category) => {
        switch (cat) {
            case 'social':
                return 'bg-blue-100 text-blue-600';
            case 'finance':
                return 'bg-emerald-100 text-emerald-600';
            case 'work':
                return 'bg-orange-100 text-orange-600';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryColor(entry.category)}`}>
                        {entry.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{entry.title}</h3>
                        <Link href={getFullUrl(entry.url)} target="_blank" className="text-xs text-slate-500 underline">
                            {entry.url || 'website'}
                        </Link>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onDelete(entry._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Видалити">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between group/field">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                            Логін / Email
                        </span>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-37.5">{entry.username}</span>
                    </div>
                    <button
                        onClick={() => copyToClipboard(entry.username, 'Логін')}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md opacity-0 group-hover/field:opacity-100 transition-all">
                        <Copy size={14} />
                    </button>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between group/field">
                    <div className="flex flex-col flex-1 mr-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                            Пароль
                        </span>
                        <div className="text-sm font-mono text-slate-700 h-5 flex items-center">
                            {showPassword ? entry.password : '••••••••••••'}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-all">
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                            onClick={() => copyToClipboard(entry.password, 'Пароль')}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md opacity-0 group-hover/field:opacity-100 transition-all">
                            <Copy size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
