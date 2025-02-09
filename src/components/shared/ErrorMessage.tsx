interface ErrorMessageProps {
    title: string;
    error?: string;
}

export function ErrorMessage({ title, error }: ErrorMessageProps) {
    if (!error) return null;

    return (
        <div className="border-opacity-50 border-destructive space-y-1 rounded-md border-2 bg-red-50 p-4">
            {title && (
                <h3 className="text-destructive text-sm font-medium">
                    {title}
                </h3>
            )}

            <div className="text-destructive text-sm">{error}</div>
        </div>
    );
}
