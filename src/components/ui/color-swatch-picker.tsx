import type { ColorSwatchPickerItemProps, ColorSwatchPickerProps } from 'react-aria-components'
import {
    ColorSwatchPickerItem,
    ColorSwatchPicker as RACColorSwatchPicker,
    composeRenderProps,
} from 'react-aria-components'

import { cn } from '@/lib/utils'

import { ColorSwatch, isBrightColor } from './color-swatch'

const ColorSwatchPicker = ({ children, className, layout = 'grid', ...props }: ColorSwatchPickerProps) => {
    return (
        <RACColorSwatchPicker
            layout={layout}
            className={composeRenderProps(className, (className) => cn('flex gap-1', className))}
            {...props}
        >
            {children}
        </RACColorSwatchPicker>
    )
}

const SwatchPickerItem = ({ className, ...props }: ColorSwatchPickerItemProps) => {
    return (
        <ColorSwatchPickerItem
            {...props}
            className={composeRenderProps(className, (className, { isDisabled }) =>
                cn('relative outline-hidden flex items-center justify-center', isDisabled && 'opacity-50', className),
            )}
        >
            {({ isSelected, color }) => (
                <>
                    <ColorSwatch />
                    {isSelected && (
                        <span
                            style={{ backgroundColor: isBrightColor(color.toString('hex')) ? '#3F3F46' : '#E4E4E7' }}
                            className='absolute right-1 bottom-1 size-1 rounded-full'
                        />
                    )}
                </>
            )}
        </ColorSwatchPickerItem>
    )
}

ColorSwatchPicker.Item = SwatchPickerItem

export { ColorSwatchPicker }
