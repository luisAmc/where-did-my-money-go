import { ArrowLeftIcon, CatIcon } from 'lucide-react';
import { Button } from '../shared/Button';
import { NewCategoryDrawer } from './NewCategoryDrawer';
import { api } from '~/utils/api';

export function Categories() {
    const { data, isLoading } = api.categories.all.useQuery();

    const categories = data ?? [];

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
                <div className="flex flex-col gap-y-2">
                    {categories.length === 0 ? (
                        <EmptyCategories />
                    ) : (
                        <div className="divide-y rounded-lg border">
                            {categories.map((category) => (
                                <article
                                    key={category.id}
                                    className="px-2 py-4"
                                >
                                    {category.name}
                                </article>
                            ))}
                        </div>
                    )}

                    <NewCategoryDrawer />
                </div>
            )}
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
