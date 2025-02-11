import { api } from '~/utils/api';
import { endOfMonth, startOfMonth } from 'date-fns';

export function ThisMonthSummary() {
    const today = new Date();

    const { data, isLoading } = api.transactions.summary.useQuery({
        from: startOfMonth(today),
        to: endOfMonth(today),
    });

    return (
        <div className="bg-primary text-primary-foreground flex flex-col items-center py-8">
            <span className="text-muted-foreground text-xs font-medium uppercase">
                En este mes
            </span>

            <span className="text-6xl font-semibold tabular-nums">
                {data?.total}
            </span>

            <span className="text-muted-foreground text-xs">
                ({data?.count} transacciones)
            </span>
        </div>
    );
}
