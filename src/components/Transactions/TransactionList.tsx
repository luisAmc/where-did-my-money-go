import { api } from '~/utils/api';
import { formatAmount, formatDate } from '~/utils/transforms';

export function TransactionList() {
    const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
        api.transactions.infinite.useInfiniteQuery(
            {},
            { getNextPageParam: (lastPage) => lastPage.nextCursor },
        );

    const transactions = data?.pages.flatMap((page) => page.items) ?? [];

    if (isLoading) return <p>Cargando transacciones...</p>;

    return (
        <ul className="space-y-1 divide-y">
            {transactions.map((transaction) => (
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

                    <div className="tabular-nums text-sm font-medium">
                        {formatAmount(Number(transaction.amount))}
                    </div>
                    {/* <div className='tabular-nums'>{Number(transaction.amount.toString())}</div>

                    <div>{formatDate(transaction.date, 'dd MMM, yyyy')}</div>

                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                        {transaction.notes ?? '- Sin notas -'}
                    </p> */}
                </li>
            ))}
        </ul>
    );
}
