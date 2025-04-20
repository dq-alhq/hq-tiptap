import React from 'react'

import { IconCheck, IconChevronRight } from 'hq-icons'
import { AnimatePresence, motion } from 'motion/react'
import type {
    MenuProps,
    MenuSectionProps,
    MenuTriggerProps,
    PopoverProps,
    MenuItemProps as RACMenuItemProps,
    SeparatorProps,
    TextProps,
} from 'react-aria-components'
import {
    Button,
    Collection,
    Header,
    MenuTrigger,
    ModalOverlay,
    OverlayTriggerStateContext,
    Popover,
    PopoverContext,
    Menu as RACMenu,
    MenuItem as RACMenuItem,
    MenuSection as RACMenuSection,
    Modal as RACModal,
    Separator,
    SubmenuTrigger,
    Text,
    composeRenderProps,
    useSlottedContext,
} from 'react-aria-components'

import { useMediaQuery } from '@/lib/hooks.ts'
import { cn } from '@/lib/utils'

const Modal = motion.create(RACModal)
const Overlay = motion.create(ModalOverlay)
const Menu = ({ ...props }: MenuTriggerProps) => <MenuTrigger {...props} />

interface MenuContentProps<T>
    extends Pick<
            PopoverProps,
            | 'placement'
            | 'offset'
            | 'crossOffset'
            | 'arrowBoundaryOffset'
            | 'triggerRef'
            | 'isOpen'
            | 'onOpenChange'
            | 'shouldFlip'
        >,
        MenuProps<T> {
    className?: string
    style?: React.CSSProperties
    respectScreen?: boolean
}

const MenuContent = <T extends object>({ className, respectScreen = true, ...props }: MenuContentProps<T>) => {
    const isMobile = useMediaQuery('(max-width: 768px)')
    const popoverContext = useSlottedContext(PopoverContext)!
    const state = React.use(OverlayTriggerStateContext)!
    if (isMobile && respectScreen) {
        return (
            <AnimatePresence>
                {(props?.isOpen || state?.isOpen) && (
                    <Overlay
                        isOpen={props?.isOpen || state?.isOpen}
                        onOpenChange={props?.onOpenChange || state?.setOpen}
                        initial={{
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            backdropFilter: 'blur(0px)',
                        }}
                        animate={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(2px)',
                        }}
                        exit={{ backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)' }}
                        className='fixed inset-0 z-50 will-change-auto [--visual-viewport-vertical-padding:32px]'
                        isDismissable
                        {...props}
                    >
                        {({ state }) => (
                            <Modal
                                isDismissable
                                className='absolute bottom-0 max-h-full w-full overflow-hidden rounded-t-2xl border-t bg-bg shadow-sm will-change-transform'
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                drag='y'
                                dragElastic={{ top: 0, bottom: 1 }}
                                whileDrag={{ cursor: 'grabbing' }}
                                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                                dragPropagation
                                dragConstraints={{ top: 0, bottom: 0 }}
                                transition={{ duration: 0.15, ease: 'easeInOut' }}
                                onDragEnd={(_, { offset, velocity }) =>
                                    (offset.y > screen.availHeight * 0.25 || velocity.y > 100) && state.close()
                                }
                            >
                                <div className='h-8 w-full touch-none py-2'>
                                    <div className='mx-auto h-1.5 w-12 rounded-full bg-muted' />
                                </div>
                                <RACMenu
                                    aria-label='Menu'
                                    className='grid max-h-[calc(var(--visual-viewport-height)-10rem)] grid-cols-[auto_1fr_auto] overflow-auto p-1 outline-hidden'
                                    {...props}
                                />
                            </Modal>
                        )}
                    </Overlay>
                )}
            </AnimatePresence>
        )
    }
    const isSubmenuTrigger = popoverContext?.trigger === 'SubmenuTrigger'
    const optimalOffset = isSubmenuTrigger ? 0 : 8
    return (
        <Popover
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            shouldFlip={props.shouldFlip}
            offset={props.offset ?? optimalOffset}
            placement={props.placement}
            crossOffset={props.crossOffset}
            triggerRef={props.triggerRef}
            arrowBoundaryOffset={props.arrowBoundaryOffset}
            className={composeRenderProps(className, (className, { isEntering, isExiting }) =>
                cn(
                    'group min-w-40 max-w-xs rounded-lg border bg-bg bg-clip-padding shadow outline-hidden transition-transform sm:max-w-3xl',
                    isEntering &&
                        'fade-in zoom-in-95 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 placement-bottom:slide-in-from-top-2 animate-in',
                    isExiting &&
                        'fade-out zoom-out-95 placement-left:slide-out-to-right-2 placement-right:slide-out-to-left-2 placement-top:slide-out-to-bottom-2 placement-bottom:slide-out-to-top-2 animate-out',
                    className,
                ),
            )}
        >
            <RACMenu
                className={cn(
                    'grid max-h-[calc(var(--visual-viewport-height)-10rem)] grid-cols-[auto_1fr_auto] overflow-auto rounded-lg p-1 outline-hidden sm:max-h-[inherit]',
                    className,
                )}
                {...props}
            />
        </Popover>
    )
}

interface MenuItemProps extends RACMenuItemProps {
    isDanger?: boolean
}

const MenuItem = ({ className, isDanger = false, children, ...props }: MenuItemProps) => {
    const textValue = props.textValue || (typeof children === 'string' ? children : undefined)
    return (
        <RACMenuItem
            className={composeRenderProps(className, (className, { isOpen, isFocused, isSelected, isDisabled }) =>
                cn(
                    'group relative col-span-full grid grid-cols-subgrid items-center',
                    'select-none rounded-md px-2 py-1.5 text-base outline-hidden sm:text-sm',
                    '*:data-avatar:mr-2 *:data-avatar:size-6 *:[svg]:my-1 *:[svg]:mr-2 **:[svg]:size-4',
                    isDanger
                        ? 'text-danger **:text-danger open:bg-danger/10 open:text-danger focus:bg-danger/10 focus:text-danger focus:**:text-danger'
                        : 'text-fg',
                    isOpen && 'bg-primary/10 text-primary *:[.text-muted-fg]:text-primary',
                    isFocused && 'bg-primary/10 text-primary',
                    isSelected && '**:data-avatar:*:hidden **:data-[slot=icon]:hidden **:data-avatar:hidden',
                    isDisabled && 'pointer-events-none opacity-50',
                    className,
                ),
            )}
            textValue={textValue}
            {...props}
        >
            {(values) => (
                <>
                    {values.isSelected && <IconCheck className='mr-2 size-4' data-slot='checked' />}
                    {typeof children === 'function' ? children(values) : children}
                    {values.hasSubmenu && <IconChevronRight data-slot='chevron' className='ml-auto size-4' />}
                </>
            )}
        </RACMenuItem>
    )
}

const MenuHeader = ({ className, ...props }: React.ComponentProps<typeof Header>) => (
    <Header
        className={cn(
            '-mx-1 col-span-full mb-1 touch-none border-b px-2.5 py-2 font-semibold text-base sm:px-3 sm:pb-2.5 sm:text-sm',
            className,
        )}
        {...props}
    />
)

const MenuSection = <T extends object>({ className, ...props }: MenuSectionProps<T> & { title?: string }) => {
    return (
        <RACMenuSection className={cn('col-span-full mt-2 grid grid-cols-[auto_1fr]', className)} {...props}>
            {'title' in props && (
                <Header className='pointer-events-none col-span-full px-2 py-1 text-muted-fg text-xs'>
                    {props.title}
                </Header>
            )}
            <Collection items={props.items}>{props.children}</Collection>
        </RACMenuSection>
    )
}

interface DropdownItemDetailProps extends TextProps {
    label?: TextProps['children']
    description?: TextProps['children']
}

const MenuDetails = ({ label, description, ...props }: DropdownItemDetailProps) => {
    const { children, title, ...restProps } = props

    return (
        <div data-slot='item-details' className='col-start-2 flex flex-col gap-y-1' {...restProps}>
            {label && (
                <Text slot='label' className='font-medium sm:text-sm'>
                    {label}
                </Text>
            )}
            {description && (
                <Text slot='description' className='text-muted-fg text-xs' {...restProps}>
                    {description}
                </Text>
            )}
            {!title && children}
        </div>
    )
}

interface MenuLabelProps extends TextProps {
    ref?: React.Ref<HTMLDivElement>
}

const MenuLabel = ({ className, ref, ...props }: MenuLabelProps) => (
    <Text slot='label' ref={ref} className={cn('col-start-2', className)} {...props} />
)

const MenuSeparator = ({ className, ...props }: SeparatorProps) => (
    <Separator
        orientation='horizontal'
        className={cn('-mx-1 col-span-full my-1 h-px bg-muted', className)}
        {...props}
    />
)

Menu.Trigger = Button
Menu.Submenu = SubmenuTrigger
Menu.Item = MenuItem
Menu.Content = MenuContent
Menu.Header = MenuHeader
Menu.Section = MenuSection
Menu.Details = MenuDetails
Menu.Label = MenuLabel
Menu.Separator = MenuSeparator

export { Menu }
