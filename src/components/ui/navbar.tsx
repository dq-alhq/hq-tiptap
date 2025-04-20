import React from 'react'

import { IconMenu } from 'hq-icons'
import { LayoutGroup, motion } from 'motion/react'
import type { LinkProps } from 'react-aria-components'
import { Link, composeRenderProps } from 'react-aria-components'

import { useMediaQuery } from '@/lib/hooks.ts'
import { cn } from '@/lib/utils'

import { Button, type ButtonProps } from './button'
import { Sheet } from './sheet'

type NavbarOptions = {
    side?: 'left' | 'right'
    isSticky?: boolean
    variant?: 'navbar' | 'float' | 'inset'
}

type NavbarContextProps = {
    open: boolean
    setOpen: (open: boolean) => void
    isCompact: boolean
    toggleNavbar: () => void
} & NavbarOptions

const NavbarContext = React.createContext<NavbarContextProps | null>(null)

function useNavbar() {
    const context = React.use(NavbarContext)
    if (!context) {
        throw new Error('useNavbar must be used within a Navbar.')
    }

    return context
}

interface NavbarProps extends React.ComponentProps<'header'>, NavbarOptions {
    defaultOpen?: boolean
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const Navbar = ({
    children,
    isOpen: openProp,
    onOpenChange: setOpenProp,
    defaultOpen = false,
    className,
    side = 'left',
    isSticky = false,
    variant = 'navbar',
    ...props
}: NavbarProps) => {
    const isCompact = useMediaQuery('(max-width: 768px)')
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open

    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            if (setOpenProp) {
                return setOpenProp?.(typeof value === 'function' ? value(open) : value)
            }

            _setOpen(value)
        },
        [setOpenProp, open],
    )

    const toggleNavbar = React.useCallback(() => {
        setOpen((open) => !open)
    }, [setOpen])

    const contextValue = React.useMemo<NavbarContextProps>(
        () => ({
            open,
            setOpen,
            isCompact,
            toggleNavbar,
            variant,
            isSticky,
            side,
        }),
        [open, setOpen, isCompact, toggleNavbar, variant, isSticky, side],
    )
    return (
        <NavbarContext value={contextValue}>
            <header
                data-navbar-variant={variant}
                className={cn(
                    'relative isolate flex w-full flex-col',
                    variant === 'float' && 'px-2.5 pt-2',
                    variant === 'inset' && 'min-h-svh bg-bg',
                    className,
                )}
                {...props}
            >
                {children}
            </header>
        </NavbarContext>
    )
}

interface NavbarNavProps extends React.ComponentProps<'div'> {
    variant?: 'navbar' | 'float' | 'inset'
    isSticky?: boolean
    side?: 'left' | 'right'
    useDefaultResponsive?: boolean
}

const NavbarNav = ({ useDefaultResponsive = true, className, ref, ...props }: NavbarNavProps) => {
    const { isCompact, side, variant, isSticky, open, setOpen } = useNavbar()

    if (isCompact && useDefaultResponsive) {
        return (
            <Sheet isOpen={open} onOpenChange={setOpen} {...props}>
                <Sheet.Trigger className='sr-only' />
                <Sheet.Content
                    side={side}
                    aria-label='Compact Navbar'
                    data-navbar='compact'
                    isFloating={variant === 'float'}
                >
                    <Sheet.Body className='px-2 md:px-4'>{props.children}</Sheet.Body>
                </Sheet.Content>
            </Sheet>
        )
    }

    return (
        <div
            data-navbar-nav='true'
            ref={ref}
            className={cn(
                'group peer hidden h-(--navbar-height) w-full items-center px-4 [--navbar-height:3.5rem] md:flex',
                '[&>div]:mx-auto [&>div]:w-full [&>div]:max-w-[1680px] [&>div]:items-center md:[&>div]:flex',
                isSticky && 'sticky top-0 z-40',
                variant === 'float' &&
                    'mx-auto w-full max-w-7xl rounded-lg border bg-bg text-fg md:px-4 2xl:max-w-(--breakpoint-2xl)',
                variant === 'navbar' && 'border-b bg-bg text-fg md:px-6',
                variant === 'inset' &&
                    'mx-auto md:px-6 [&>div]:mx-auto [&>div]:w-full [&>div]:items-center md:[&>div]:flex 2xl:[&>div]:max-w-(--breakpoint-2xl)',
                className,
            )}
            {...props}
        >
            <div>{props.children}</div>
        </div>
    )
}

interface NavbarTriggerProps extends ButtonProps {
    ref?: React.RefObject<HTMLButtonElement>
}
const NavbarTrigger = ({ className, onPress, ref, ...props }: NavbarTriggerProps) => {
    const { toggleNavbar } = useNavbar()
    return (
        <Button
            ref={ref}
            data-navbar-trigger='true'
            variant='ghost'
            aria-label={props['aria-label'] || 'Toggle Navbar'}
            icon
            className={className}
            onPress={(event) => {
                onPress?.(event)
                toggleNavbar()
            }}
            {...props}
        >
            <IconMenu />
            <span className='sr-only'>Toggle Navbar</span>
        </Button>
    )
}

const NavbarSection = ({ className, ...props }: React.ComponentProps<'div'>) => {
    const { isCompact } = useNavbar()
    const id = React.useId()
    return (
        <LayoutGroup id={id}>
            <div
                data-navbar-section='true'
                className={cn('flex', isCompact ? 'flex-col gap-y-4' : 'flex-row items-center gap-x-3', className)}
                {...props}
            >
                {props.children}
            </div>
        </LayoutGroup>
    )
}

interface NavbarItemProps extends LinkProps {
    isCurrent?: boolean
}

const NavbarItem = ({ className, isCurrent, ...props }: NavbarItemProps) => {
    const { variant, isCompact } = useNavbar()
    return (
        <Link
            data-navbar-item
            aria-current={isCurrent ? 'page' : undefined}
            className={composeRenderProps(
                className,
                (className, { isFocused, isHovered, isPressed, isFocusVisible, isDisabled }) =>
                    cn(
                        'relative flex cursor-pointer items-center gap-x-2 px-2 text-muted-fg no-underline outline-hidden transition-colors md:text-sm',
                        '**:data-[slot=chevron]:size-4 **:data-[slot=chevron]:transition-transform',
                        '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0',
                        isFocused && 'text-fg',
                        isHovered && 'text-fg',
                        isPressed && 'text-fg **:data-[slot=chevron]:rotate-180',
                        isFocusVisible && 'ring-2 ring-primary/20',
                        isDisabled && 'cursor-default opacity-50',
                        isCurrent && 'cursor-default text-fg',
                        className,
                    ),
            )}
            {...props}
        >
            {(values) => (
                <>
                    {typeof props.children === 'function' ? props.children(values) : props.children}

                    {(isCurrent || values.isCurrent) && !isCompact && variant !== 'float' && (
                        <motion.span
                            layoutId='current-indicator'
                            data-slot='current-indicator'
                            className='absolute inset-x-2 bottom-[calc(var(--navbar-height)*-0.33)] h-0.5 rounded-full bg-fg'
                        />
                    )}
                </>
            )}
        </Link>
    )
}

const NavbarLogo = ({ className, ...props }: LinkProps) => {
    return (
        <Link
            className={composeRenderProps(className, (className) =>
                cn(
                    'relative flex items-center gap-x-2 px-2 py-4 text-fg data-focus-visible:outline-1 data-focus-visible:outline-primary data-focused:outline-hidden md:mr-4 md:px-0 md:py-0',
                    className,
                ),
            )}
            {...props}
        />
    )
}

const NavbarFlex = ({ className, ref, ...props }: React.ComponentProps<'div'>) => {
    return <div ref={ref} className={cn('flex items-center gap-2 md:gap-3', className)} {...props} />
}

interface NavbarCompactProps extends React.ComponentProps<'div'> {
    ref?: React.RefObject<HTMLDivElement>
    variant?: 'float' | 'inset' | 'navbar'
}
const NavbarCompact = ({ className, ref, ...props }: NavbarCompactProps) => {
    const { variant } = useNavbar()
    return (
        <div
            ref={ref}
            className={cn(
                'flex justify-between bg-bg text-fg peer-has-[[data-navbar-variant=float]]:border md:hidden',
                variant === 'float' && 'h-12 rounded-lg border px-3.5',
                variant === 'inset' && 'h-14 border-b px-4',
                variant === 'navbar' && 'h-14 border-b px-4',
                className,
            )}
            {...props}
        />
    )
}

const NavbarInset = ({ className, ref, ...props }: React.ComponentProps<'div'>) => {
    const { variant } = useNavbar()
    return (
        <main
            ref={ref}
            data-navbar-variant={variant}
            className={cn('flex flex-1 flex-col', variant === 'inset' && 'bg-bg pb-2 md:px-2', className)}
        >
            <div
                className={cn(
                    'grow',
                    variant === 'inset' &&
                        'bg-bg md:rounded-lg md:shadow-xs md:ring-1 md:ring-fg/15 md:dark:ring-border',
                )}
            >
                {props.children}
            </div>
        </main>
    )
}

Navbar.Nav = NavbarNav
Navbar.Inset = NavbarInset
Navbar.Compact = NavbarCompact
Navbar.Flex = NavbarFlex
Navbar.Trigger = NavbarTrigger
Navbar.Logo = NavbarLogo
Navbar.Item = NavbarItem
Navbar.Section = NavbarSection

export { Navbar }
