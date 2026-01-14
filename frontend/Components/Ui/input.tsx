import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

export const input: React.FC<Props> = ({ className }) => {
    return <input className={cn('w-5 h-[90%] bg-grey-300', className)} />;
};
