import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import type { FormatAction } from '@/components/rich-text-editor/components/toolbar-button'
import { Keyboard, Menu } from '@/components/ui'
import type { Level } from '@tiptap/extension-heading'
import type { Editor } from '@tiptap/react'
import {
    IconHeading1,
    IconHeading2,
    IconHeading3,
    IconHeading4,
    IconHeading5,
    IconHeading6,
    IconParagraph,
} from 'hq-icons'
import React from 'react'
import type { Selection } from 'react-aria-components'
import type { TiptapState } from '../../use-editor-state'

interface TextStyle extends Omit<FormatAction, 'value' | 'icon' | 'action' | 'isActive' | 'canExecute'> {
    level: Level | 0
    icon: React.ReactNode
}

const formatActions: TextStyle[] = [
    {
        label: 'Normal Text',
        level: 0,
        shortcuts: ['mod', 'alt', '0'],
        icon: <IconParagraph />,
    },
    {
        label: 'Heading 1',
        level: 1,
        shortcuts: ['mod', 'alt', '1'],
        icon: <IconHeading1 />,
    },
    {
        label: 'Heading 2',
        level: 2,
        shortcuts: ['mod', 'alt', '2'],
        icon: <IconHeading2 />,
    },
    {
        label: 'Heading 3',
        level: 3,
        shortcuts: ['mod', 'alt', '3'],
        icon: <IconHeading3 />,
    },
    {
        label: 'Heading 4',
        level: 4,
        shortcuts: ['mod', 'alt', '4'],
        icon: <IconHeading4 />,
    },
    {
        label: 'Heading 5',
        level: 5,
        shortcuts: ['mod', 'alt', '5'],
        icon: <IconHeading5 />,
    },
    {
        label: 'Heading 6',
        level: 6,
        shortcuts: ['mod', 'alt', '6'],
        icon: <IconHeading6 />,
    },
]

interface TextStyleProps {
    editor: Editor
    levels?: Level[]
    state: TiptapState | null
}

export const TextStyle = React.memo(({ editor, levels = [1, 2, 3, 4, 5, 6], state }: TextStyleProps) => {
    const filteredActions = React.useMemo(
        () => formatActions.filter((action) => !action.level || levels.includes(action.level)),
        [levels],
    )

    const handleStyleChange = React.useCallback(
        (selection: Selection) => {
            const level = Number([...selection])
            if (level > 0) {
                editor
                    .chain()
                    .focus()
                    .setHeading({ level: level as Level })
                    .run()
            } else {
                editor.chain().focus().setParagraph().run()
            }
        },
        [editor],
    )

    return (
        <Menu>
            <ToolbarButton
                isSelected={false}
                tooltip='Text styles'
                aria-label='Text styles'
                isDisabled={state?.isCodeBlock}
            >
                {state?.isH1 ? (
                    <IconHeading1 />
                ) : state?.isH2 ? (
                    <IconHeading2 />
                ) : state?.isH3 ? (
                    <IconHeading3 />
                ) : state?.isH4 ? (
                    <IconHeading4 />
                ) : state?.isH5 ? (
                    <IconHeading5 />
                ) : state?.isH6 ? (
                    <IconHeading6 />
                ) : (
                    <IconParagraph />
                )}
            </ToolbarButton>
            <Menu.Content
                className='sm:min-w-56'
                placement='bottom start'
                selectionMode='single'
                onSelectionChange={handleStyleChange}
                selectedKeys={
                    state?.isH1
                        ? new Set([1])
                        : state?.isH2
                          ? new Set([2])
                          : state?.isH3
                            ? new Set([3])
                            : state?.isH4
                              ? new Set([4])
                              : state?.isH5
                                ? new Set([5])
                                : state?.isH6
                                  ? new Set([6])
                                  : new Set([0])
                }
                items={filteredActions}
            >
                {(item) => (
                    <Menu.Item id={item.level} key={item.level}>
                        {item.icon}
                        <Menu.Label>{item.label}</Menu.Label>
                        <Keyboard keys={item.shortcuts} />
                    </Menu.Item>
                )}
            </Menu.Content>
        </Menu>
    )
})
