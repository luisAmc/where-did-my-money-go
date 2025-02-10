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
import { CheckIcon } from 'lucide-react';
import { plainDateToLocal } from '~/utils/transforms';

const newExpenseSchema = z.object({
    notes: stringShape.nullable(),
    date: stringShape.min(1, 'Seleccione una fecha.'),
    amount: z.number().min(0, 'El mínimo es 0.'),
    category: stringShape,
    account: stringShape,
});

interface NewExpenseProps {
    onCreation(): void;
}

export function NewExpense({ onCreation }: NewExpenseProps) {
    const form = useZodForm({
        schema: newExpenseSchema,
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
        },
    });

    const queryClient = api.useUtils();
    const createTransaction = api.transactions.create.useMutation({
        onSuccess() {
            queryClient.transactions.infinite.invalidate();
            onCreation();
        },
        onError() {
            form.reset(form.getValues());
        },
    });

    return (
        <Form
            form={form}
            onSubmit={(input) =>
                createTransaction.mutateAsync({
                    amount: input.amount,
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
                // autoFocus
                {...form.register('amount', { valueAsNumber: true })}
                placeholder="L."
            />

            <Textarea {...form.register('notes')} placeholder="Notas..." />

            <div className="grid grid-cols-2 gap-x-2">
                <CategoryPicker />
                <AccountPicker />
            </div>

            <DateInput {...form.register('date')} />

            <SubmitButton>
                <CheckIcon className="size-4" />
                <span>Crear</span>
            </SubmitButton>
        </Form>
    );
}
