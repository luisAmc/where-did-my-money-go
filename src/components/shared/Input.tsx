import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { FieldError } from './FieldError';

export const inputVariants = cva([
    'bg-transparent px-3 py-2 text-[16px] md:text-sm h-9 w-full min-w-0 rounded-lg border border-solid border-primary text-primary placeholder:text-muted-foreground',
    'focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    'disabled:opacity-60 disabled:pointer-events-none',
    'appearance-none transition ease-in-out',
    // 'flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow]',
    // 'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
]);

interface InputProps
    extends VariantProps<typeof inputVariants>,
        ComponentPropsWithRef<'input'> {
    label?: string;
    hideError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, type = 'text', hideError = false, className, ...props },
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
                className={inputVariants({ className })}
                type={type}
                {...props}
            />

            {!hideError && <FieldError name={props.name} />}
        </label>
    );
});
