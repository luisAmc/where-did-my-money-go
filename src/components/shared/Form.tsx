import {
    FieldValues,
    FormProvider,
    SubmitHandler,
    useForm,
    UseFormProps,
    UseFormReturn,
} from 'react-hook-form';
import { TypeOf, ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentProps } from 'react';
import { cn } from '~/utils/cn';

interface UseZodFormProps<T extends ZodSchema<any>>
    extends UseFormProps<TypeOf<T>> {
    schema: T;
}

export const useZodForm = <T extends ZodSchema<any>>({
    schema,
    ...formConfig
}: UseZodFormProps<T>) => {
    return useForm({
        ...formConfig,
        mode: 'all',
        resolver: zodResolver(schema),
    });
};

export interface FormProps<T extends FieldValues = any>
    extends Omit<ComponentProps<'form'>, 'onSubmit'> {
    form: UseFormReturn<T>;
    onSubmit: SubmitHandler<T>;
    disabled?: boolean;
}

export const Form = <T extends FieldValues>({
    form,
    onSubmit,
    children,
    disabled = false,
    className,
    ...props
}: FormProps<T>) => {
    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
                className="flex-1"
            >
                <fieldset
                    className={cn('flex h-full flex-col gap-y-4', className)}
                    disabled={form.formState.isSubmitting || disabled}
                >
                    {children}
                </fieldset>
            </form>
        </FormProvider>
    );
};
