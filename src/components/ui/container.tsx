import { tv } from 'tailwind-variants'

const containerStyles = tv({
    base: '@container mx-auto w-full max-w-7xl lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl)',
    variants: {
        variant: {
            constrained: 'sm:px-6 lg:px-8',
            'padded-content': 'px-4 sm:px-6 lg:px-8',
        },
    },
    defaultVariants: {
        variant: 'padded-content',
    },
})

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'constrained' | 'padded-content'
    ref?: React.Ref<HTMLDivElement>
}

const Container = ({ className, variant, ref, ...props }: ContainerProps) => (
    <div className={containerStyles({ variant, className })} {...props} ref={ref} />
)

export { Container }
export type { ContainerProps }
