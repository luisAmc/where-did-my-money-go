import { NewTransaction } from '../Transactions/NewTransaction';
import { TransactionList } from '../Transactions/TransactionList';
import { Card } from '../shared/Card';
import { ThisMonthSummary } from './ThisMonthSummary';

export function Home() {
    return (
        <div className="flex flex-1 flex-col gap-y-2">
            <ThisMonthSummary />

            <Card>
                <h2 className="text-muted-foreground text-xs font-medium uppercase">
                    Transacciones recientes
                </h2>
                <TransactionList />
            </Card>

            <div className="pb-16"></div>

            {/* <div className="fixed bottom-0 flex w-full max-w-md justify-center bg-red-400 pt-2 pb-6"> */}
            <div className="fixed right-6 bottom-6">
                <NewTransaction />
            </div>
        </div>
    );
}
