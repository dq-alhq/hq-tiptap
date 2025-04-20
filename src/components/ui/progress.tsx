import { motion } from 'motion/react'
import { ProgressBar, type ProgressBarProps, composeRenderProps } from 'react-aria-components'

import { cn } from '@/lib/utils'

import { Label } from './field'

interface ProgressProps extends ProgressBarProps {
    label?: string
    ref?: React.RefObject<HTMLDivElement>
    circle?: boolean
    variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'info' | 'success' | 'dark'
}

const Progress = ({ label, ref, circle, variant = 'primary', className, ...props }: ProgressProps) => {
    return (
        <ProgressBar
            ref={ref}
            className={composeRenderProps(className, (className) => cn('flex flex-col gap-y-1.5', className))}
            {...props}
        >
            {({ percentage, valueText, isIndeterminate }) => (
                <>
                    {circle ? (
                        <svg
                            aria-label={label ?? 'Progress'}
                            className={cn('size-20 shrink-0', `text-${variant === 'dark' ? 'fg' : variant}`, className)}
                            viewBox='0 0 32 32'
                            fill='none'
                        >
                            <title>{label ?? 'Progress'}</title>
                            <circle
                                cx='50%'
                                cy='50%'
                                r='calc(50% - 2px)'
                                strokeWidth={3}
                                stroke='currentColor'
                                strokeOpacity={0.25}
                            />
                            <circle
                                cx='50%'
                                cy='50%'
                                r='calc(50% - 2px)'
                                strokeWidth={3}
                                stroke='currentColor'
                                pathLength={100}
                                strokeDasharray='100 200'
                                strokeDashoffset={100 - (percentage ?? 30)}
                                strokeLinecap='round'
                                className={cn(
                                    'origin-center',
                                    isIndeterminate
                                        ? 'animate-[spin_1s_cubic-bezier(0.4,_0,_0.2,_1)_infinite]'
                                        : '-rotate-90',
                                )}
                            />
                            {!isIndeterminate && (
                                <text
                                    x='50%'
                                    y='50%'
                                    textAnchor='middle'
                                    dy='.35em'
                                    fontSize='calc(50% + 1px)'
                                    className='fill-current'
                                >
                                    {valueText}
                                </text>
                            )}
                        </svg>
                    ) : (
                        <>
                            <div className='flex justify-between gap-2'>
                                {label && <Label>{label}</Label>}
                                {valueText && <span className='text-muted-fg text-sm tabular-nums'>{valueText}</span>}
                            </div>
                            <div className='relative h-2 min-w-64 overflow-hidden rounded-lg bg-muted outline-hidden'>
                                <motion.div
                                    className={cn(
                                        'absolute top-0 left-0 h-full rounded-full',
                                        `bg-${variant === 'dark' ? 'fg' : variant}`,
                                    )}
                                    initial={{
                                        width: `${isIndeterminate ? '50%' : '0%'}`,
                                        left: '0%',
                                    }}
                                    animate={{
                                        width: `${percentage}%`,
                                        left: isIndeterminate ? ['-100%', '100%'] : '0%',
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: 'easeInOut',
                                        repeat: isIndeterminate ? Number.POSITIVE_INFINITY : 0,
                                    }}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </ProgressBar>
    )
}

export { Progress }
