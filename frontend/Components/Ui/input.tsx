import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    type: string;
    placeholder?: string;
    title: string;
    labelClasses?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<Props> = ({ title, type, placeholder, labelClasses, className, handleChange }) => {
    return (
        <div>
            <label htmlFor="name" className={labelClasses}>
                {title}
            </label>
            <input
                id="name"
                name="name"
                type={type}
                required
                placeholder={placeholder}
                className={cn(className, '')}
                onChange={handleChange}
            />
        </div>
    );
};
