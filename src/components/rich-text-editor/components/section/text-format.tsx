import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import type { FormatAction } from '@/components/rich-text-editor/components/toolbar-button'
import type { TiptapState } from '@/components/rich-text-editor/use-editor-state'
import { Keyboard, Toolbar } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import { IconBold, IconCode, IconEraser, IconItalic, IconStrikethrough, IconUnderline } from 'hq-icons'

type TextFormatAction = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'clearFormatting'

interface TextFormat extends FormatAction {
    value: TextFormatAction
}

const formatActions: TextFormat[] = [
    {
        value: 'bold',
        label: 'Bold',
        icon: <IconBold className='size-5' />,
        action: (editor) => editor.chain().focus().toggleBold().run(),
        isActive: (state) => state?.isBold ?? false,
        canExecute: (editor) => editor.can().chain().focus().toggleBold().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'B'],
    },
    {
        value: 'italic',
        label: 'Italic',
        icon: <IconItalic className='size-5' />,
        action: (editor) => editor.chain().focus().toggleItalic().run(),
        isActive: (state) => state?.isItalic ?? false,
        canExecute: (editor) => editor.can().chain().focus().toggleItalic().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'I'],
    },
    {
        value: 'underline',
        label: 'Underline',
        icon: <IconUnderline className='size-5' />,
        action: (editor) => editor.chain().focus().toggleUnderline().run(),
        isActive: (state) => state?.isUnderline ?? false,
        canExecute: (editor) => editor.can().chain().focus().toggleUnderline().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'U'],
    },
    {
        value: 'strikethrough',
        label: 'Strikethrough',
        icon: <IconStrikethrough className='size-5' />,
        action: (editor) => editor.chain().focus().toggleStrike().run(),
        isActive: (state) => state?.isStrikethrough ?? false,
        canExecute: (editor) => editor.can().chain().focus().toggleStrike().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'shift', 'S'],
    },
    {
        value: 'code',
        label: 'Code',
        icon: <IconCode className='size-5' />,
        action: (editor) => editor.chain().focus().toggleCode().run(),
        isActive: (state) => state?.isCode ?? false,
        canExecute: (editor) => editor.can().chain().focus().toggleCode().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', 'E'],
    },
    {
        value: 'clearFormatting',
        label: 'Clear formatting',
        icon: <IconEraser className='size-5' />,
        action: (editor) => editor.chain().focus().unsetAllMarks().run(),
        isActive: () => false,
        canExecute: (editor) => editor.can().chain().focus().unsetAllMarks().run() && !editor.isActive('codeBlock'),
        shortcuts: ['mod', '\\'],
    },
]

export const TextFormat = ({
    editor,
    actions,
    state,
}: { editor: Editor; actions: TextFormatAction[]; state: TiptapState | null }) => {
    return (
        <Toolbar.Group>
            {formatActions
                .filter((action) => actions.includes(action.value))
                .map((action) => (
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
