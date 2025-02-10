import { PlusIcon, XIcon } from 'lucide-react';
import { Button } from '../shared/Button';
import { NewCategoryDrawer } from '../Categories/NewCategoryDrawer';
import { CategoryList } from '../Categories/CategoryList';
import { AccountList } from '../Accounts/AccountList';
import { NewAccountDrawer } from '../Accounts/NewAccountDrawer';
import { Drawer, useDrawer } from '../shared/Drawer';
import { NewExpense } from '../Transactions/NewExpense';
import { TransactionList } from '../Transactions/TransactionList';

export function Home() {
    return (
        <div className="my-4 flex flex-1 flex-col space-y-4 gap-y-4">
            <section className="bg-card text-card-foreground flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">Últimos gastos</h2>
            </section>

            <section className="bg-card text-card-foreground flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">Categorias</h2>
                <CategoryList />
                <NewCategoryDrawer />
            </section>

            <section className="bg-card text-card-foreground flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">Cuentas</h2>
                <AccountList />
                <NewAccountDrawer />
            </section>

            <section className="bg-card text-card-foreground flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">Transacciones</h2>
                <TransactionList />
            </section>

            <div className="pt-4"></div>

            <div className="fixed right-6 bottom-6">
                <NewExpenseButton />
            </div>
        </div>
    );
}

function NewExpenseButton() {
    const newExpenseDrawer = useDrawer();

    return (
        <>
            <Button
                onClick={newExpenseDrawer.open}
                className="size-16 rounded-full"
            >
                <PlusIcon className="size-8" />
            </Button>

            <Drawer
                {...newExpenseDrawer.props}
                title="Nueva transacción"
                dismissible={false}
            >
                <NewExpense onCreation={newExpenseDrawer.close} />

                <Button variant="secondary" onClick={newExpenseDrawer.close}>
                    <XIcon className="size-4" />
                    <span>Cerrar</span>
                </Button>
            </Drawer>
        </>
    );
}
