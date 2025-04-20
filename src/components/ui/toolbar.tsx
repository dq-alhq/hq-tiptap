import type React from 'react'

import type { GroupProps, SeparatorProps, ToolbarProps } from 'react-aria-components'
import {
    Group,
    Toolbar as RACToolbar,
    Separator,
    ToolbarContext,
    composeRenderProps,
    useSlottedContext,
} from 'react-aria-components'

import { cn } from '@/lib/utils'

import { Toggle, ToggleGroupContext, type ToggleGroupContextProps, toggleGroupStyles } from './toggle'

const Toolbar = ({ orientation = 'horizontal', className, ...props }: ToolbarProps) => (
    <ToolbarContext.Provider value={{ orientation }}>
        <RACToolbar
            orientation={orientation}
            className={composeRenderProps(className, (className, { orientation }) =>
                cn(
                    'group gap-2',
                    orientation === 'vertical'
                        ? 'grid items-start'
                        : 'flex flex-row [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                    className,
                ),
            )}
            {...props}
        />
    </ToolbarContext.Provider>
)

interface ToolbarGroupProps extends GroupProps, Omit<ToggleGroupContextProps, 'orientation'> {
    ref?: React.RefObject<HTMLDivElement>
}

const ToolbarGroup = ({ className, ref, variant, gap, icon, size, ...props }: ToolbarGroupProps) => {
    const { orientation } = useSlottedContext(ToolbarContext)!
    return (
        <ToggleGroupContext.Provider value={{ variant, gap, size, icon, orientation, isDisabled: props.isDisabled }}>
            <Group
                ref={ref}
                className={composeRenderProps(className, (className) =>
                    cn(
                        toggleGroupStyles({
                            gap,
                            orientation,
                        }),
                        className,
                    ),
                )}
                {...props}
            />
        </ToggleGroupContext.Provider>
    )
}

const ToolbarSeparator = ({ className, ...props }: SeparatorProps) => {
    const { orientation } = useSlottedContext(ToolbarContext)!
    return (
        <Separator
            className={cn(
                'bg-muted',
                orientation === 'horizontal' ? 'mx-1.5 min-h-8 w-px' : ' my-1.5 h-px w-fit min-w-8',
                className,
            )}
            {...props}
        />
    )
}

Toolbar.Group = ToolbarGroup
Toolbar.Separator = ToolbarSeparator
Toolbar.Item = Toggle

export { Toolbar }
