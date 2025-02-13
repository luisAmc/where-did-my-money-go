import { api, RouterOutputs } from '~/utils/api';
import { Button } from '../shared/Button';
import { ArrowLeftIcon, ChevronRightIcon, CatIcon } from 'lucide-react';
import { formatAmount, formatDate, plainDateToLocal } from '~/utils/transforms';
import { Drawer, useDrawer } from '../shared/Drawer';
import { useEffect, useState } from 'react';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { Form, useZodForm } from '../shared/Form';
import { z } from 'zod';
import { SubmitButton } from '../shared/SubmitButton';
import { DateInput } from './NewTransaction/DateInput';
import { stringShape } from '~/utils/shapes';
import { ViewTransactionDrawer } from './ViewTransactionDrawer';

const filtersSchema = z
    .object({
        from: stringShape.min(1, 'Seleccione una fecha.'),
        to: stringShape.min(1, 'Seleccione una fecha.'),
    })
    .refine(
        (data) => {
            const from = plainDateToLocal(data.from);
            const to = plainDateToLocal(data.to);
            return from <= to;
        },
        {
            message: '"Desde" no puede ser despues del "Hasta".',
            path: ['to'],
        },
    );

export type TransactionType = RouterOutputs['transactions']['inRange'][number];

const TODAY = new Date();

export function Transactions() {
    const [filters, setFilters] = useState({
        from: startOfMonth(TODAY),
        to: endOfMonth(TODAY),
    });

    const [selectedTransaction, setSelectedTransaction] =
        useState<TransactionType | null>(null);

    const informationDrawer = useDrawer();

    const { data, isLoading } = api.transactions.inRange.useQuery({
        from: startOfDay(filters.from),
        to: endOfDay(filters.to),
    });

    const transactions = data ?? [];

    return (
        <div className="mx-2 flex flex-1 flex-col gap-y-4">
            {/* Title */}
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button href="/" variant="ghost" size="icon">
                        <ArrowLeftIcon className="size-5" />
                    </Button>

                    <h1 className="text-lg">Transacciones</h1>
                </div>

                <Filters
                    state={filters}
                    onConfirm={(input) =>
                        setFilters({
                            from: plainDateToLocal(input.from),
                            to: plainDateToLocal(input.to),
                        })
                    }
                />
            </div>

            {/* Transactions */}
            {isLoading ? (
                <Shimmer />
            ) : (
                <div className="divide-y rounded-lg border">
                    {transactions.length === 0 ? (
                        <EmptyTransactions />
                    ) : (
                        transactions.map((transaction) => (
                            <Button
                                key={transaction.id}
                                variant="ghost"
                                className="w-full rounded-none py-9"
                                onClick={() => {
                                    setSelectedTransaction(transaction);
                                    informationDrawer.open();
                                }}
                            >
                                <div className="flex flex-1 items-center justify-between gap-x-2">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="space-y-0.5 text-left">
                                            <div className="text-sm font-medium">
                                                {transaction.store}
                                            </div>

                                            <div className="text-muted-foreground text-sm/6">
                                                {formatDate(
                                                    transaction.date,
                                                    'dd MMM',
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-sm font-medium tabular-nums">
                                            {formatAmount(
                                                Number(transaction.amount),
                                            )}
                                        </div>
                                    </div>

                                    <ChevronRightIcon className="size-5" />
                                </div>
                            </Button>
                        ))
                    )}

                    <ViewTransactionDrawer
                        {...informationDrawer.props}
                        transaction={selectedTransaction}
                    />
                </div>
            )}
        </div>
    );
}

interface FiltersProps {
    state: { from: Date; to: Date };
    onConfirm(input: z.infer<typeof filtersSchema>): void;
}

function Filters({ state, onConfirm }: FiltersProps) {
    const drawer = useDrawer();

    const form = useZodForm({
        schema: filtersSchema,
        defaultValues: {
            from: formatDate(state.from, 'yyyy-MM-dd'),
            to: formatDate(state.to, 'yyyy-MM-dd'),
        },
    });

    useEffect(() => {
        setStateToForm();
    }, [state]);

    function setStateToForm() {
        form.setValue('from', formatDate(state.from, 'yyyy-MM-dd'));
        form.setValue('to', formatDate(state.to, 'yyyy-MM-dd'));
    }

    function handleConfirm(input: z.infer<typeof filtersSchema>) {
        onConfirm(input);
        drawer.close();
    }

    function handleClose() {
        setStateToForm();
        form.reset(form.getValues());
        drawer.close();
    }

    return (
        <>
            <Button variant="secondary" onClick={drawer.open}>
                <span> {formatDate(state.from, 'dd MMM yy')}</span>
                <span>&#45;</span>
                <span>{formatDate(state.to, 'dd MMM yy')}</span>
            </Button>

            <Drawer
                open={drawer.props.open}
                onClose={() => handleClose()}
                title="Filtrar"
            >
                <Form form={form} onSubmit={(input) => handleConfirm(input)}>
                    <DateInput {...form.register('from')} label="Desde" />
                    <DateInput {...form.register('to')} label="Hasta" />

                    <SubmitButton>Filtrar</SubmitButton>

                    <Button variant="secondary" onClick={() => handleClose()}>
                        Cerrar
                    </Button>
                </Form>
            </Drawer>
        </>
    );
}

function EmptyTransactions() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-10">
            <CatIcon className="text-muted-foreground size-22" />

            <p className="text-muted-foreground text-sm font-medium">
                No hay transacciones en el rango
            </p>
        </div>
    );
}

function Shimmer() {
    return (
        <div className="animate-pulse divide-y rounded-lg border">
            {Array.from({ length: 7 }).map((_, i) => (
                <div
                    key={`shimmer-row-${i}`}
                    className="flex items-center justify-between px-4 py-4"
                >
                    <div className="space-y-1">
                        <div className="bg-muted h-4 w-36 rounded-md"></div>
                        <div className="bg-muted h-4 w-18 rounded-md"></div>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <div className="bg-muted h-4 w-10 rounded-md"></div>
                        <div className="bg-muted size-4 rounded-md"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
