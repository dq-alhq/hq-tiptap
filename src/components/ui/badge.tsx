import { type VariantProps, tv } from 'tailwind-variants'

const badgeStyles = tv({
    base: [
        'inline-flex cursor-default items-center gap-x-1.5 border border-(--bg)/20 bg-(--bg) pressed:bg-(--bg)/95 px-2 py-0.5 font-medium text-(--fg) text-xs/5 transition hover:bg-(--bg)/85 **:data-[slot=icon]:size-3',
    ],
    variants: {
        variant: {
            primary: '[--bg:var(--color-primary)] [--fg:var(--color-primary-fg)]',
            secondary: '[--bg:var(--color-secondary)] [--fg:var(--color-secondary-fg)]',
            info: '[--bg:var(--color-info)] [--fg:var(--color-info-fg)]',
            success: '[--bg:var(--color-success)] [--fg:var(--color-success-fg)]',
            danger: '[--bg:var(--color-danger)] [--fg:var(--color-danger-fg)]',
            warning: '[--bg:var(--color-warning)] [--fg:var(--color-warning-fg)]',
            outline: 'border-muted bg-bg/80 pressed:bg-muted/50 text-fg hover:bg-muted/40',
        },
        shape: {
            square: 'rounded-lg',
            circle: 'rounded-full',
        },
    },
    defaultVariants: {
        variant: 'primary',
        shape: 'square',
    },
})

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeStyles> {
    className?: string
    children: React.ReactNode
}

const Badge = ({ children, variant, shape, className, ...props }: BadgeProps) => {
    return (
        <span data-badge {...props} className={badgeStyles({ variant, shape, className })}>
            {children}
        </span>
    )
}

export { Badge, badgeStyles }
export type { BadgeProps }
