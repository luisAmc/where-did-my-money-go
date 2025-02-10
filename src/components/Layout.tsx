import { type ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <main className="relative mx-auto flex h-full w-full max-w-md px-2">
            {children}
        </main>
    );
}
