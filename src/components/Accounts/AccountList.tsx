import { api } from '~/utils/api';

export function AccountList() {
    const { data, isLoading } = api.accounts.all.useQuery();

    const accounts = data ?? [];

    if (isLoading) return <p>Cargando cuentas...</p>;

    return (
        <ul className="space-y-1 divide-y">
            {accounts.map((account) => (
                <li
                    key={account.id}
                    className="text-primary rounded-lg border px-4 py-2"
                >
                    {account.name}
                </li>
            ))}
        </ul>
    );
}
