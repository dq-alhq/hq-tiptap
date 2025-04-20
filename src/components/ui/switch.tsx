import { Switch as RACSwitch, type SwitchProps as RACSwitchProps, composeRenderProps } from 'react-aria-components'

import { cn } from '@/lib/utils'

import { Label } from './field'

interface SwitchProps extends RACSwitchProps {
    ref?: React.RefObject<HTMLLabelElement>
}

const Switch = ({ children, className, ref, ...props }: SwitchProps) => {
    return (
        <RACSwitch
            ref={ref}
            className={composeRenderProps(className, (className) =>
                cn('group inline-flex touch-none items-center sm:text-sm', className),
            )}
            {...props}
        >
            {({ isSelected, isFocused, isFocusVisible, isDisabled, isPressed }) => (
                <>
                    <span
                        className={cn(
                            'mr-2 inline-flex h-5 w-8 items-center rounded-xl border border-transparent bg-muted transition',
                            {
                                'border-primary/70 ring-2 ring-primary/20 ring-offset-2':
                                    isFocused || isFocusVisible || isPressed,
                            },
                            isSelected && 'bg-primary',
                            isDisabled ? 'cursor-default opacity-50' : 'cursor-pointer',
                        )}
                    >
                        <span
                            className={cn(
                                'block size-4 origin-right rounded-lg bg-primary-fg shadow-sm transition-transform duration-200 ease-in-out',
                                isSelected && 'ml-3',
                            )}
                        />
                    </span>
                    <Label>{children as React.ReactNode}</Label>
                </>
            )}
        </RACSwitch>
    )
}

export { Switch }
