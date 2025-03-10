import { ChartBarStackedIcon, WalletCardsIcon } from 'lucide-react';
import { NewTransaction } from '../Transactions/NewTransaction';
import { TransactionList } from '../Transactions/TransactionList';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { ThisMonthSummary } from './ThisMonthSummary';

export function Home() {
    return (
        <div className="flex flex-1 flex-col gap-y-2">
            <ThisMonthSummary />

            <Card className="mx-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-muted-foreground text-xs font-medium uppercase">
                        Últimas transacciones
                    </h2>

                    <Button variant="link" href="/transactions">
                        Ver más
                    </Button>
                </div>

                <TransactionList />
            </Card>

            <div className="pb-24"></div>

            <div className="bg-secondary border-border/10 fixed bottom-6 left-6 space-x-2 rounded-lg border px-2 py-1 shadow">
                <Button
                    variant="ghost"
                    size="icon"
                    href="/categories"
                    className="size-12"
                >
                    <ChartBarStackedIcon className="size-5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    href="/accounts"
                    className="size-12"
                >
                    <WalletCardsIcon className="size-5" />
                </Button>
            </div>

            <div className="fixed right-6 bottom-6">
                <NewTransaction />
            </div>
        </div>
    );
}
