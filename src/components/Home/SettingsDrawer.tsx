import { SettingsIcon } from 'lucide-react';
import { Button } from '../shared/Button';
import { Drawer, useDrawer } from '../shared/Drawer';

export function SettingsDrawer() {
    const drawer = useDrawer();

    return (
        <>
            <Button size="icon" variant="ghost" onClick={drawer.open}>
                <SettingsIcon className="text-primary-foreground size-5" />
            </Button>

            <Drawer {...drawer.props} title={'Opciones'} direction="side">
                <div className="flex flex-col gap-y-2">
                    <Button href="/categories" className="h-12">
                        Categorias
                    </Button>

                    <Button href="/accounts" className="h-12">
                        Cuentas
                    </Button>
                </div>
            </Drawer>
        </>
    );
}
