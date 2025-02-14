import { api, RouterOutputs } from '~/utils/api';
import { Drawer, useDrawer } from '../shared/Drawer';
import { Form, useZodForm } from '../shared/Form';
import { z } from 'zod';
import { stringShape } from '~/utils/shapes';
import { ErrorMessage } from '../shared/ErrorMessage';
import { Input } from '../shared/Input';
import { SubmitButton } from '../shared/SubmitButton';
import { useEffect } from 'react';

const editCategorySchema = z.object({
    name: stringShape.min(1, 'Ingrese el nombre.'),
});

interface EditCategoryDrawerProps {
    category: RouterOutputs['categories']['all'][number] | null;
    onClose: () => void;
}

export function EditCategoryDrawer({
    category,
    onClose,
}: EditCategoryDrawerProps) {
    const drawer = useDrawer();

    const form = useZodForm({ schema: editCategorySchema });

    useEffect(() => {
        if (!category) return;
        form.setValue('name', category.name);
    }, [category]);

    const queryClient = api.useUtils();
    const editCategory = api.categories.edit.useMutation({
        onSuccess() {
            queryClient.categories.all.invalidate();
            form.reset();

            handleClose();
        },
        onError() {
            form.reset(form.getValues());
        },
    });

    function handleClose() {
        drawer.close();
        onClose();
    }

    return (
        <Drawer
            open={Boolean(category)}
            onClose={handleClose}
            title="Editar categoría"
        >
            {category && (
                <Form
                    form={form}
                    onSubmit={(input) =>
                        editCategory.mutateAsync({
                            id: category.id,
                            name: input.name,
                        })
                    }
                >
                    <ErrorMessage
                        title="Error de edición"
                        error={editCategory.error?.message}
                    />

                    <Input
                        {...form.register('name')}
                        label="Nombre"
                        placeholder="¿Como se llamará la categoría?"
                    />

                    <SubmitButton>Crear</SubmitButton>
                </Form>
            )}
        </Drawer>
    );
}
