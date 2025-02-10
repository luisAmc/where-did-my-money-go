import { useFormContext } from 'react-hook-form';
import { Button, ButtonProps } from './Button';
import { LoaderCircleIcon } from 'lucide-react';

export function SubmitButton({ children, ...props }: ButtonProps) {
    const { formState } = useFormContext();

    return (
        <Button
            type="submit"
            {...props}
            disabled={!formState.isValid || formState.isSubmitting}
        >
            {formState.isSubmitting && (
                <LoaderCircleIcon className="mr-3 -ml-1 size-5 animate-spin" />
            )}

            {children}
        </Button>
    );
}
