import { ComponentPropsWithRef, forwardRef } from 'react';
import { VariantProps } from 'class-variance-authority';
import { inputVariants } from '../../shared/Input';
import { FieldError } from '../../shared/FieldError';
import { cn } from '~/utils/cn';
import { CalendarIcon } from 'lucide-react';

interface DateInputProps
    extends VariantProps<typeof inputVariants>,
        ComponentPropsWithRef<'input'> {
    label?: string;
    hideError?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
    function DateInput(
        { label, type = 'text', hideError = false, className, ...props },
        ref,
    ) {
        return (
            <label>
                <div className="flex items-center">
                    <CalendarIcon className="text-primary absolute ml-4 size-4" />

                    <input
                        ref={ref}
                        className={cn(
                            inputVariants({ variant: 'default' }),
                            'relative pl-10',
                        )}
                        type="date"
                        {...props}
                    />
                </div>

                {!hideError && <FieldError name={props.name} />}
            </label>
        );
    },
);
