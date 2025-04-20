import type { DropZoneProps } from 'react-aria-components'
import { DropZone as RACDropZone, composeRenderProps } from 'react-aria-components'

import { cn } from '@/lib/utils'

const DropZone = ({ className, ...props }: DropZoneProps) => (
    <RACDropZone
        className={composeRenderProps(className, (className, { isDropTarget, isFocused, isFocusVisible }) =>
            cn(
                'group flex max-h-[200px] max-w-xl flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-sm outline-hidden transition duration-200 has-[[slot=description]]:text-center',
                isDropTarget &&
                    'border-primary border-solid bg-primary/10 ring-4 ring-primary/20 [&_.text-muted-fg]:text-primary',
                isFocused &&
                    'border-primary/70 outline-hidden ring-4 ring-primary/20 invalid:border-danger/70 invalid:ring-danger/20',
                isFocusVisible && 'ring-4 ring-primary/20',
                className,
            ),
        )}
        {...props}
    />
)
export { DropZone }
