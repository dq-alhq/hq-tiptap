import { IconCheck, IconMinus } from 'hq-icons'
import type {
    CheckboxGroupProps as RACCheckboxGroupProps,
    CheckboxProps as RACCheckboxProps,
} from 'react-aria-components'
import { Checkbox as RACCheckbox, CheckboxGroup as RACCheckboxGroup, composeRenderProps } from 'react-aria-components'

import { cn } from '@/lib/utils'

import { Description, FieldError, type FieldProps, Label } from './field'

interface CheckboxGroupProps extends RACCheckboxGroupProps, FieldProps {}

const CheckboxGroup = ({ className, children, description, errorMessage, ...props }: CheckboxGroupProps) => {
    return (
        <RACCheckboxGroup
            {...props}
            className={composeRenderProps(className, (className) => cn('group flex flex-col gap-2', className))}
        >
            {composeRenderProps(children, (children, { isInvalid, isDisabled }) => (
                <>
                    <Label isInvalid={isInvalid} isDisabled={isDisabled}>
                        {props.label}
                    </Label>
                    {children}
                    {description && <Description>{description}</Description>}
                    <FieldError>{errorMessage}</FieldError>
                </>
            ))}
        </RACCheckboxGroup>
    )
}

interface CheckboxProps extends RACCheckboxProps, Omit<FieldProps, 'placeholder'> {
    children?: React.ReactNode
}

const Checkbox = ({ className, label, children, description, errorMessage, ...props }: CheckboxProps) => {
    return (
        <RACCheckbox
            {...props}
            className={composeRenderProps(className, (className, { isDisabled }) =>
                cn('group flex items-center gap-2 text-sm transition', isDisabled && 'opacity-50', className),
            )}
        >
            {({ isSelected, isIndeterminate, isFocused, isInvalid, isRequired }) => (
                <div
                    className={cn('flex items-center gap-2', {
                        'items-start': description || (isInvalid && isRequired),
                    })}
                >
                    <div
                        className={cn(
                            'flex size-4 shrink-0 items-center justify-center rounded-xs border text-bg transition',
                            isSelected || isIndeterminate
                                ? 'border-primary bg-primary text-primary-fg group-invalid:border-danger/70 group-invalid:bg-danger group-invalid:text-danger-fg'
                                : 'border-muted group-hover:border-primary/70 group-hover:bg-primary/10',
                            isFocused &&
                                'border-primary ring-4 ring-primary/20 group-invalid:border-danger/70 group-invalid:text-danger-fg group-invalid:ring-danger/20',
                            isInvalid &&
                                'border-danger/70 bg-danger/20 text-danger-fg ring-danger/20 group-hover:border-danger/70',
                            className,
                        )}
                    >
                        {isIndeterminate ? (
                            <IconMinus className='size-3' />
                        ) : isSelected ? (
                            <IconCheck className='size-3' />
                        ) : null}
                    </div>

                    <div className='flex flex-col'>
                        <Label
                            isInvalid={isInvalid || !!errorMessage}
                            isDisabled={props.isDisabled}
                            className='not-last:text-sm/4'
                        >
                            {label ?? children}
                        </Label>
                        {description && <Description>{description}</Description>}
                        {isRequired && <FieldError>{errorMessage}</FieldError>}
                    </div>
                </div>
            )}
        </RACCheckbox>
    )
}

export { Checkbox, CheckboxGroup }
