import { ArrowLeftIcon, CatIcon, GripIcon } from 'lucide-react';
import { Button } from '../shared/Button';
import { NewAccountDrawer } from './NewAccountDrawer';
import { api, RouterOutputs } from '~/utils/api';
import { Card } from '../shared/Card';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';

type AccountType = RouterOutputs['accounts']['all'][number];

export function Accounts() {
    const queryClient = api.useUtils();
    const { data, isLoading } = api.accounts.all.useQuery();
    const reorderAccounts = api.accounts.reorder.useMutation({
        onSuccess() {
            queryClient.accounts.all.invalidate();
        },
    });

    const accounts = data ?? [];

    const [items, setItems] = useState<Array<AccountType>>([]);

    useEffect(() => {
        if (accounts.length === 0) return;
        setItems(accounts);
    }, [JSON.stringify(accounts)]);

    useEffect(() => {
        if (items.length === 0) return;

        const reorderedAccounts = [];
        for (let i = 0; i < items.length; i++) {
            const account = items[i];
            if (account.order !== i) {
                reorderedAccounts.push({
                    id: account.id,
                    oldOrder: account.order,
                    newOrder: i,
                });
            }
        }

        if (reorderedAccounts.length > 0) {
            reorderAccounts.mutateAsync({
                reorderedAccounts: reorderedAccounts,
            });
        }
    }, [JSON.stringify(items)]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over !== null && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id,
                );

                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className="mx-2 flex flex-col gap-y-4">
            {/* Title */}
            <div className="mt-2 flex items-center gap-x-2">
                <Button href="/" variant="ghost" size="icon">
                    <ArrowLeftIcon className="size-5" />
                </Button>

                <h1 className="text-lg">Cuentas</h1>
            </div>

            {/* Accounts */}
            {isLoading && <Shimmer />}

            {!isLoading && (
                <>
                    <Card>
                        {accounts.length === 0 ? (
                            <EmptyAccounts />
                        ) : (
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={items}>
                                    {items.map((item) => (
                                        <SortableCard
                                            key={item.id}
                                            account={item}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </Card>

                    <NewAccountDrawer />
                </>
            )}
        </div>
    );
}

interface SortableCardProps {
    account: AccountType;
}

function SortableCard({ account }: SortableCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: account.id,
            transition: {
                duration: 150,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
        });

    return (
        <div
            ref={setNodeRef}
            className="bg-secondary text-secondary-foreground flex items-center justify-between rounded-md px-2 py-4 text-sm font-medium"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <span>{account.name}</span>

            <Button size="icon" variant="ghost" {...attributes} {...listeners}>
                <GripIcon className="size-4" />
            </Button>
        </div>
    );
}

function Shimmer() {
    return (
        <div className="animate-pulse space-y-2">
            <div className="divide-y rounded-lg border">
                <div className="px-2 py-4">
                    <div className="bg-muted h-4 w-36 rounded-md"></div>
                </div>
                <div className="px-2 py-4">
                    <div className="bg-muted h-4 w-36 rounded-md"></div>
                </div>
                <div className="px-2 py-4">
                    <div className="bg-muted h-4 w-36 rounded-md"></div>
                </div>
            </div>

            <div className="bg-secondary h-10 rounded-md"></div>
        </div>
    );
}

function EmptyAccounts() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-10">
            <CatIcon className="text-muted-foreground size-22" />

            <p className="text-muted-foreground text-sm font-medium">
                No hay cuentas...
            </p>
        </div>
    );
}
