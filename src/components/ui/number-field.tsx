import { IconChevronDown, IconChevronUp, IconMinus, IconPlus } from 'hq-icons'
import {
    Button,
    type ButtonProps,
    NumberField as RACNumberField,
    type NumberFieldProps as RACNumberFieldProps,
    type ValidationResult,
    composeRenderProps,
} from 'react-aria-components'

import { useMediaQuery } from '@/lib/hooks.ts'
import { cn } from '@/lib/utils'

import { Description, FieldError, FieldGroup, Input, Label } from './field'

interface NumberFieldProps extends RACNumberFieldProps {
    label?: string
    description?: string
    placeholder?: string
    errorMessage?: string | ((validation: ValidationResult) => string)
}

const NumberField = ({ label, placeholder, description, className, errorMessage, ...props }: NumberFieldProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)')
    return (
        <RACNumberField
            {...props}
            className={composeRenderProps(className, (className) => cn('group flex flex-col gap-y-1.5', className))}
        >
            {({ isInvalid, isDisabled }) => (
                <>
                    {label && (
                        <Label isInvalid={isInvalid || !!errorMessage} isDisabled={isDisabled}>
                            {label}
                        </Label>
                    )}
                    <FieldGroup isDisabled={isDisabled} className='overflow-hidden'>
                        {isMobile && (
                            <Stepper slot='decrement' className='border-r'>
                                <IconMinus />
                            </Stepper>
                        )}
                        <Input className='text-center tabular-nums sm:text-left' placeholder={placeholder} />
                        <div
                            className={cn(
                                'grid h-10 place-content-center border-s',
                                'group-hover:border-primary/60 group-focus:border-primary/70',
                                isInvalid && 'group-focus:border-danger/70',
                                isDisabled && 'group-focus:border-muted',
                            )}
                        >
                            {isMobile ? (
                                <Stepper slot='increment'>
                                    <IconPlus />
                                </Stepper>
                            ) : (
                                <div className='flex h-full flex-col divide-y'>
                                    <Stepper slot='increment' className='h-5 px-1'>
                                        <IconChevronUp />
                                    </Stepper>
                                    <Stepper slot='decrement' className='h-5 px-1'>
                                        <IconChevronDown />
                                    </Stepper>
                                </div>
                            )}
                        </div>
                    </FieldGroup>
                    {description && <Description>{description}</Description>}
                    <FieldError>{errorMessage}</FieldError>
                </>
            )}
        </RACNumberField>
    )
}

interface StepperProps extends ButtonProps {
    slot: 'increment' | 'decrement'
    className?: string
}

const Stepper = ({ slot, className, ...props }: StepperProps) => {
    return (
        <Button
            className={composeRenderProps(className, (className, { isDisabled, isPressed }) =>
                cn(
                    'h-10 px-3 text-muted-fg outline-hidden',
                    isPressed && 'bg-primary text-primary-fg',
                    isDisabled && 'opacity-50',
                    className,
                ),
            )}
            slot={slot}
            {...props}
        />
    )
}

export { NumberField }
