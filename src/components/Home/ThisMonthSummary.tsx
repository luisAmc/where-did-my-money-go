import { api } from '~/utils/api';
import { formatAmount } from '~/utils/transforms';
import { getZonedEndOfMonth, getZonedStartOfMonth } from '~/utils/dates';

export function ThisMonthSummary() {
    const today = new Date();

    const { data, isLoading } = api.transactions.summary.useQuery({
        from: getZonedStartOfMonth(today),
        to: getZonedEndOfMonth(today),
    });

    return (
        <div className="bg-primary text-primary-foreground flex flex-col items-center py-8">
            {isLoading && <Shimmer />}

            {!isLoading && (
                <>
                    <span className="text-primary-foreground text-xs font-medium uppercase">
                        En este mes
                    </span>

                    <span className="text-6xl font-semibold tabular-nums">
                        {formatAmount(data?.total ?? 0)}
                    </span>

                    <span className="text-primary-foreground text-xs">
                        ({data?.count} transacciones)
                    </span>
                </>
            )}
        </div>
    );
}

function Shimmer() {
    return (
        <div className="flex animate-pulse flex-col items-center gap-y-1">
            <div className="bg-muted-foreground/30 h-4 w-20 rounded-md"></div>
            <div className="text-primary-foreground/30 rounded-md text-6xl font-semibold">
                #,###.##
            </div>
            <div className="bg-muted-foreground/30 h-3 w-28 rounded-md"></div>
        </div>
    );
}
