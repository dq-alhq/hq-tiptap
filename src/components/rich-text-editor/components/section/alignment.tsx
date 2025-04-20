import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import type { FormatAction } from '@/components/rich-text-editor/components/toolbar-button'
import { Keyboard, Toolbar } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import { IconAlignCenter, IconAlignJustify, IconAlignLeft, IconAlignRight } from 'hq-icons'

type AlignmentAction = 'left' | 'center' | 'right' | 'justify'
interface Alignment extends Omit<FormatAction, 'isActive'> {
    value: AlignmentAction
    isActive: (editor: Editor) => boolean | undefined
}

const actions: Alignment[] = [
    {
        value: 'left',
        label: 'Left align',
        icon: <IconAlignLeft />,
        isActive: (editor) => editor.isActive({ textAlign: 'left' }),
        action: (editor) => editor.chain().focus().setTextAlign('left').run(),
        canExecute: (editor) => editor?.can().chain().focus().setTextAlign('left').run(),
        shortcuts: ['mod', 'shift', 'l'],
    },
    {
        value: 'center',
        label: 'Center align',
        icon: <IconAlignCenter />,
        isActive: (editor) => editor.isActive({ textAlign: 'center' }),
        action: (editor) => editor.chain().focus().setTextAlign('center').run(),
        canExecute: (editor) => editor.can().chain().focus().setTextAlign('center').run(),
        shortcuts: ['mod', 'shift', 'e'],
    },
    {
        value: 'right',
        label: 'Right align',
        icon: <IconAlignRight />,
        isActive: (editor) => editor.isActive({ textAlign: 'right' }),
        action: (editor) => editor.chain().focus().setTextAlign('right').run(),
        canExecute: (editor) => editor.can().chain().focus().setTextAlign('right').run(),
        shortcuts: ['mod', 'shift', 'r'],
    },
    {
        value: 'justify',
        label: 'Justify align',
        icon: <IconAlignJustify />,
        isActive: (editor) => editor.isActive({ textAlign: 'justify' }),
        action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
        canExecute: (editor) => editor.can().chain().focus().setTextAlign('justify').run(),
        shortcuts: ['mod', 'shift', 'j'],
    },
]

export const Alignment = ({ editor }: { editor: Editor }) => {
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
                    onClick={() => action.action(editor)}
                    isSelected={action.isActive(editor)}
                >
                    {action.icon}
                </ToolbarButton>
            ))}
        </Toolbar.Group>
    )
}
