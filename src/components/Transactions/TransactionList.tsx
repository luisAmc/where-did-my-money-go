import { api } from '~/utils/api';
import { formatDate } from '~/utils/transforms';

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
                    className="text-primary rounded-lg border px-4 py-2"
                >
                    <div>{Number(transaction.amount.toString())}</div>
                    <div>{formatDate(transaction.date, 'dd MMM, yyyy')}</div>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                        {transaction.notes ?? '- Sin notas -'}
                    </p>
                </li>
            ))}
        </ul>
    );
}
