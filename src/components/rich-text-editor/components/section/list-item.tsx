import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import type { FormatAction } from '@/components/rich-text-editor/components/toolbar-button'
import type { TiptapState } from '@/components/rich-text-editor/use-editor-state'
import { Keyboard, Toolbar } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import { IconList, IconListOrdered } from 'hq-icons'

type ListItemAction = 'orderedList' | 'bulletList'
interface ListItem extends FormatAction {
    value: ListItemAction
}

const actions: ListItem[] = [
    {
        value: 'orderedList',
        label: 'Numbered list',
        icon: <IconListOrdered />,
        isActive: (state) => state?.isOrderedList || false,
        action: (editor) => editor.chain().focus().toggleOrderedList().run(),
        canExecute: (editor) => editor.can().chain().focus().toggleOrderedList().run(),
        shortcuts: ['mod', 'shift', '7'],
    },
    {
        value: 'bulletList',
        label: 'Bullet list',
        icon: <IconList />,
        isActive: (state) => state?.isBulletList || false,
        action: (editor) => editor.chain().focus().toggleBulletList().run(),
        canExecute: (editor) => editor.can().chain().focus().toggleBulletList().run(),
        shortcuts: ['mod', 'shift', '8'],
    },
]

export const ListItem = ({ editor, state }: { editor: Editor; state: TiptapState | null }) => {
    return (
        <Toolbar.Group>
            {actions.map((action) => (
                <ToolbarButton
                    key={action.value}
                    tooltip={
                        <>
                            <span className='mr-2'>{action.label}</span>
                            <Keyboard keys={action.shortcuts} />
                        </>
                    }
                    aria-label={action.label}
                    isDisabled={!action.canExecute(editor)}
                    onChange={() => action.action(editor)}
                    isSelected={action.isActive(state)}
                >
                    {action.icon}
                </ToolbarButton>
            ))}
        </Toolbar.Group>
    )
}
