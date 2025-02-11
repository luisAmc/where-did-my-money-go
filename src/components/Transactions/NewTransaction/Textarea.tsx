import { VariantProps } from 'class-variance-authority';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { inputVariants } from '../../shared/Input';
import { cn } from '~/utils/cn';

interface TextareaProps
    extends VariantProps<typeof inputVariants>,
        ComponentPropsWithRef<'textarea'> {
    label?: string;
    hideError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    function Textarea(
        { label, variant, hideError = false, className, ...props },
        ref,
    ) {
        return (
            <textarea
                ref={ref}
                className={cn(
                    inputVariants({ variant, className }),
                    'field-sizing-content h-auto resize-none',
                )}
                rows={1}
                {...props}
            />
        );
    },
);
