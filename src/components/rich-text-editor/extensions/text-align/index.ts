import { TextAlign as TiptapTextAlign } from '@tiptap/extension-text-align'

export const TextAlign = TiptapTextAlign.configure({
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
    types: ['heading', 'paragraph', 'code', 'image', 'tableCell'],
})
