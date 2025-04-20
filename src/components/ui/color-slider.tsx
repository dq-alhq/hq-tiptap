import { ColorSlider as RACColorSlider, SliderOutput, SliderTrack, composeRenderProps } from 'react-aria-components'
import type { ColorSliderProps as RACColorSliderProps } from 'react-aria-components'

import { cn } from '@/lib/utils'

import { ColorThumb } from './color-thumb'
import { Label } from './field'

interface ColorSliderProps extends RACColorSliderProps {
    label?: string
    showOutput?: boolean
}

const ColorSlider = ({ showOutput = true, label, className, ...props }: ColorSliderProps) => {
    return (
        <RACColorSlider
            {...props}
            slot='color-slider'
            className={composeRenderProps(className, (className, { orientation, isDisabled }) =>
                cn(
                    'group relative flex flex-col items-center gap-2',
                    orientation === 'horizontal' ? 'min-w-56 justify-between' : 'justify-center',
                    isDisabled && 'opacity-50',
                    className,
                ),
            )}
        >
            {({ isDisabled, orientation }) => (
                <>
                    <div className='flex w-full items-center justify-between has-only:justify-center'>
                        {label && <Label isDisabled={isDisabled}>{label}</Label>}
                        {showOutput && <SliderOutput />}
                    </div>
                    <SliderTrack
                        className={cn('rounded-lg', orientation === 'horizontal' ? 'h-6 w-full' : 'h-56 w-6')}
                        style={({ defaultStyle }) => ({ ...defaultStyle })}
                    >
                        <ColorThumb />
                    </SliderTrack>
                </>
            )}
        </RACColorSlider>
    )
}

export { ColorSlider }
export type { ColorSliderProps }
