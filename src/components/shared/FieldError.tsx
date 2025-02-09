import { useFormContext } from 'react-hook-form';

interface FieldErrorsProps {
    name?: string;
}

export function FieldError({ name }: FieldErrorsProps) {
    const {
        formState: { errors },
    } = useFormContext();

    if (!name) return null;

    const error = errors[name];

    if (!error) return null;

    return (
        <div className="text-destructive mt-1 text-sm font-semibold">
            {error.message as string}
        </div>
    );
}
