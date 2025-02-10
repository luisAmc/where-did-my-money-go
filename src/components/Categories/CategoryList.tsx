import { api } from '~/utils/api';

export function CategoryList() {
    const { data, isLoading } = api.categories.all.useQuery();

    const categories = data ?? [];

    if (isLoading) return <p>Cargando categorias...</p>;

    return (
        <ul className="divide-y space-y-1">
            {categories.map((category) => (
                <li key={category.id} className="rounded-lg border px-4 py-2 text-primary">
                    {category.name}
                </li>
            ))}
        </ul>
    );
}
