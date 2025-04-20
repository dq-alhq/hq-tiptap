import type React from 'react'

import { Button, ColorPicker as RACColorPicker } from 'react-aria-components'

import type { ColorPickerProps as RACColorPickerProps } from 'react-aria-components'

import type { Placement } from '@react-types/overlays'

import { ColorArea } from './color-area'
import { ColorField } from './color-field'
import { ColorSlider } from './color-slider'
import { ColorSwatch } from './color-swatch'
import { Description, Label } from './field'
import { Popover } from './popover'

export interface ColorPickerProps extends RACColorPickerProps {
    label?: string
    children?: React.ReactNode
    showArrow?: boolean
    isDisabled?: boolean
    placement?: Placement
    description?: string
    trigger?: React.ReactNode
}

const ColorPicker = ({
    showArrow = false,
    placement = 'bottom start',
    label,
    isDisabled,
    children,
    description,
    trigger,
    ...props
}: ColorPickerProps) => {
    return (
        <div className='group flex flex-col gap-y-2'>
            <RACColorPicker {...props}>
                <Popover>
                    {trigger ?? (
                        <Button isDisabled={isDisabled} className='flex items-center gap-2 outline-hidden'>
                            <ColorSwatch className='size-6' />
                            {label && <Label className='ml-2'>{label}</Label>}
                        </Button>
                    )}
                    <Popover.Content showArrow={showArrow} placement={placement}>
                        <Popover.Body className='space-y-2 overflow-visible pb-4 sm:py-4'>
                            {children || (
                                <>
                                    <ColorArea
                                        className='w-full'
                                        colorSpace='hsb'
                                        xChannel='saturation'
                                        yChannel='brightness'
                                    />
                                    <ColorSlider showOutput={false} colorSpace='hsb' channel='hue' />
                                    <ColorField aria-label='Hex' />
                                </>
                            )}
                        </Popover.Body>
                    </Popover.Content>
                </Popover>
            </RACColorPicker>
            {description && <Description>{description}</Description>}
        </div>
    )
}

export { ColorPicker }
