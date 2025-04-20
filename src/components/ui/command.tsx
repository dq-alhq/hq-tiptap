import React from 'react'

import { IconCheck, IconLoader, IconSearch } from 'hq-icons'
import type {
    AutocompleteProps,
    MenuItemProps,
    MenuProps,
    MenuSectionProps,
    ModalOverlayProps,
    SeparatorProps,
    TextProps,
} from 'react-aria-components'
import {
    Autocomplete,
    Button,
    Collection,
    Group,
    Header,
    Input,
    Menu,
    MenuItem,
    MenuSection,
    Separator,
    Text,
    TextField,
    composeRenderProps,
} from 'react-aria-components'

import { cn, fuzzyMatch } from '@/lib/utils'

import { Keyboard } from './keyboard'
import { Modal } from './modal'

interface CommandProps<T> extends MenuProps<T>, Pick<AutocompleteProps, 'inputValue' | 'onInputChange'> {
    isPending?: boolean
}

const Command = <T extends object>({ ...props }: CommandProps<T>) => {
    return (
        <div className='rounded-lg border'>
            <Autocomplete filter={fuzzyMatch} inputValue={props.inputValue} onInputChange={props.onInputChange}>
                <TextField autoFocus className='border-b p-1' aria-label='Search'>
                    <Group className='flex items-center px-2'>
                        {props.isPending ? (
                            <IconLoader className='size-4 shrink-0 animate-spin text-muted-fg' />
                        ) : (
                            <IconSearch className='size-4 shrink-0 text-muted-fg' />
                        )}
                        <Input className='w-full p-2 outline-hidden' placeholder='Search...' />
                    </Group>
                </TextField>
                <Menu
                    renderEmptyState={() => (
                        <div className='col-span-full p-4 text-center text-muted-fg'>No results found</div>
                    )}
                    className='grid max-h-[30rem] w-full grid-cols-[auto_1fr_auto] gap-y-1 overflow-y-auto p-2 outline-hidden'
                    {...props}
                />
            </Autocomplete>
        </div>
    )
}

interface CommandModalProps<T> extends CommandProps<T>, Pick<ModalOverlayProps, 'isOpen' | 'onOpenChange'> {
    shortcut?: {
        modifiers?: 'alt' | 'mod' | 'mod+alt' | 'mod+shift' | 'mod+alt+shift' | 'alt+shift'
        key: string
    }
}

const CommandModal = <T extends object>({ shortcut, ...props }: CommandModalProps<T>) => {
    const [shortcutOpen, setShortcutOpen] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (!shortcut) {
            return
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === shortcut?.key &&
                (shortcut.modifiers === 'alt'
                    ? e.altKey
                    : shortcut.modifiers === 'mod+alt'
                      ? e.altKey && (e.ctrlKey || e.metaKey)
                      : shortcut.modifiers === 'mod+shift'
                        ? e.shiftKey && (e.ctrlKey || e.metaKey)
                        : shortcut.modifiers === 'mod+alt+shift'
                          ? e.altKey && e.shiftKey && (e.ctrlKey || e.metaKey)
                          : shortcut.modifiers === 'alt+shift'
                            ? e.altKey && e.shiftKey
                            : e.ctrlKey || e.metaKey)
            ) {
                e.preventDefault()
                if (props.onOpenChange) {
                    return props.onOpenChange(!props.isOpen)
                }
                setShortcutOpen(!shortcutOpen)
            } else if (e.key === 'Escape') {
                e.preventDefault()
                if (props.onOpenChange) {
                    return props.onOpenChange(false)
                }
                setShortcutOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    })

    return (
        <Modal.Content
            isOpen={props.isOpen || shortcutOpen}
            onOpenChange={props.onOpenChange || setShortcutOpen}
            aria-label='Commands'
            notch
            className={'border-0'}
        >
            <Command {...props} />
        </Modal.Content>
    )
}

const CommandItem = ({ isDanger, children, className, ...props }: MenuItemProps & { isDanger?: boolean }) => {
    const textValue = props.textValue || (typeof children === 'string' ? children : undefined)
    return (
        <MenuItem
            className={composeRenderProps(className, (className, { isFocused, isSelected, isDisabled }) =>
                cn(
                    'group relative col-span-full grid grid-cols-subgrid items-center',
                    'select-none rounded-md px-2 py-1.5 text-base outline-hidden sm:text-sm',
                    '*:data-avatar:mr-2 *:data-avatar:size-6 *:[svg]:my-1 *:[svg]:mr-2 **:[svg]:size-4',
                    isDanger
                        ? 'text-danger **:text-danger open:bg-danger/10 open:text-danger focus:bg-danger/10 focus:text-danger focus:**:text-danger'
                        : 'text-fg',
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
                </>
            )}
        </MenuItem>
    )
}

const CommandLabel = ({ className, ...props }: TextProps) => (
    <Text slot='label' className={cn('col-start-2', className)} {...props} />
)

const CommandSection = <T extends object>({ className, ...props }: MenuSectionProps<T> & { title?: string }) => (
    <MenuSection className={cn('col-span-full mt-2 grid grid-cols-[auto_1fr] text-sm', className)}>
        {'title' in props && (
            <Header className='pointer-events-none col-span-full px-2 py-1 text-muted-fg text-xs'>{props.title}</Header>
        )}
        <Collection items={props.items}>{props.children}</Collection>
    </MenuSection>
)

const CommandSeparator = ({ className, ...props }: SeparatorProps) => (
    <Separator
        orientation='horizontal'
        className={cn('-mx-2 col-span-full my-1 h-px bg-muted', className)}
        {...props}
    />
)

Command.Modal = CommandModal
Command.Trigger = Button
Command.Item = CommandItem
Command.Label = CommandLabel
Command.Section = CommandSection
Command.Separator = CommandSeparator
Command.Shortcut = Keyboard

export { Command }
