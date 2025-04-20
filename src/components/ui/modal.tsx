import React from 'react'

import { IconX } from 'hq-icons'
import { AnimatePresence, motion } from 'motion/react'
import type { DialogProps, DialogTriggerProps, HeadingProps, ModalOverlayProps, TextProps } from 'react-aria-components'
import {
    Button,
    Dialog,
    DialogTrigger,
    Heading,
    ModalOverlay,
    OverlayTriggerStateContext,
    Modal as RACModal,
    Text,
} from 'react-aria-components'

import { useMediaQuery } from '@/lib/hooks.ts'
import { cn } from '@/lib/utils'

const MModal = motion.create(RACModal)
const Overlay = motion.create(ModalOverlay)

const Modal = (props: DialogTriggerProps) => <DialogTrigger {...props} />

interface ModalContentProps
    extends Omit<ModalOverlayProps, 'className' | 'children'>,
        Pick<DialogProps, 'aria-label' | 'aria-labelledby' | 'role' | 'children' | 'className'> {
    closeButton?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
    style?: React.CSSProperties
    respectScreen?: boolean
    drawer?: boolean
    notch?: boolean
}

const Content = ({
    isDismissable: isDismissableInternal,
    className,
    children,
    size = 'lg',
    role = 'dialog',
    closeButton = true,
    notch = false,
    respectScreen = true,
    drawer = false,
    ...props
}: ModalContentProps) => {
    const isDismissable = isDismissableInternal ?? role !== 'alertdialog'
    const isMobile = useMediaQuery('(max-width: 768px)') || drawer
    const isDesktop = respectScreen ? !isMobile : true
    const state = React.use(OverlayTriggerStateContext)!
    return (
        <AnimatePresence>
            {(props?.isOpen || state?.isOpen) && (
                <Overlay
                    isDismissable={isDismissable}
                    isOpen={props?.isOpen || state?.isOpen}
                    onOpenChange={props?.onOpenChange || state?.setOpen}
                    initial={{ backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)' }}
                    animate={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
                    exit={{ backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)' }}
                    className='fixed inset-0 z-50 will-change-auto [--visual-viewport-vertical-padding:32px]'
                    {...props}
                >
                    {({ state }) => (
                        <MModal
                            isDismissable={isDismissable}
                            className={cn(
                                'absolute max-h-full w-full touch-none overflow-hidden bg-bg align-middle text-fg shadow-sm will-change-transform',
                                isDesktop
                                    ? '-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-lg border'
                                    : 'bottom-0 rounded-t-2xl border-t',
                                {
                                    'max-w-xs': size === 'xs' && isDesktop,
                                    'max-w-sm': size === 'sm' && isDesktop,
                                    'max-w-md': size === 'md' && isDesktop,
                                    'max-w-lg': size === 'lg' && isDesktop,
                                    'max-w-xl': size === 'xl' && isDesktop,
                                    'max-w-2xl': size === '2xl' && isDesktop,
                                    'max-w-3xl': size === '3xl' && isDesktop,
                                    'max-w-4xl': size === '4xl' && isDesktop,
                                    'max-w-5xl': size === '5xl' && isDesktop,
                                    'h-svh max-w-full': size === 'full' && isDesktop,
                                },
                                className,
                            )}
                            drag={!isDesktop && isDismissable ? 'y' : false}
                            initial={{
                                y: isDesktop ? 0 : '100%',
                                scale: isDesktop ? 0.9 : 1,
                                opacity: 0,
                            }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{
                                y: isDesktop ? 0 : '100%',
                                scale: isDesktop ? 0.9 : 1,
                                opacity: 0,
                            }}
                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                            dragPropagation
                            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            onDragEnd={(_, { offset, velocity }) => {
                                if (offset.y > screen.availHeight * 0.25 || velocity.y > 100) {
                                    state.close()
                                }
                            }}
                            {...props}
                        >
                            <Dialog
                                aria-label='Modal'
                                role={role}
                                className='relative flex max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding))] flex-col overflow-hidden outline-hidden'
                            >
                                {notch && isMobile && (
                                    <div className='mt-2 w-full'>
                                        <div className='mx-auto h-1.5 w-12 rounded-full bg-muted' />
                                    </div>
                                )}
                                {children as React.ReactNode}
                                {closeButton && isDesktop && (
                                    <Button
                                        slot='close'
                                        aria-label='Close'
                                        className={({ isPressed, isHovered, isFocusVisible }) =>
                                            cn(
                                                'absolute top-2 right-2 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-bg text-muted-fg outline-hidden',
                                                isHovered && 'bg-muted/40',
                                                isFocusVisible && 'ring-4 ring-primary/20',
                                                isPressed && 'bg-muted/50',
                                            )
                                        }
                                    >
                                        <IconX />
                                    </Button>
                                )}
                            </Dialog>
                        </MModal>
                    )}
                </Overlay>
            )}
        </AnimatePresence>
    )
}

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div slot='header' className={cn('flex flex-col p-4 text-center sm:p-6 sm:text-left', className)} {...props} />
    )
}

const Title = ({ className, ...props }: HeadingProps) => (
    <Heading slot='title' className={cn('font-semibold text-xl/8', className)} {...props} />
)

const Description = ({ className, ...props }: TextProps) => (
    <Text slot='description' className={cn('text-muted-fg', className)} {...props} />
)

const Body = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        slot='body'
        className={cn(
            'isolate flex max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding))] flex-col overflow-auto px-4 py-1 sm:px-6',
            className,
        )}
        {...props}
    />
)

const Footer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            slot='footer'
            className={cn(
                'isolate mt-auto flex flex-col-reverse justify-center gap-2 p-4 sm:flex-row sm:justify-end sm:p-6',
                className,
            )}
            {...props}
        />
    )
}

Modal.Trigger = Button
Modal.Header = Header
Modal.Title = Title
Modal.Description = Description
Modal.Footer = Footer
Modal.Body = Body
Modal.Content = Content

export { Modal }
