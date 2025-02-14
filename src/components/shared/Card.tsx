import { type ReactNode } from 'react';
import { cn } from '~/utils/cn';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <section
            className={cn(
                'bg-card text-card-foreground flex flex-col gap-y-2 rounded-lg border p-4',
                className,
            )}
        >
            {children}
        </section>
    );
}
