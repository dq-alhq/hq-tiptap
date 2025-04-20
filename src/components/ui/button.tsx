import type React from 'react'

import { IconLoaderCircle } from 'hq-icons'
import type { ButtonProps as RACButtonProps } from 'react-aria-components'
import { Button as RACButton, composeRenderProps } from 'react-aria-components'
import { type VariantProps, tv } from 'tailwind-variants'

const buttonStyles = tv({
    base: [
        'inline-flex items-center justify-center whitespace-nowrap border border-muted font-medium outline-hidden backdrop-blur-2xl transition',
        'h-(--height) w-(--width)',
        'ring-ring focus-visible:border-primary/70 focus-visible:ring-2',
        'cursor-pointer disabled:cursor-default disabled:opacity-50',
    ],
    variants: {
        variant: {
            primary: 'border-primary bg-primary pressed:bg-primary/95 text-primary-fg hover:bg-primary/85',
            secondary: 'border-secondary bg-secondary pressed:bg-secondary/95 text-secondary-fg hover:bg-secondary/85',
            info: 'border-info bg-info pressed:bg-info/95 text-info-fg hover:bg-info/85',
            success: 'border-success bg-success pressed:bg-success/95 text-success-fg hover:bg-success/85',
            danger: 'border-danger bg-danger pressed:bg-danger/95 text-danger-fg hover:bg-danger/85',
            warning: 'border-warning bg-warning pressed:bg-warning/95 text-warning-fg hover:bg-warning/85',
            outline: 'bg-bg/80 pressed:bg-muted/50 text-fg hover:bg-muted/40',
            ghost: 'border-transparent bg-transparent pressed:bg-muted/50 text-fg backdrop-blur-none hover:bg-muted/40',
        },
        size: {
            xs: 'gap-x-1.5 px-2 py-1.5 text-xs [--height:theme(spacing.6)] [--width:auto] **:[svg]:size-3.5',
            sm: 'gap-x-1.5 px-3 py-2 text-sm [--height:theme(spacing.8)] [--width:auto] **:[svg]:size-4',
            md: 'gap-x-2 px-4 py-3 text-sm [--height:theme(spacing.10)] [--width:auto] **:[svg]:size-4',
            lg: 'gap-x-2.5 px-5 py-3.5 text-base [--height:theme(spacing.12)] [--width:auto] **:[svg]:size-6',
        },
        icon: {
            true: 'h-(--height) w-(--height) shrink-0 p-0',
        },
        shape: {
            square: 'rounded-lg',
            circle: 'rounded-full',
        },
        isPending: {
            true: 'pointer-events-none cursor-default opacity-50 *:data-[slot=icon]:hidden',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
        shape: 'square',
    },
})

export interface ButtonProps extends RACButtonProps, VariantProps<typeof buttonStyles> {
    ref?: React.Ref<HTMLButtonElement>
}

const Button = ({ className, variant, size, shape, ref, ...props }: ButtonProps) => (
    <RACButton
        ref={ref}
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            buttonStyles({
                ...renderProps,
                variant,
                size,
                icon: !!props.icon,
                shape,
                className,
            }),
        )}
    >
        {(values) => (
            <>
                {values.isPending && <IconLoaderCircle data-slot='loader' className='size-4 animate-spin' />}
                {typeof props.children === 'function' ? props.children(values) : props.children}
            </>
        )}
    </RACButton>
)

export { Button, buttonStyles }
