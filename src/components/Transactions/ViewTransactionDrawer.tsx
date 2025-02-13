import { formatAmount, formatDate } from '~/utils/transforms';
import { Drawer, useDrawer } from '../shared/Drawer';
import { Button } from '../shared/Button';
import { TransactionType } from '.';

type DrawerProps = ReturnType<typeof useDrawer>['props'];

interface ViewTransactionDrawerProps extends DrawerProps {
    transaction: TransactionType | null;
}

export function ViewTransactionDrawer({
    transaction,
    ...drawerProps
}: ViewTransactionDrawerProps) {
    return (
        <Drawer {...drawerProps} title="Transacción">
            {transaction && (
                <dl className="">
                    <div className="grid grid-cols-3 gap-4 px-2 py-1">
                        <dt className="text-muted-foreground text-sm/6 font-medium">
                            Lugar
                        </dt>
                        <dd className="col-span-2 text-sm">
                            {transaction.store}
                        </dd>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-2 py-1">
                        <dt className="text-muted-foreground text-sm/6 font-medium">
                            Categoría
                        </dt>
                        <dd className="col-span-2 text-sm">
                            {transaction.category.name}
                        </dd>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-2 py-1">
                        <dt className="text-muted-foreground text-sm/6 font-medium">
                            Cuenta
                        </dt>
                        <dd className="col-span-2 text-sm">
                            {transaction.account.name}
                        </dd>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-2 py-1">
                        <dt className="text-muted-foreground text-sm/6 font-medium">
                            Notas
                        </dt>
                        <dd>{transaction.notes || '-'}</dd>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-2 py-1">
                        <dt className="text-muted-foreground text-sm/6 font-medium">
                            Cantidad
                        </dt>
                        <dd className="col-span-2 text-right text-sm">
                            {formatAmount(Number(transaction.amount))}
                        </dd>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-2 py-1">
                        <dt className="text-muted-foreground text-sm/6 font-medium">
                            Fecha
                        </dt>
                        <dd className="col-span-2 text-right text-sm">
                            {formatDate(transaction.date, 'dd MMM y')}
                        </dd>
                    </div>
                </dl>
            )}

            <Button variant="secondary" onClick={() => drawerProps.onClose()}>
                Cerrar
            </Button>
        </Drawer>
    );
}
