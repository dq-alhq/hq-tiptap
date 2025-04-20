import { ColorArea as RACColorArea, composeRenderProps } from 'react-aria-components'
import type { ColorAreaProps } from 'react-aria-components'

import { cn } from '@/lib/utils'

import { ColorThumb } from './color-thumb'

const ColorArea = ({ className, ...props }: ColorAreaProps) => {
    return (
        <RACColorArea
            slot='color-area'
            className={composeRenderProps(className, (className, { isDisabled }) =>
                cn('min-h-56 min-w-56 rounded-lg bg-muted', isDisabled && 'opacity-50 grayscale-50', className),
            )}
            style={({ defaultStyle }) => ({ ...defaultStyle })}
            {...props}
        >
            <ColorThumb />
        </RACColorArea>
    )
}

export { ColorArea }
