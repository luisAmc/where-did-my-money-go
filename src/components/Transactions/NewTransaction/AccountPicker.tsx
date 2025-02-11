import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { api } from '~/utils/api';
import { cn } from '~/utils/cn';

export function AccountPicker() {
    const { data, isLoading } = api.accounts.all.useQuery();

    const drawer = useDrawer();
    const form = useFormContext();
    const { field } = useController({
        control: form.control,
        name: 'account',
    });

    const accounts = data ?? [];

    useEffect(() => {
        if (accounts.length > 0 && !field.value) {
            field.onChange(accounts[0].id);
        }
    }, [accounts]);

    const selectedAccountName = accounts.find(
        (account) => account.id === field.value,
    )?.name;

    return (
        <>
            <Button
                disabled={isLoading}
                onClick={drawer.open}
                variant="secondary"
            >
                {selectedAccountName ?? 'Seleccione una cuenta'}
            </Button>

            <Drawer {...drawer.props} title="¿Cúal es la cuenta?">
                <section className="flex flex-col space-y-1">
                    {accounts.map((account) => {
                        const isSelected = field.value === account.id;

                        return (
                            <Button
                                key={account.id}
                                className={cn(
                                    'justify-start rounded-full',
                                    isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : 'opacity-50 [&_svg]:invisible',
                                )}
                                onClick={() => {
                                    field.onChange(account.id);
                                    drawer.close();
                                }}
                            >
                                <CheckIcon className="size-4" />
                                <span>{account.name}</span>
                            </Button>
                        );
                    })}
                </section>

                <Button variant="secondary" onClick={drawer.close}>
                    <XIcon className="size-4" />
                    <span>Cancelar</span>
                </Button>
            </Drawer>
        </>
    );
}
