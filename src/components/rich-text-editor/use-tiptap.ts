import {
    CodeBlockLowlight,
    Color,
    FileHandler,
    HorizontalRule,
    Image,
    Link,
    PreventTabLostFocus,
    ResetMarksOnEnter,
    Selection,
    StarterKit,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    TextAlign,
    UnsetAllMarks,
} from '@/components/rich-text-editor/extensions'
import { getOutput } from '@/components/rich-text-editor/utils'
import { cn } from '@/lib/utils'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import type { Editor } from '@tiptap/react'
import type { Content, UseEditorOptions } from '@tiptap/react'
import { useEditor } from '@tiptap/react'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

export interface UseTiptapEditorProps extends UseEditorOptions {
    value?: Content
    output?: 'html' | 'json' | 'text'
    placeholder?: string
    throttleDelay?: number
    onUpdate?: (content: Content) => void
    onBlur?: (content: Content) => void
    className?: string
}

export const useTiptapEditor = ({
    value,
    output = 'html',
    placeholder = '',
    throttleDelay = 1000,
    onUpdate,
    onBlur,
    ...props
}: UseTiptapEditorProps) => {
    const handleUpdate = useDebouncedCallback((editor: Editor) => onUpdate?.(getOutput(editor, output)), throttleDelay)

    const handleCreate = React.useCallback(
        (editor: Editor) => {
            if (value && editor.isEmpty) {
                editor.commands.setContent(value)
            }
        },
        [value],
    )

    const handleBlur = React.useCallback((editor: Editor) => onBlur?.(getOutput(editor, output)), [output, onBlur])

    const editor = useEditor({
        extensions: [
            ...StarterKit,
            Link,
            Underline,
            Image,
            FileHandler,
            Color,
            TextStyle,
            Selection,
            Typography,
            UnsetAllMarks,
            HorizontalRule,
            ResetMarksOnEnter,
            PreventTabLostFocus,
            CodeBlockLowlight,
            Table,
            TableHeader,
            TableRow,
            TableCell,
            Superscript,
            Subscript,
            TextAlign,
            Placeholder.configure({ placeholder: () => placeholder }),
        ],
        editorProps: {
            attributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                class: cn('outline-hidden min-h-72'),
            },
        },
        onUpdate: ({ editor }) => handleUpdate(editor),
        onCreate: ({ editor }) => handleCreate(editor),
        onBlur: ({ editor }) => handleBlur(editor),
        shouldRerenderOnTransaction: false,
        ...props,
    })

    return editor
}
