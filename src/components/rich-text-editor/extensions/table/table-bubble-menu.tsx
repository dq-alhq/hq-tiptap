import { BubbleMenu } from '@/components/rich-text-editor/components/bubble-menu'
import { type FormatAction, ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import { Toolbar } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import { IconDelete, IconPanelLeftClose, IconPanelRightClose, IconTableCellsMerge, IconTrash } from 'hq-icons'
import React from 'react'

type TableAction =
    | 'addColumnBefore'
    | 'addColumnAfter'
    | 'addRowBefore'
    | 'addRowAfter'
    | 'deleteColumn'
    | 'deleteRow'
    | 'mergeOrSplit'
    | 'deleteTable'
interface TableActions extends Omit<FormatAction, 'shortcuts' | 'isActive'> {
    value: TableAction
}

const actions: TableActions[] = [
    {
        value: 'addColumnBefore',
        label: 'Add Column Left',
        icon: <IconPanelLeftClose />,
        action: (editor) => editor.chain().focus().addColumnBefore().run(),
        canExecute: (editor) => editor.can().chain().focus().addColumnBefore().run(),
    },
    {
        value: 'addColumnAfter',
        label: 'Add Column Right',
        icon: <IconPanelRightClose />,
        action: (editor) => editor.chain().focus().addColumnAfter().run(),
        canExecute: (editor) => editor.can().chain().focus().addColumnAfter().run(),
    },
    {
        value: 'addRowBefore',
        label: 'Add Row Above',
        icon: <IconPanelLeftClose className='rotate-90' />,
        action: (editor) => editor.chain().focus().addRowBefore().run(),
        canExecute: (editor) => editor.can().chain().focus().addRowBefore().run(),
    },
    {
        value: 'addRowAfter',
        label: 'Add Row Below',
        icon: <IconPanelRightClose className='rotate-90' />,
        action: (editor) => editor.chain().focus().addRowAfter().run(),
        canExecute: (editor) => editor.can().chain().focus().addRowAfter().run(),
    },
    {
        value: 'deleteColumn',
        label: 'Delete Column',
        icon: <IconDelete className='-rotate-90' />,
        action: (editor) => editor.chain().focus().deleteColumn().run(),
        canExecute: (editor) => editor.can().chain().focus().deleteColumn().run(),
    },
    {
        value: 'deleteRow',
        label: 'Delete Row',
        icon: <IconDelete />,
        action: (editor) => editor.chain().focus().deleteRow().run(),
        canExecute: (editor) => editor.can().chain().focus().deleteRow().run(),
    },
    {
        value: 'mergeOrSplit',
        label: 'Merge or Split',
        icon: <IconTableCellsMerge />,
        action: (editor) => editor.chain().focus().mergeOrSplit().run(),
        canExecute: (editor) => editor.can().chain().focus().mergeOrSplit().run(),
    },
    {
        value: 'deleteTable',
        label: 'Delete Table',
        icon: <IconTrash className='text-danger' />,
        action: (editor) => editor.chain().focus().deleteTable().run(),
        canExecute: (editor) => editor.can().chain().focus().deleteTable().run(),
    },
]

export const TableBubbleMenu = ({ editor }: { editor: Editor }) => {
    const shouldShow = React.useCallback(() => {
        if (editor.isActive('table')) {
            return true
        }
        return false
    }, [editor])

    return (
        <BubbleMenu editor={editor} shouldShow={shouldShow} tippyOptions={{ placement: 'bottom-start' }}>
            <Toolbar className='p-2'>
                <Toolbar.Group>
                    {actions.map((action) => (
                        <ToolbarButton
                            key={action.value}
                            isSelected={false}
                            tooltip={action.label}
                            onPress={() => action.action(editor)}
                            isDisabled={!action.canExecute(editor)}
                        >
                            {action.icon}
                        </ToolbarButton>
                    ))}
                </Toolbar.Group>
            </Toolbar>
        </BubbleMenu>
    )
}
