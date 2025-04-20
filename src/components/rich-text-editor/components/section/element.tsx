import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import type { FormatAction } from '@/components/rich-text-editor/components/toolbar-button'
import { ImageEditDialog } from '@/components/rich-text-editor/extensions/image/components/image-edit-dialog'
import { LinkEditPopover } from '@/components/rich-text-editor/extensions/link/link-edit-popover'
import type { TiptapState } from '@/components/rich-text-editor/use-editor-state'
import { Keyboard, Toolbar } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import { IconMinus, IconQuote, IconSquareCode } from 'hq-icons'

type InsertElementAction = 'codeBlock' | 'blockquote' | 'horizontalRule'
interface InsertElement extends FormatAction {
    value: InsertElementAction
}

const actions: InsertElement[] = [
    {
        value: 'codeBlock',
        label: 'Code block',
        icon: <IconSquareCode />,
        action: (editor) => editor?.chain().focus().toggleCodeBlock().run(),
        isActive: (state) => state?.isCodeBlock || false,
        canExecute: (editor) => editor?.can().chain().focus().toggleCodeBlock().run(),
        shortcuts: ['mod', 'alt', 'C'],
    },
    {
        value: 'blockquote',
        label: 'Blockquote',
        icon: <IconQuote />,
        action: (editor) => editor?.chain().focus().toggleBlockquote().run(),
        isActive: (state) => state?.isBlockquote || false,
        canExecute: (editor) => editor?.can().chain().focus().toggleBlockquote().run(),
        shortcuts: ['mod', 'shift', 'B'],
    },
    {
        value: 'horizontalRule',
        label: 'Divider',
        icon: <IconMinus />,
        action: (editor) => editor.chain().focus().setHorizontalRule().run(),
        isActive: () => false,
        canExecute: (editor) => editor.can().chain().focus().setHorizontalRule().run(),
        shortcuts: ['mod', 'alt', '-'],
    },
]

export const Element = ({ editor, state }: { editor: Editor; state: TiptapState | null }) => {
    return (
        <Toolbar.Group>
            <LinkEditPopover editor={editor} state={state} />
            <ImageEditDialog editor={editor} state={state} />
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
                    onPress={() => action.action(editor)}
                    isSelected={action.isActive(state)}
                >
                    {action.icon}
                </ToolbarButton>
            ))}
        </Toolbar.Group>
    )
}
