import { PlusIcon } from 'lucide-react';
import { Button } from '../shared/Button';
import { Drawer, useDrawer } from '../shared/Drawer';
import { Form, useZodForm } from '../shared/Form';
import { z } from 'zod';
import { stringShape } from '~/utils/shapes';
import { Input } from '../shared/Input';
import { SubmitButton } from '../shared/SubmitButton';
import { api } from '~/utils/api';
import { ErrorMessage } from '../shared/ErrorMessage';

const newCategorySchema = z.object({
    name: stringShape.min(1, 'Ingrese el nombre.'),
});

export function NewCategoryDrawer() {
    const drawer = useDrawer();

    const form = useZodForm({ schema: newCategorySchema });

    const queryClient = api.useUtils();
    const createCategory = api.categories.create.useMutation({
        onSuccess() {
            queryClient.categories.all.invalidate();
            drawer.close();
            form.reset();
        },
        onError() {
            form.reset(form.getValues());
        },
    });

    return (
        <>
            <Button onClick={drawer.open} variant="secondary">
                <PlusIcon className="size-4" />
                <span>Crear categoría</span>
            </Button>

            <Drawer {...drawer.props} title="Nueva categoría">
                <Form
                    form={form}
                    onSubmit={(input) =>
                        createCategory.mutateAsync({ name: input.name })
                    }
                >
                    <ErrorMessage
                        title="Error de ingreso"
                        error={createCategory.error?.message}
                    />

                    <Input
                        {...form.register('name')}
                        label="Nombre"
                        placeholder="¿Como se llamará la categoría?"
                    />

                    <SubmitButton>Crear</SubmitButton>
                </Form>
            </Drawer>
        </>
    );
}
