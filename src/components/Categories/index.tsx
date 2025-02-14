import { ArrowLeftIcon, CatIcon, GridIcon, GripIcon } from 'lucide-react';
import { Button } from '../shared/Button';
import { NewCategoryDrawer } from './NewCategoryDrawer';
import { api, RouterOutputs } from '~/utils/api';
import { Card } from '../shared/Card';
import { useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type CategoryType = RouterOutputs['categories']['all'][number];

export function Categories() {
    const queryClient = api.useUtils();
    const { data, isLoading } = api.categories.all.useQuery();
    const reorderCategories = api.categories.reorder.useMutation({
        onSuccess() {
            queryClient.categories.all.invalidate();
        },
    });

    const categories = data ?? [];

    const [items, setItems] = useState<Array<CategoryType>>([]);

    useEffect(() => {
        if (categories.length === 0) return;
        setItems(categories);
    }, [JSON.stringify(categories)]);

    useEffect(() => {
        if (items.length === 0) return;

        const reorderedCategories = [];
        for (let i = 0; i < items.length; i++) {
            const category = items[i];
            if (category.order !== i) {
                reorderedCategories.push({
                    id: category.id,
                    oldOrder: category.order,
                    newOrder: i,
                });
            }
        }

        if (reorderedCategories.length > 0) {
            reorderCategories.mutateAsync({
                reorderedCategories: reorderedCategories,
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

                <h1 className="text-lg">Categorias</h1>
            </div>

            {/* Categories */}
            {isLoading && <Shimmer />}

            {!isLoading && (
                <>
                    <Card>
                        {categories.length === 0 ? (
                            <EmptyCategories />
                        ) : (
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={items}>
                                    {items.map((item) => (
                                        <SortableCard
                                            key={item.id}
                                            category={item}
                                        />
                                    ))}
                                    {/* <div className="divide-y rounded-lg">
                                        {categories.map((category) => (
                                            <article
                                                key={category.id}
                                                className="px-2 py-4 text-sm font-medium"
                                            >
                                                {category.name}
                                            </article>
                                        ))}
                                    </div> */}
                                </SortableContext>
                            </DndContext>
                        )}
                    </Card>

                    <NewCategoryDrawer />
                </>
            )}
        </div>
    );
}

interface SortableCardProps {
    category: CategoryType;
}

function SortableCard({ category }: SortableCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: category.id,
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
            <span>{category.name}</span>

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

function EmptyCategories() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-10">
            <CatIcon className="text-muted-foreground size-22" />

            <p className="text-muted-foreground text-sm font-medium">
                No hay categorias...
            </p>
        </div>
    );
}
