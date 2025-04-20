import {
    Button,
    OverlayArrow,
    Tooltip as RACTooltip,
    type TooltipProps as RACTooltipProps,
    TooltipTrigger as RACTooltipTrigger,
    composeRenderProps,
} from 'react-aria-components'

import { cn } from '@/lib/utils'

type TooltipProps = React.ComponentProps<typeof RACTooltipTrigger>
const Tooltip = (props: TooltipProps) => <RACTooltipTrigger {...props} />

interface TooltipContentProps extends Omit<RACTooltipProps, 'children'> {
    showArrow?: boolean
    children: React.ReactNode
    isInverse?: boolean
}

const TooltipContent = ({
    offset = 10,
    showArrow = true,
    isInverse = false,
    children,
    ...props
}: TooltipContentProps) => {
    return (
        <RACTooltip
            {...props}
            offset={offset}
            className={composeRenderProps(props.className, (className, { isEntering, isExiting, placement }) =>
                cn(
                    'group rounded-lg border px-2.5 py-1.5 text-sm will-change-transform',
                    isInverse ? 'bg-fg text-bg' : 'bg-bg text-fg',
                    isEntering && 'fade-in animate-in',
                    isExiting && 'fade-in direction-reverse animate-in',
                    placement === 'top' && `${isEntering ? 'slide-in-from-bottom-1' : 'slide-out-to-bottom-1'}`,
                    placement === 'right' && `${isEntering ? 'slide-in-from-left-1' : 'slide-out-to-left-1'}`,
                    placement === 'bottom' && `${isEntering ? 'slide-in-from-top-1' : 'slide-out-to-top-1'}`,
                    placement === 'left' && `${isEntering ? 'slide-in-from-right-1' : 'slide-out-to-right-1'}`,
                    className,
                ),
            )}
        >
            {showArrow && (
                <OverlayArrow className='group'>
                    <svg
                        width={12}
                        height={12}
                        viewBox='0 0 12 12'
                        className={cn(
                            'group-placement-left:-rotate-90 block group-placement-bottom:rotate-180 group-placement-right:rotate-90',
                            isInverse ? 'fill-fg' : 'fill-bg stroke-border',
                        )}
                    >
                        <title>Arrow</title>
                        <path d='M0 0 L6 6 L12 0' />
                    </svg>
                </OverlayArrow>
            )}
            {children}
        </RACTooltip>
    )
}

Tooltip.Trigger = Button
Tooltip.Content = TooltipContent

export { Tooltip }
