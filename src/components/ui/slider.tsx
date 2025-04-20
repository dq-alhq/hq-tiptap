import React from 'react'

import type { SliderProps as RACSliderProps, SliderThumbProps, SliderTrackProps } from 'react-aria-components'
import {
    Slider as RACSlider,
    SliderThumb as RACSliderThumb,
    SliderTrack as RACSliderTrack,
    SliderOutput,
    SliderStateContext,
    composeRenderProps,
} from 'react-aria-components'

import { cn } from '@/lib/utils'

import { Description, FieldError, type FieldProps, Label } from './field'

interface SliderProps extends RACSliderProps, FieldProps {}

const Slider = ({ orientation = 'horizontal', className, ...props }: SliderProps) => {
    return (
        <RACSlider
            orientation={orientation}
            className={composeRenderProps(className, (className, { orientation }) =>
                cn(
                    'group relative flex touch-none select-none flex-col gap-y-3',
                    orientation === 'horizontal' ? 'w-full min-w-56' : 'h-full min-h-56 w-1.5 items-center',
                    className,
                ),
            )}
            {...props}
        >
            {({ orientation, state }) => (
                <>
                    <div className='flex text-fg'>
                        {props.label && <Label>{props.label}</Label>}
                        <SliderOutput
                            className={cn(
                                'text-muted-fg text-sm tabular-nums',
                                orientation === 'horizontal' ? 'ml-auto' : 'mx-auto',
                            )}
                        >
                            {state.values.map((_, i) => state.getThumbValueLabel(i)).join(' – ')}
                        </SliderOutput>
                    </div>
                    <SliderTrack>
                        <SliderFiller />
                        {state.values.map((s, i) => (
                            <SliderThumb key={s} index={i} />
                        ))}
                    </SliderTrack>
                    {props.description && <Description>{props.description}</Description>}
                    <FieldError>{props.errorMessage}</FieldError>
                </>
            )}
        </RACSlider>
    )
}

const SliderTrack = ({ className, ...props }: SliderTrackProps) => {
    return (
        <RACSliderTrack
            {...props}
            className={composeRenderProps(className, (className, { orientation, isDisabled }) =>
                cn([
                    'relative cursor-pointer rounded-full bg-muted',
                    orientation === 'horizontal' ? 'h-1.5 w-full' : 'w-1.5 flex-1/2',
                    isDisabled ? 'cursor-default opacity-50' : 'cursor-pointer',
                    className,
                ]),
            )}
        />
    )
}

const SliderFiller = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const state = React.use(SliderStateContext)
    const { values, orientation, getThumbPercent } = state || {}

    const getStyle = () => {
        const percent0 = getThumbPercent ? getThumbPercent(0) * 100 : 0
        const percent1 = getThumbPercent ? getThumbPercent(1) * 100 : 0

        if (values?.length === 1) {
            return orientation === 'horizontal' ? { width: `${percent0}%` } : { height: `${percent0}%` }
        }
        return orientation === 'horizontal'
            ? { left: `${percent0}%`, width: `${Math.abs(percent0 - percent1)}%` }
            : { bottom: `${percent0}%`, height: `${Math.abs(percent0 - percent1)}%` }
    }

    return (
        <div
            className={cn(
                'pointer-events-none absolute rounded-full bg-primary',
                orientation === 'horizontal' ? 'h-full' : 'bottom-0 w-full',
                className,
            )}
            style={getStyle()}
            {...props}
        />
    )
}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
    return (
        <RACSliderThumb
            {...props}
            className={composeRenderProps(className, (className, { isFocusVisible, isDragging, isDisabled }) =>
                cn(
                    'top-1/2 left-1/2 size-5 rounded-full border border-muted bg-bg outline-hidden transition',
                    isFocusVisible && 'border-primary ring-4 ring-primary/20',
                    isDragging && 'cursor-grabbing border-primary ring-4 ring-primary/20',
                    isDisabled && 'opacity-50',
                    className,
                ),
            )}
        />
    )
}

export { Slider }
