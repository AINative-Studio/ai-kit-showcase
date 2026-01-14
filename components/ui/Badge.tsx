'use client';

import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                {
                    'bg-muted text-muted-foreground': variant === 'default',
                    'bg-primary/20 text-primary': variant === 'primary',
                    'bg-secondary/20 text-secondary': variant === 'secondary',
                    'badge-safe': variant === 'success',
                    'badge-warning': variant === 'warning',
                    'badge-danger': variant === 'danger',
                },
                className
            )}
            {...props}
        />
    );
}
