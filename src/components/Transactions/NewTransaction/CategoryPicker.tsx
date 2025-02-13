import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { api } from '~/utils/api';
import { cn } from '~/utils/cn';

export function CategoryPicker() {
    const { data, isLoading } = api.categories.all.useQuery();

    const drawer = useDrawer();

    const form = useFormContext();
    const { field } = useController({
        control: form.control,
        name: 'category',
    });

    const categories = data ?? [];

    useEffect(() => {
        if (categories.length > 0 && !field.value) {
            field.onChange(categories[0].id);
        }
    }, [categories]);

    const selectedCategoryName = categories.find(
        (category) => category.id === field.value,
    )?.name;

    return (
        <>
            <Button
                disabled={isLoading}
                onClick={drawer.open}
                variant="secondary"
            >
                {selectedCategoryName ?? 'Seleccione una categoría'}
            </Button>

            <Drawer {...drawer.props} title="¿Cúal es la categoría?">
                <section className="flex flex-col space-y-1">
                    {categories.map((category) => {
                        const isSelected = field.value === category.id;

                        return (
                            <Button
                                key={category.id}
                                className={cn(
                                    'h-12 justify-start',
                                    isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : '[&_svg]:invisible',
                                )}
                                onClick={() => {
                                    field.onChange(category.id);
                                    drawer.close();
                                }}
                                variant="outlined"
                            >
                                <CheckIcon className="size-4" />
                                <span>{category.name}</span>
                            </Button>
                        );
                    })}
                </section>

                <Button variant="secondary" onClick={drawer.close}>
                    <XIcon className="size-4" />
                    <span>Cancelar</span>
                </Button>
            </Drawer>
        </>
    );
}
