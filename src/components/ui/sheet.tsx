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

import { cn } from '@/lib/utils'

const Modal = motion.create(RACModal)
const Overlay = motion.create(ModalOverlay)

const Sheet = (props: DialogTriggerProps) => <DialogTrigger {...props} />

interface SheetContentProps
    extends Omit<ModalOverlayProps, 'className' | 'children' | 'isDismissable'>,
        Pick<DialogProps, 'aria-label' | 'aria-labelledby' | 'role' | 'children' | 'className'> {
    closeButton?: boolean
    isFloating?: boolean
    isBlurred?: boolean
    className?: string
    style?: React.CSSProperties
    side?: 'top' | 'bottom' | 'left' | 'right'
}

const SheetContent = ({
    side = 'right',
    closeButton = true,
    isFloating = false,
    isBlurred = true,
    children,
    className,
    ...props
}: SheetContentProps) => {
    const state = React.use(OverlayTriggerStateContext)!

    return (
        <AnimatePresence>
            {(props?.isOpen || state?.isOpen) && (
                <Overlay
                    isDismissable
                    isOpen={props?.isOpen || state?.isOpen}
                    onOpenChange={props?.onOpenChange || state?.setOpen}
                    initial={{ backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)' }}
                    animate={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: isBlurred ? 'blur(4px)' : 'blur(0px)',
                    }}
                    exit={{ backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)' }}
                    className='fixed inset-0 z-50 will-change-auto [--visual-viewport-vertical-padding:32px]'
                >
                    {({ state }) => (
                        <Modal
                            className={cn(
                                'fixed max-h-full touch-none overflow-hidden bg-bg align-middle text-fg shadow-sm will-change-transform',
                                side === 'top' &&
                                    `${
                                        isFloating
                                            ? 'inset-x-2 top-2 rounded-lg border-b-0'
                                            : 'inset-x-0 top-0 rounded-b-2xl border-b'
                                    }`,
                                side === 'right' &&
                                    `w-full max-w-xs overflow-y-auto **:[[slot=header]]:text-left ${
                                        isFloating
                                            ? 'inset-y-2 right-2 rounded-lg border'
                                            : 'inset-y-0 right-0 h-auto border-l'
                                    }`,
                                side === 'bottom' &&
                                    `${
                                        isFloating
                                            ? 'inset-x-2 bottom-2 rounded-lg border-t-0'
                                            : 'inset-x-0 bottom-0 rounded-t-2xl border-t'
                                    }`,
                                side === 'left' &&
                                    `w-full max-w-xs overflow-y-auto **:[[slot=header]]:text-left ${
                                        isFloating
                                            ? 'inset-y-2 left-2 rounded-lg border'
                                            : 'inset-y-0 left-0 h-auto border-r'
                                    }`,
                                className,
                            )}
                            initial={{
                                x: side === 'left' ? '-100%' : side === 'right' ? '100%' : 0,
                                y: side === 'top' ? '-100%' : side === 'bottom' ? '100%' : 0,
                            }}
                            animate={{ x: 0, y: 0 }}
                            exit={{
                                x: side === 'left' ? '-100%' : side === 'right' ? '100%' : 0,
                                y: side === 'top' ? '-100%' : side === 'bottom' ? '100%' : 0,
                            }}
                            drag={side === 'left' || side === 'right' ? 'x' : 'y'}
                            whileDrag={{ cursor: 'grabbing' }}
                            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                            onDragEnd={(_, { offset, velocity }) => {
                                if (side === 'bottom' && (velocity.y > 150 || offset.y > screen.height * 0.25)) {
                                    state.close()
                                }
                                if (side === 'top' && (velocity.y < -150 || offset.y < screen.height * 0.25)) {
                                    state.close()
                                }
                                if (side === 'left' && velocity.x < -150) {
                                    state.close()
                                }
                                if (side === 'right' && velocity.x > 150) {
                                    state.close()
                                }
                            }}
                            dragElastic={{
                                top: side === 'top' ? 1 : 0,
                                bottom: side === 'bottom' ? 1 : 0,
                                left: side === 'left' ? 1 : 0,
                                right: side === 'right' ? 1 : 0,
                            }}
                            dragPropagation
                        >
                            <Dialog
                                aria-label='Sheet'
                                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                                role='dialog'
                                className={cn(
                                    'relative flex flex-col overflow-hidden outline-hidden will-change-auto',
                                    side === 'top' || side === 'bottom'
                                        ? 'max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding))]'
                                        : 'max-h-full',
                                )}
                            >
                                {children as React.ReactNode}
                                {closeButton && (
                                    <Button
                                        aria-label='Close'
                                        slot='close'
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
                        </Modal>
                    )}
                </Overlay>
            )}
        </AnimatePresence>
    )
}

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div slot='header' className={cn('flex flex-col p-4 text-center sm:text-left', className)} {...props} />
}

const Title = ({ className, ...props }: HeadingProps) => (
    <Heading slot='title' className={cn('font-semibold text-lg/8', className)} {...props} />
)

const Description = ({ className, ...props }: TextProps) => (
    <Text slot='description' className={cn('text-muted-fg text-sm', className)} {...props} />
)

const Body = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        slot='body'
        className={cn(
            'isolate flex max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding))] flex-col overflow-auto px-4 py-1 will-change-scroll',
            className,
        )}
        {...props}
    />
)

const Footer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            slot='footer'
            className={cn('isolate mt-auto flex flex-col-reverse justify-end gap-2 p-4 sm:flex-row', className)}
            {...props}
        />
    )
}

Sheet.Trigger = Button
Sheet.Footer = Footer
Sheet.Header = Header
Sheet.Title = Title
Sheet.Description = Description
Sheet.Body = Body
Sheet.Content = SheetContent

export { Sheet }
