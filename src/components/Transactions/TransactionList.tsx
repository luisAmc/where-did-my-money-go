import { CatIcon } from 'lucide-react';
import { api } from '~/utils/api';
import { formatAmount, formatDate } from '~/utils/transforms';

export function TransactionList() {
    const { data, isLoading } = api.transactions.infinite.useInfiniteQuery(
        {},
        { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

    const transactions = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <>
            {isLoading && <Shimmer />}

            {!isLoading && (
                <ul className="space-y-1 divide-y">
                    {transactions.length === 0 ? (
                        <EmptyTransactions />
                    ) : (
                        transactions.map((transaction) => (
                            <li
                                key={transaction.id}
                                className="flex items-center justify-between px-4 py-2"
                            >
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">
                                        {transaction.store}
                                    </div>

                                    <div className="text-muted-foreground text-xs">
                                        {formatDate(transaction.date, 'dd MMM')}
                                    </div>
                                </div>

                                <div className="text-sm font-medium tabular-nums">
                                    {formatAmount(Number(transaction.amount))}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </>
    );
}

function EmptyTransactions() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-10">
            <CatIcon className="text-muted-foreground size-22" />

            <p className="text-muted-foreground text-sm font-medium">
                No hay transacciones...
            </p>
        </div>
    );
}

function Shimmer() {
    return (
        <div className="divide-secondary animate-pulse divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={`shimmer-row-${i}`}
                    className="flex items-center justify-between px-4 py-2"
                >
                    <div className="space-y-1">
                        <div className="bg-secondary h-4 w-28 rounded-md"></div>
                        <div className="bg-secondary h-4 w-12 rounded-md"></div>
                    </div>

                    <div className="bg-secondary h-4 w-16 rounded-md"></div>
                </div>
            ))}
        </div>
    );
}
