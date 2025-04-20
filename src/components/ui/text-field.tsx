import React from 'react'

import { IconEye, IconEyeClosed, IconLoaderCircle } from 'hq-icons'
import {
    Button,
    TextField as RACTextField,
    type TextFieldProps as RACTextFieldProps,
    composeRenderProps,
} from 'react-aria-components'

import { cn } from '@/lib/utils'

import type { FieldProps } from './field'
import { Description, FieldError, FieldGroup, Input, Label } from './field'

interface TextFieldProps extends RACTextFieldProps, FieldProps {
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    isPending?: boolean
}

const TextField = ({ label, placeholder, description, errorMessage, className, type, ...props }: TextFieldProps) => {
    const [masked, setMasked] = React.useState<boolean>(type === 'password')
    const inputType = type === 'password' ? (masked ? 'password' : 'text') : type

    return (
        <RACTextField
            type={inputType}
            className={composeRenderProps(className, (className) => cn('group flex flex-col gap-y-1.5', className))}
            {...props}
        >
            {({ isInvalid, isDisabled }) => (
                <>
                    {label && (
                        <Label isInvalid={isInvalid || !!errorMessage} isDisabled={isDisabled}>
                            {label}
                        </Label>
                    )}
                    <FieldGroup
                        isInvalid={isInvalid || !!errorMessage}
                        isDisabled={isDisabled}
                        data-loading={props.isPending ? 'true' : undefined}
                    >
                        {props.prefix ? (
                            <span className='ml-2 text-muted-fg has-[button]:ml-0'>{props.prefix}</span>
                        ) : null}
                        <Input placeholder={placeholder} />
                        {type === 'password' ? (
                            <Button
                                type='button'
                                aria-label='Toggle visibility'
                                onPress={() => setMasked((e) => !e)}
                                className='mr-2 inline-flex items-center justify-center rounded-lg text-muted-fg outline-offset-4'
                            >
                                {masked ? <IconEye /> : <IconEyeClosed />}
                            </Button>
                        ) : props.isPending ? (
                            <IconLoaderCircle className='mr-2 size-3.5 animate-spin text-muted-fg' data-suffix />
                        ) : props.suffix ? (
                            <span data-suffix className='mr-2 text-muted-fg has-[button]:mr-0'>
                                {props.suffix}
                            </span>
                        ) : null}
                    </FieldGroup>
                    {description && <Description>{description}</Description>}
                    <FieldError>{errorMessage}</FieldError>
                </>
            )}
        </RACTextField>
    )
}

export { TextField }
