import { api, RouterOutputs } from '~/utils/api';
import { Drawer, useDrawer } from '../shared/Drawer';
import { Form, useZodForm } from '../shared/Form';
import { z } from 'zod';
import { stringShape } from '~/utils/shapes';
import { ErrorMessage } from '../shared/ErrorMessage';
import { Input } from '../shared/Input';
import { SubmitButton } from '../shared/SubmitButton';
import { useEffect } from 'react';

const editAccountSchema = z.object({
    name: stringShape.min(1, 'Ingrese el nombre.'),
});

interface EditAccountDrawerProps {
    account: RouterOutputs['accounts']['all'][number] | null;
    onClose: () => void;
}

export function EditAccountDrawer({
    account,
    onClose,
}: EditAccountDrawerProps) {
    const drawer = useDrawer();

    const form = useZodForm({ schema: editAccountSchema });

    useEffect(() => {
        if (!account) return;
        form.setValue('name', account.name);
    }, [account]);

    const queryClient = api.useUtils();
    const editAccount = api.accounts.edit.useMutation({
        onSuccess() {
            queryClient.accounts.all.invalidate();
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
            open={Boolean(account)}
            onClose={handleClose}
            title="Editar cuenta"
        >
            {account && (
                <Form
                    form={form}
                    onSubmit={(input) =>
                        editAccount.mutateAsync({
                            id: account.id,
                            name: input.name,
                        })
                    }
                >
                    <ErrorMessage
                        title="Error de edición"
                        error={editAccount.error?.message}
                    />

                    <Input
                        {...form.register('name')}
                        label="Nombre"
                        placeholder="¿Como se llamará la cuenta?"
                    />

                    <SubmitButton>Crear</SubmitButton>
                </Form>
            )}
        </Drawer>
    );
}
