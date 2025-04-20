import {
    Alignment,
    Element,
    ListItem,
    Table,
    TextColor,
    TextFormat,
    TextStyle,
} from '@/components/rich-text-editor/components/section'
import { LinkBubbleMenu } from '@/components/rich-text-editor/extensions/link/link-bubble-menu'
import { TableBubbleMenu } from '@/components/rich-text-editor/extensions/table/table-bubble-menu'
import { type TiptapState, useTiptapState } from '@/components/rich-text-editor/use-editor-state'
import type { UseTiptapEditorProps } from '@/components/rich-text-editor/use-tiptap'
import { useTiptapEditor } from '@/components/rich-text-editor/use-tiptap'
import { FieldGroup, Toolbar } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Content, Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import { CodeBlockBubbleMenu } from './extensions/code-block-lowlight/code-block-bubble-menu'

export interface TiptapProps extends Omit<UseTiptapEditorProps, 'onUpdate'> {
    value?: Content
    onChange?: (value: Content) => void
    className?: string
}

const EditorToolbar = ({ editor, state }: { editor: Editor; state: TiptapState | null }) => (
    <Toolbar
        orientation='horizontal'
        className='p-2 mb-1 sm:mt-1 overflow-auto sticky w-[calc(100%-8px)] rounded-lg border shadow-sm bottom-1 sm:bottom-auto sm:top-1 bg-bg z-30'
    >
        <TextStyle editor={editor} levels={[1, 2, 3, 4, 5, 6]} state={state} />
        <Toolbar.Separator />
        <TextFormat
            editor={editor}
            actions={['bold', 'italic', 'underline', 'strikethrough', 'code', 'clearFormatting']}
            state={state}
        />
        <Toolbar.Separator />
        <TextColor editor={editor} state={state} />
        <Toolbar.Separator />
        <Alignment editor={editor} />
        <Toolbar.Separator />
        <ListItem editor={editor} state={state} />
        <Toolbar.Separator />
        <Element editor={editor} state={state} />
        <Toolbar.Separator />
        <Table editor={editor} />
    </Toolbar>
)

export const RichTextEditor = ({ value, onChange, className, ...props }: TiptapProps) => {
    const editor = useTiptapEditor({
        value,
        onUpdate: onChange,
        ...props,
    })

    const state = useTiptapState({ editor })

    if (!editor) {
        return null
    }
    return (
        <FieldGroup className={cn('flex flex-col-reverse sm:flex-col h-full', className)}>
            <EditorToolbar editor={editor} state={state} />
            <EditorContent editor={editor} className={'minimal-tiptap-editor size-full p-2.5'} />
            <LinkBubbleMenu editor={editor} />
            <TableBubbleMenu editor={editor} />
            <CodeBlockBubbleMenu editor={editor} />
        </FieldGroup>
    )
}
