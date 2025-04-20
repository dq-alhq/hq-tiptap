import { Extension } from '@tiptap/react'

export const PreventTabLostFocus = Extension.create({
    name: 'preventTabLostFocus',

    addKeyboardShortcuts() {
        return {
            Tab: ({ editor }) => {
                if (editor.state.selection.empty && !editor.isActive('bulletList') && !editor.isActive('orderedList')) {
                    return editor.chain().focus().insertContent('    ').run()
                }

                return false
            },
        }
    },
})
