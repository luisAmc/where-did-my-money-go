import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { FieldError } from './FieldError';

export const inputVariants = cva(
    [
        'rounded-lg px-3 py-2 text-[16px] md:text-sm h-10 w-full min-w-0 text-primary placeholder:text-muted-foreground',
        'disabled:opacity-60 disabled:pointer-events-none focus:outline-none appearance-none transition ease-in-out',
        'border border-transparent focus:border-border focus:ring-2 focus:ring-ring focus:ring-offset-1',
    ],
    {
        variants: {
            variant: {
                default: 'bg-foreground/5',
                ghost: 'focus:bg-foreground/5',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface InputProps
    extends VariantProps<typeof inputVariants>,
        ComponentPropsWithRef<'input'> {
    label?: string;
    hideError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, type = 'text', variant, hideError = false, className, ...props },
    ref,
) {
    return (
        <label>
            {label && (
                <div className="text-primary mb-2 text-sm leading-none font-medium">
                    {label}
                </div>
            )}

            <input
                ref={ref}
                className={inputVariants({ variant, className })}
                type={type}
                autoComplete={props.autoComplete || 'off'}
                {...props}
            />

            {!hideError && <FieldError name={props.name} />}
        </label>
    );
});
