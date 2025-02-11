import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { AccountList } from './AccountList';
import { NewAccountDrawer } from './NewAccountDrawer';

export function Accounts() {
    return (
        <Card>
            <h2 className="text-lg font-medium">Cuentas</h2>
            <AccountList />
            <NewAccountDrawer />

            <Button href="/">Inicio</Button>
        </Card>
    );
}
