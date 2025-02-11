import { cva, VariantProps } from 'class-variance-authority';
import { ButtonOrLink, ButtonOrLinkProps } from './ButtonOrLink';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';

export const buttonVariants = cva(
    [
        'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,box-shadow]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors',
        'disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
                link: 'text-primary underline-offset-4 hover:underline',
                ghost: 'bg-transparent hover:bg-secondary/80',
            },
            size: {
                default: 'h-10 px-4 py-2 has-[>svg]:px-3',
                icon: 'size-9 rounded-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends VariantProps<typeof buttonVariants>,
        ButtonOrLinkProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button({ variant, size, children, className, ...props }, ref) {
        return (
            <ButtonOrLink
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            >
                {children}
            </ButtonOrLink>
        );
    },
);
