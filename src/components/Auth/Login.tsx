import { useAuthRedirect } from '~/utils/useAuthRedirect';
import { Button } from '../shared/Button';
import { Form, useZodForm } from '../shared/Form';
import { api } from '~/utils/api';
import { z } from 'zod';
import { stringShape } from '~/utils/shapes';
import { Input } from '../shared/Input';
import { SubmitButton } from '../shared/SubmitButton';
import { ErrorMessage } from '../shared/ErrorMessage';
import Image from 'next/image';

const loginSchema = z.object({
    username: stringShape.min(1, 'Ingrese su usuario.'),
    password: z.string().min(6, 'El tamaño mínimo es seis caractares.'),
});

export function Login() {
    const authRedirect = useAuthRedirect();

    const login = api.auth.login.useMutation({
        onSuccess() {
            authRedirect();
        },
        onError() {
            form.reset(form.getValues());
        },
    });

    const form = useZodForm({ schema: loginSchema });

    return (
        <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-md rounded-xl p-4">
                <div className="flex justify-center">
                    <Image
                        src="/images/kitty-picture.webp"
                        width={334}
                        height={400}
                        alt="login illustration"
                    />
                </div>

                <Form
                    form={form}
                    onSubmit={(input) =>
                        login.mutateAsync({
                            username: input.username,
                            password: input.password,
                        })
                    }
                >
                    <ErrorMessage
                        title="Error de ingreso"
                        error={login.error?.message}
                    />

                    <Input
                        {...form.register('username')}
                        autoFocus
                        label="Usuario"
                        autoCapitalize="off"
                    />

                    <Input
                        {...form.register('password')}
                        label="Contraseña"
                        type="password"
                    />

                    <SubmitButton>Ingresar</SubmitButton>
                </Form>

                <Button variant="link" href="/auth/signup">
                    ¿Nuevo usuario?
                </Button>
            </div>
        </div>
    );
}
