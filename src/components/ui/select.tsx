import type React from 'react'

import { IconCheck, IconChevronDown, IconLoader, IconSearch, IconX } from 'hq-icons'
import type {
    ListBoxItemProps,
    ListBoxSectionProps,
    SelectProps as RACSelectProps,
    TextProps,
} from 'react-aria-components'
import {
    Autocomplete,
    Button,
    Collection,
    Group,
    Header,
    Input,
    ListBox,
    ListBoxItem,
    ListBoxSection,
    Popover,
    Select as RACSelect,
    SearchField,
    SelectValue,
    Text,
    composeRenderProps,
} from 'react-aria-components'

import { cn, fuzzyMatch } from '@/lib/utils'
import type { Placement } from '@react-types/overlays'

import { Description, FieldError, type FieldProps, Label } from './field'

interface SelectProps<T extends object> extends Omit<RACSelectProps<T>, 'children'>, FieldProps {
    className?: string
    items?: Iterable<T>
    children: React.ReactNode | ((item: T) => React.ReactNode)
    placement?: Placement
    prefix?: React.ReactNode
    searchable?: boolean
    isPending?: boolean
}

const Select = <T extends object>({
    label,
    description,
    placement,
    errorMessage,
    children,
    items,
    searchable = false,
    className,
    ...props
}: SelectProps<T>) => {
    return (
        <RACSelect
            className={composeRenderProps(className, (className) =>
                cn('group flex flex-col gap-y-1.5 **:data-placeholder:text-muted-fg', className),
            )}
            {...props}
        >
            {({ isInvalid, isDisabled, isOpen, isFocusVisible, isFocused }) => (
                <>
                    {label && (
                        <Label isInvalid={isInvalid || !!errorMessage} isDisabled={isDisabled}>
                            {label}
                        </Label>
                    )}
                    <Button
                        className={composeRenderProps(className, (className, { isHovered }) =>
                            cn(
                                'flex h-10 w-full cursor-default items-center gap-4 gap-x-2 rounded-lg border p-2 outline-hidden transition',
                                {
                                    'border-primary/70 ring-4 ring-primary/20': isFocusVisible || isOpen || isFocused,
                                },
                                isHovered && 'border-primary/70 invalid:border-danger/70',
                                isInvalid && 'border-danger/70 ring-danger/20',
                                isDisabled && 'opacity-50',
                                className,
                            ),
                        )}
                    >
                        {props.prefix ? (
                            <span className='ml-2 text-muted-fg has-[button]:ml-0'>{props.prefix}</span>
                        ) : null}
                        <SelectValue className='**:data-avatar:-mx-0.5 grid grid-cols-[auto_1fr] items-center text-base **:data-[slot=icon]:mr-2 **:data-avatar:mr-2 **:data-[slot=description]:hidden **:data-avatar:size-6 sm:text-sm' />
                        <IconChevronDown
                            data-slot='chevron'
                            className={cn('ml-auto size-4 text-muted-fg transition', isOpen && '-rotate-180')}
                        />
                    </Button>
                    {description && <Description>{description}</Description>}
                    <FieldError>{errorMessage}</FieldError>
                    <Popover
                        trigger='Select'
                        placement={placement}
                        className={({ isEntering, isExiting }) =>
                            cn(
                                'group max-h-72 w-full max-w-(--trigger-width) overflow-y-auto rounded-lg border bg-bg p-1 shadow outline-hidden transition',
                                isEntering &&
                                    'fade-in zoom-in-95 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 placement-bottom:slide-in-from-top-2 animate-in',
                                isExiting &&
                                    'fade-out zoom-out-95 placement-left:slide-out-to-right-2 placement-right:slide-out-to-left-2 placement-top:slide-out-to-bottom-2 placement-bottom:slide-out-to-top-2 animate-out',
                            )
                        }
                    >
                        {searchable ? (
                            <Autocomplete filter={fuzzyMatch}>
                                <SearchField autoFocus className='-mx-1 mb-1 border-b' aria-label='Search'>
                                    {({ isEmpty }) => (
                                        <Group className='flex items-center px-2'>
                                            {props.isPending ? (
                                                <IconLoader className='size-4 shrink-0 animate-spin text-muted-fg' />
                                            ) : (
                                                <IconSearch className='size-4 shrink-0 text-muted-fg' />
                                            )}
                                            <Input
                                                className='w-full p-2 outline-hidden [&::-webkit-search-cancel-button]:hidden'
                                                placeholder='Search...'
                                            />
                                            {!isEmpty && (
                                                <Button
                                                    type='button'
                                                    aria-label='Clear'
                                                    className='mr-2 inline-flex items-center justify-center rounded-lg text-muted-fg outline-offset-4'
                                                >
                                                    <IconX aria-hidden />
                                                </Button>
                                            )}
                                        </Group>
                                    )}
                                </SearchField>
                                <ListBox
                                    autoFocus={false}
                                    renderEmptyState={() => (
                                        <div className='col-span-full p-4 text-center text-muted-fg'>
                                            No results found
                                        </div>
                                    )}
                                    aria-label='items'
                                    items={items}
                                    className='grid w-full grid-cols-[auto_1fr_1.5rem_0.5rem_auto] gap-y-1 overflow-y-auto rounded-lg outline-hidden'
                                >
                                    {children}
                                </ListBox>
                            </Autocomplete>
                        ) : (
                            <ListBox
                                renderEmptyState={() => (
                                    <div className='col-span-full p-4 text-center text-muted-fg'>No results found</div>
                                )}
                                aria-label='items'
                                items={items}
                                className='grid w-full grid-cols-[auto_1fr_1.5rem_0.5rem_auto] gap-y-1 overflow-y-auto rounded-lg outline-hidden'
                            >
                                {children}
                            </ListBox>
                        )}
                    </Popover>
                </>
            )}
        </RACSelect>
    )
}

const SelectItem = ({ className, children, ...props }: ListBoxItemProps) => {
    const textValue = typeof children === 'string' ? children : undefined

    return (
        <ListBoxItem
            textValue={textValue}
            {...props}
            className={composeRenderProps(
                className,
                (className, { isHovered, isFocused, isSelected, isDisabled, isFocusVisible }) =>
                    cn(
                        'group relative col-span-full grid grid-cols-subgrid outline-hidden',
                        'select-none rounded-md px-2 py-1.5 text-base sm:text-sm/6',
                        '*:data-avatar:mr-2 *:data-avatar:size-6 *:[svg]:my-1 *:[svg]:mr-2 **:[svg]:size-4',
                        { 'bg-primary/10 text-primary': isFocused || isFocusVisible || isHovered },
                        isSelected && '**:data-[slot=icon]:hidden **:data-avatar:hidden',
                        isDisabled && 'pointer-events-none opacity-50',
                        className,
                    ),
            )}
        >
            {({ isSelected }) => (
                <>
                    {isSelected && <IconCheck data-slot='checked' />}
                    {typeof children === 'string' ? (
                        <Text slot='label' className='col-start-2'>
                            {children}
                        </Text>
                    ) : (
                        children
                    )}
                </>
            )}
        </ListBoxItem>
    )
}

const SelectSection = <T extends object>({ className, ...props }: ListBoxSectionProps<T> & { title?: string }) => (
    <ListBoxSection className={cn('col-span-full mt-2 grid grid-cols-[auto_1fr] text-sm', className)}>
        {'title' in props && (
            <Header className='pointer-events-none col-span-full px-2 py-1 text-muted-fg text-xs'>{props.title}</Header>
        )}
        <Collection items={props.items}>{props.children}</Collection>
    </ListBoxSection>
)

interface SelectDetailsProps extends TextProps {
    label?: TextProps['children']
    description?: TextProps['children']
}

const SelectDetails = ({ label, description, ...props }: SelectDetailsProps) => {
    const { children, title, ...restProps } = props
    return (
        <div data-slot='item-details' className='col-start-2 flex flex-col gap-y-1' {...restProps}>
            {label && (
                <Text data-slot='label' className='font-medium sm:text-sm'>
                    {label}
                </Text>
            )}
            {description && (
                <Text data-slot='description' className='text-muted-fg text-xs' {...restProps}>
                    {description}
                </Text>
            )}
            {!title && children}
        </div>
    )
}

Select.Item = SelectItem
Select.Details = SelectDetails
Select.Section = SelectSection

export { Select }
