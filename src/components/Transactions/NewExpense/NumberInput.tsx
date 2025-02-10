import { ComponentPropsWithRef, forwardRef } from 'react';
import { inputVariants } from '~/components/shared/Input';
import { cn } from '~/utils/cn';

interface NumberInputProps extends ComponentPropsWithRef<'input'> {}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    function NumberInput({ ...props }, ref) {
        return (
            <label>
                <input
                    ref={ref}
                    type="number"
                    inputMode="decimal"
                    className={cn(
                        inputVariants({ variant: 'default' }),
                        'h-auto text-center text-7xl md:text-7xl',
                    )}
                    // className="text-primary placeholder:text-muted-foreground w-full appearance-none py-0.5 text-center text-6xl outline-none"
                    {...props}
                />
            </label>
        );
    },
);
