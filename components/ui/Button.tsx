'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-medium rounded-lg transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    {
                        'bg-gradient-to-r from-primary to-secondary text-white glow-primary-hover hover:opacity-90':
                            variant === 'primary',
                        'bg-secondary text-secondary-foreground hover:opacity-90':
                            variant === 'secondary',
                        'border border-border bg-transparent hover:bg-muted':
                            variant === 'outline',
                        'bg-transparent hover:bg-muted':
                            variant === 'ghost',
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2 text-sm': size === 'md',
                        'px-6 py-3 text-base': size === 'lg',
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
