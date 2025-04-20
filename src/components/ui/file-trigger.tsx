import { FileTrigger as RACFileTrigger, type FileTriggerProps as RACFileTriggerProps } from 'react-aria-components'
import type { VariantProps } from 'tailwind-variants'

import { Button, type buttonStyles } from './button'

interface FileTriggerProps extends RACFileTriggerProps, VariantProps<typeof buttonStyles> {
    isDisabled?: boolean
    ref?: React.RefObject<HTMLInputElement>
}

const FileTrigger = ({
    variant,
    size,
    shape,
    ref,
    children,
    ...props
}: Omit<FileTriggerProps, 'children'> & { children: React.ReactNode }) => {
    return (
        <RACFileTrigger ref={ref} {...props}>
            <Button isDisabled={props.isDisabled} size={size} shape={shape} variant={variant}>
                {children}
            </Button>
        </RACFileTrigger>
    )
}

export { FileTrigger }
export type { FileTriggerProps }
