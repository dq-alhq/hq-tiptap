import type { SeparatorProps } from 'react-aria-components'
import { Separator as RACSeparator } from 'react-aria-components'

import { cn } from '@/lib/utils'

const Separator = ({ className, children, ...props }: SeparatorProps & { children?: React.ReactNode }) => {
    return children ? (
        <div
            className={cn(
                'text-muted-fg text-sm leading-6 before:border-muted after:border-muted',
                props.orientation === 'vertical'
                    ? 'mx-2 flex h-full flex-col items-center self-stretch before:mb-2 before:flex-1 before:border-l after:mt-2 after:flex-1 after:border-r'
                    : 'my-2 flex h-px w-full items-center self-stretch before:mr-2 before:flex-1 before:border-t after:ml-2 after:flex-1 after:border-t',
                className,
            )}
        >
            {children}
        </div>
    ) : (
        <RACSeparator
            {...props}
            className={cn(
                'shrink-0 bg-border',
                props.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
                className,
            )}
        />
    )
}

export { Separator }
