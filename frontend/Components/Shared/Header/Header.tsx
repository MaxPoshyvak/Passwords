'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    return (
        <header className={cn('', className)}>
            <button onClick={() => signOut({ callbackUrl: '/login' })}>Logout</button>
        </header>
    );
};
