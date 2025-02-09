import { z } from 'zod';
import { Form, useZodForm } from '../shared/Form';
import { stringShape } from '~/utils/shapes';
import { SubmitButton } from '../shared/SubmitButton';
import { Input } from '../shared/Input';
import { api } from '~/utils/api';
import { useAuthRedirect } from '~/utils/useAuthRedirect';

const signUpSchema = z
    .object({
        username: stringShape.min(1, 'Ingrese su usuario.'),
        password: z.string().min(6, 'El tamaño mínimo es seis caractares.'),
        confirmPassword: z
            .string()
            .min(6, 'El tamaño mínimo es seis caractares.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden.',
        path: ['confirmPassword'],
    });

export function SignUp() {
    const authRedirect = useAuthRedirect();

    const signUp = api.auth.signUp.useMutation({
        onSuccess() {
            authRedirect();
        },
        onError() {
            form.reset(form.getValues());
        },
    });

    const form = useZodForm({ schema: signUpSchema });

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-xl bg-amber-200 p-4">
                <Form
                    form={form}
                    onSubmit={(input) =>
                        signUp.mutateAsync({
                            username: input.username,
                            password: input.password,
                        })
                    }
                >
                    <Input {...form.register('username')} label="Usuario" />

                    <Input
                        {...form.register('password')}
                        label="Contraseña"
                        type="password"
                    />

                    <Input
                        {...form.register('confirmPassword')}
                        label="Confirmar contraseña"
                        type="password"
                    />

                    <SubmitButton>Crear usuario</SubmitButton>
                </Form>
            </div>
        </div>
    );
}
