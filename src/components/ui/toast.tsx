import React from 'react'

import { IconCircleAlert, IconCircleCheck, IconInfo, IconTriangleAlert, IconX } from 'hq-icons'
import { motion, useAnimation } from 'motion/react'
import type { ButtonProps, ToastOptions } from 'react-aria-components'
import {
    Button,
    Text,
    UNSTABLE_ToastContent as ToastContent,
    UNSTABLE_ToastQueue as ToastQueue,
    UNSTABLE_ToastRegion as ToastRegion,
    UNSTABLE_Toast as Toaster,
} from 'react-aria-components'

import { cn } from '@/lib/utils'

interface ToastContentProps {
    title: string
    description?: string
    action?: () => void
    actionLabel?: React.ReactNode
    altAction?: () => void
    altActionLabel?: React.ReactNode
    type: 'default' | 'success' | 'error' | 'info' | 'warning'
}

const queue = new ToastQueue<ToastContentProps>({
    wrapUpdate(fn) {
        if ('startViewTransition' in document) {
            document.startViewTransition(() => fn())
        } else {
            fn()
        }
    },
    maxVisibleToasts: 5,
})

const ToastProvider = () => {
    const [isHovered, setIsHovered] = React.useState(false)
    return (
        <ToastRegion
            className='fixed top-0 flex h-fit w-full flex-col-reverse items-center gap-3 p-4 sm:top-auto sm:right-2 sm:bottom-2 sm:w-fit sm:items-end'
            queue={queue}
        >
            {({ toast }) => (
                <Toaster key={toast.key} toast={toast} className={cn('will-change-transform sm:w-fit sm:min-w-xs')}>
                    <motion.div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        key={toast.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                            'flex flex-col gap-2 rounded-lg border p-4 shadow-[0_3px_10px_rgb(0,0,0,0.3)] backdrop-blur-lg',
                            {
                                'border-success/20 bg-success/10 text-success **:data-loader:stroke-success':
                                    toast.content.type === 'success',
                                'border-danger/20 bg-danger/5 text-danger **:data-loader:stroke-danger':
                                    toast.content.type === 'error',
                                'border-info/30 bg-info/10 text-info **:data-loader:stroke-info':
                                    toast.content.type === 'info',
                                'border-warning/40 bg-warning/5 text-warning **:data-loader:stroke-warning':
                                    toast.content.type === 'warning',
                                'bg-bg text-fg': toast.content.type === 'default',
                            },
                        )}
                    >
                        <div
                            className={cn('flex items-start gap-2', {
                                'items-center': !toast.content.description,
                            })}
                        >
                            {toast.content.type === 'success' ? (
                                <IconCircleCheck className='shrink-0' />
                            ) : toast.content.type === 'error' ? (
                                <IconCircleAlert className='shrink-0' />
                            ) : toast.content.type === 'info' ? (
                                <IconInfo className='shrink-0' />
                            ) : toast.content.type === 'warning' ? (
                                <IconTriangleAlert className='shrink-0' />
                            ) : null}
                            <ToastContent className='flex w-full flex-col'>
                                <Text slot='title' className='font-medium'>
                                    {toast.content.title}
                                </Text>
                                {toast.content.description && (
                                    <Text slot='description' className='text-sm'>
                                        {toast.content.description}
                                    </Text>
                                )}
                            </ToastContent>
                            <TimeoutButton paused={isHovered} timeout={toast.timeout} slot='close'>
                                <IconX />
                            </TimeoutButton>
                        </div>
                        {(toast.content.action || toast.content.altAction) && (
                            <div className='flex items-center justify-start gap-2'>
                                {toast.content.action && (
                                    <Button
                                        onPress={toast.content.action}
                                        slot='close'
                                        className={({ isHovered, isPressed, isFocusVisible }) =>
                                            cn(
                                                'flex cursor-pointer items-center justify-center gap-x-1.5 rounded-lg border px-2 py-1 text-sm outline-hidden *:[svg]:size-3',
                                                isHovered && 'brightness-80',
                                                isPressed && 'brightness-90',
                                                isFocusVisible && 'ring-4 ring-primary/20',
                                                {
                                                    'border-success bg-success text-success-fg':
                                                        toast.content.type === 'success',
                                                    'border-danger bg-danger text-danger-fg':
                                                        toast.content.type === 'error',
                                                    'border-info bg-info text-info-fg':
                                                        toast.content.type === 'info' ||
                                                        toast.content.type === 'default',
                                                    'border-warning bg-warning text-warning-fg':
                                                        toast.content.type === 'warning',
                                                },
                                            )
                                        }
                                    >
                                        {toast.content.actionLabel || 'Action'}
                                    </Button>
                                )}
                                {toast.content.altAction && (
                                    <Button
                                        onPress={toast.content.altAction}
                                        slot='close'
                                        className={({ isHovered, isPressed, isFocusVisible }) =>
                                            cn(
                                                'flex cursor-pointer items-center justify-center gap-x-1.5 rounded-lg border bg-bg px-2 py-1 text-fg text-sm outline-hidden *:[svg]:size-3',
                                                isHovered && 'bg-muted/40',
                                                isPressed && 'bg-muted/60',
                                                isFocusVisible && 'border-primary ring-4 ring-primary/20',
                                            )
                                        }
                                    >
                                        {toast.content.altActionLabel || 'Cancel'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </Toaster>
            )}
        </ToastRegion>
    )
}

interface TimeoutButtonProps extends ButtonProps {
    timeout: number | undefined
    paused?: boolean
    onComplete?: () => void
}

const TimeoutButton = ({ timeout, onComplete, paused, children, ...props }: TimeoutButtonProps) => {
    const controls = useAnimation()
    const startTimeRef = React.useRef<number | null>(null)
    const elapsedRef = React.useRef<number>(0)
    const size = 28
    const stroke = 2
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius

    const animate = (duration: number) => {
        controls
            .start({
                strokeDashoffset: 0,
                transition: { duration, ease: 'linear' },
            })
            .then(() => {
                onComplete?.()
            })
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        if (timeout === undefined) {
            return
        }
        startTimeRef.current = performance.now()
        animate(timeout / 1000)
    }, [timeout])

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        if (timeout === undefined) {
            return
        }

        if (paused) {
            controls.stop()
            if (startTimeRef.current) {
                elapsedRef.current += performance.now() - startTimeRef.current
            }
        } else {
            const remaining = timeout - elapsedRef.current
            if (remaining > 0) {
                startTimeRef.current = performance.now()
                animate(remaining / 1000)
            }
        }
    }, [paused, timeout])

    return (
        <Button
            className={({ isHovered, isPressed, isFocusVisible }) =>
                cn(
                    'relative ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-full border outline-hidden',
                    isHovered && 'bg-muted/40',
                    isPressed && 'bg-muted/60',
                    isFocusVisible && 'border-primary ring-4 ring-primary/20',
                )
            }
            {...props}
        >
            {(values) => (
                <>
                    {typeof children === 'function' ? children(values) : children}
                    {timeout !== undefined && (
                        <svg className='absolute top-0 left-0 size-full' viewBox={`0 0 ${size} ${size}`}>
                            <title>Loading</title>
                            <motion.circle
                                data-loader
                                stroke='var(--muted-fg)'
                                fill='transparent'
                                strokeWidth={stroke}
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference}
                                animate={controls}
                                r={radius}
                                cx={size / 2}
                                cy={size / 2}
                            />
                        </svg>
                    )}
                </>
            )}
        </Button>
    )
}

const toast = (body: string, content?: Omit<ToastContentProps, 'type' | 'title'>, options?: ToastOptions) =>
    queue.add({ ...content, title: body, type: 'default' }, { ...options, timeout: options?.timeout ?? 3000 })

toast.success = (body: string, content?: Omit<ToastContentProps, 'type' | 'title'>, options?: ToastOptions) =>
    queue.add({ ...content, title: body, type: 'success' }, { ...options, timeout: options?.timeout ?? 3000 })

toast.error = (body: string, content?: Omit<ToastContentProps, 'type' | 'title'>, options?: ToastOptions) =>
    queue.add({ ...content, title: body, type: 'error' }, { ...options, timeout: options?.timeout ?? 3000 })

toast.info = (body: string, content?: Omit<ToastContentProps, 'type' | 'title'>, options?: ToastOptions) =>
    queue.add({ ...content, title: body, type: 'info' }, { ...options, timeout: options?.timeout ?? 3000 })

toast.warning = (body: string, content?: Omit<ToastContentProps, 'type' | 'title'>, options?: ToastOptions) =>
    queue.add({ ...content, title: body, type: 'warning' }, { ...options, timeout: options?.timeout ?? 3000 })

export { toast, ToastProvider }
