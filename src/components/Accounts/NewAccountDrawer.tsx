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

const newAccountSchema = z.object({
    name: stringShape.min(1, 'Ingrese el nombre.'),
});

export function NewAccountDrawer() {
    const drawer = useDrawer();

    const form = useZodForm({ schema: newAccountSchema });

    const queryClient = api.useUtils();
    const createAccount = api.accounts.create.useMutation({
        onSuccess() {
            queryClient.accounts.all.invalidate();
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
                <span>Crear cuenta</span>
            </Button>

            <Drawer {...drawer.props} title="Nueva cuenta">
                <Form
                    form={form}
                    onSubmit={(input) =>
                        createAccount.mutateAsync({ name: input.name })
                    }
                >
                    <ErrorMessage
                        title="Error de ingreso"
                        error={createAccount.error?.message}
                    />

                    <Input
                        {...form.register('name')}
                        label="Nombre"
                        placeholder="¿Como se llamará cuenta?"
                    />

                    <SubmitButton>Crear</SubmitButton>
                </Form>
            </Drawer>
        </>
    );
}
