import { type ReactNode, useState } from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { cn } from '~/utils/cn';

export function useDrawer() {
    const [open, setOpen] = useState(false);

    return {
        open: () => setOpen(true),
        close: () => setOpen(false),
        props: {
            open: open,
            onClose: () => setOpen(false),
        },
    };
}

export interface DrawerProps {
    title?: string;
    open: boolean;
    onClose(): void;
    direction?: 'default' | 'side';
    dismissible?: boolean;
    children: ReactNode;
}

export function Drawer({
    title,
    open,
    onClose,
    direction = 'default',
    dismissible = true,
    children,
}: DrawerProps) {
    return (
        <VaulDrawer.Root
            repositionInputs={false}
            dismissible={dismissible}
            open={open}
            onClose={onClose}
            direction={direction === 'default' ? 'bottom' : 'right'}
        >
            <VaulDrawer.Portal>
                <VaulDrawer.Overlay
                    className={cn('fixed inset-0 z-50 bg-black/40')}
                />

                <VaulDrawer.Content
                    aria-describedby={undefined}
                    className={cn(
                        'bg-background fixed bottom-0 z-50 mt-24 flex flex-col border',
                        {
                            'inset-x-0 h-auto max-h-[96%] rounded-t-[10px]':
                                direction === 'default',
                            'right-0 h-full w-full max-w-[96%] rounded-l-[10px]':
                                direction === 'side',
                        },
                    )}
                >
                    <div
                        className={cn(
                            'mx-auto my-4',
                            dismissible && direction === 'default'
                                ? 'bg-muted h-2 w-[100px] rounded-full'
                                : 'my-3',
                        )}
                    />

                    <div className="mx-auto mb-8 w-full max-w-md px-4">
                        <VaulDrawer.Title className="text-primary text-lg font-medium">
                            {title}
                        </VaulDrawer.Title>

                        <div className="mt-4 flex flex-col gap-y-4">
                            {children}
                        </div>
                    </div>
                </VaulDrawer.Content>
            </VaulDrawer.Portal>
        </VaulDrawer.Root>
    );
}
