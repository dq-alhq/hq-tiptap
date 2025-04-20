import { type Editor, type EditorStateSnapshot, useEditorState } from '@tiptap/react'

export interface TiptapState {
    isH1: boolean | undefined
    isH2: boolean | undefined
    isH3: boolean | undefined
    isH4: boolean | undefined
    isH5: boolean | undefined
    isH6: boolean | undefined
    isBold: boolean | undefined
    isItalic: boolean | undefined
    isUnderline: boolean | undefined
    isStrikethrough: boolean | undefined
    isCode: boolean | undefined
    isBulletList: boolean | undefined
    isOrderedList: boolean | undefined
    isBlockquote: boolean | undefined
    isCodeBlock: boolean | undefined
    isLink: boolean | undefined
    isImage: boolean | undefined
    isTable: boolean | undefined
    textColor: string
}

export const useTiptapState = ({ editor }: { editor: Editor | null }) => {
    const editorState = useEditorState({
        editor,
        selector: (state: EditorStateSnapshot) => ({
            // TextStyles
            isH1: state.editor?.isActive('heading', { level: 1 }),
            isH2: state.editor?.isActive('heading', { level: 2 }),
            isH3: state.editor?.isActive('heading', { level: 3 }),
            isH4: state.editor?.isActive('heading', { level: 4 }),
            isH5: state.editor?.isActive('heading', { level: 5 }),
            isH6: state.editor?.isActive('heading', { level: 6 }),
            // TextFormat
            isBold: state.editor?.isActive('bold'),
            isItalic: state.editor?.isActive('italic'),
            isUnderline: state.editor?.isActive('underline'),
            isStrikethrough: state.editor?.isActive('strikethrough'),
            isCode: state.editor?.isActive('code'),
            // List Item
            isBulletList: state.editor?.isActive('bulletList'),
            isOrderedList: state.editor?.isActive('orderedList'),
            // Element
            isBlockquote: state.editor?.isActive('blockquote'),
            isCodeBlock: state.editor?.isActive('codeBlock'),
            isLink: state.editor?.isActive('link'),
            isImage: state.editor?.isActive('image'),
            // Table
            isTable: state.editor?.isActive('table'),
            textColor: state.editor?.getAttributes('textStyle')?.color || 'var(--fg)',
        }),
        equalityFn: (prev, next) => {
            return JSON.stringify(prev) === JSON.stringify(next)
        },
    })

    return editorState
}
