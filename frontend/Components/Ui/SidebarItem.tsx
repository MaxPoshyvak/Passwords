export function SidebarItem({
    icon,
    label,
    active,
    onClick,
    count,
}: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}>
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            {count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-indigo-100' : 'bg-slate-200'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}
