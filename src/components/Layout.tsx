import { api } from '~/utils/api';
import { Button } from './shared/Button';
import { formatDate } from '~/utils/transforms';
import { LogOutIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { useAuthRedirect } from '~/utils/useAuthRedirect';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <main className="mx-auto flex h-full w-full max-w-md flex-col">
            <Header />

            {children}
        </main>
    );
}

function Header() {
    const authRedirect = useAuthRedirect();
    const today = new Date();

    const logout = api.auth.logout.useMutation({
        onSuccess() {
            authRedirect();
        },
    });

    return (
        <nav className="bg-primary text-primary-foreground sticky top-0 z-10 flex items-center justify-start p-4">
            <Button
                size="icon"
                variant="ghost"
                onClick={() => logout.mutateAsync()}
            >
                <LogOutIcon className="text-primary-foreground size-5" />
            </Button>

            <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
                <div className="text-muted-foreground text-xs font-medium uppercase">
                    Hoy es
                </div>
                <div className="text-primary-foreground font-medium capitalize">
                    {formatDate(today, 'E, d MMM')}
                </div>
            </div>

            {/* <SettingsDrawer /> */}
        </nav>
    );
}
