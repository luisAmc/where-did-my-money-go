import { z } from 'zod';
import { stringShape } from '~/utils/shapes';
import { format } from 'date-fns';
import { Form, useZodForm } from '~/components/shared/Form';
import { NumberInput } from './NumberInput';
import { Textarea } from './Textarea';
import { DateInput } from './DateInput';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { CategoryPicker } from './CategoryPicker';
import { AccountPicker } from './AccountPicker';
import { api } from '~/utils/api';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { plainDateToLocal } from '~/utils/transforms';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { Input } from '~/components/shared/Input';

const newTransactionSchema = z.object({
    amount: z.number().gt(0, 'Tiene que ser mayor que cero.'),
    store: stringShape.min(1, 'Donde fue la transacción.'),
    notes: stringShape.nullable(),
    category: stringShape,
    account: stringShape,
    date: stringShape.min(1, 'Seleccione una fecha.'),
});

export function NewTransaction() {
    const drawer = useDrawer();

    const form = useZodForm({
        schema: newTransactionSchema,
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
        },
    });

    const queryClient = api.useUtils();
    const createTransaction = api.transactions.create.useMutation({
        onSuccess() {
            queryClient.transactions.infinite.invalidate();
            queryClient.transactions.summary.invalidate();
            form.reset();
            drawer.close();
        },
        onError() {
            form.reset(form.getValues());
        },
    });

    return (
        <>
            <Button onClick={drawer.open} className="size-16 rounded-full">
                <PlusIcon className="size-6" />
            </Button>

            <Drawer
                {...drawer.props}
                title="Nueva transacción"
                dismissible={false}
            >
                <Form
                    form={form}
                    onSubmit={(input) =>
                        createTransaction.mutateAsync({
                            amount: input.amount,
                            store: input.store,
                            notes: input.notes,
                            category: input.category,
                            account: input.account,
                            date: plainDateToLocal(input.date),
                        })
                    }
                >
                    <ErrorMessage
                        title="Error de ingreso"
                        error={createTransaction.error?.message}
                    />

                    <NumberInput
                        {...form.register('amount', { valueAsNumber: true })}
                        placeholder="0"
                        enterKeyHint="next"
                    />

                    <Input
                        {...form.register('store')}
                        placeholder="¿Dónde fue?"
                    />

                    <Textarea
                        {...form.register('notes')}
                        placeholder="Notas (Opcional)"
                    />

                    <div className="grid grid-cols-2 gap-x-2">
                        <CategoryPicker />
                        <AccountPicker />
                    </div>

                    <DateInput {...form.register('date')} />

                    <SubmitButton>
                        <CheckIcon className="size-4" />
                        <span>Crear</span>
                    </SubmitButton>

                    <Button variant="secondary" onClick={drawer.close}>
                        <XIcon className="size-4" />
                        <span>Cerrar</span>
                    </Button>
                </Form>
            </Drawer>
        </>
    );
}
