import { Strike as TiptapStrike } from '@tiptap/extension-strike'
import { markInputRule } from '@tiptap/react'
import { StarterKit as TiptapStarterKit } from '@tiptap/starter-kit'

const Strike = TiptapStrike.extend({
    addInputRules() {
        return [
            markInputRule({
                find: /(?:^|\s)((?:~)((?:[^~]+))(?:~))$/,
                type: this.type,
            }),
        ]
    },
})

export const StarterKit = [
    TiptapStarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
        strike: false,
        paragraph: { HTMLAttributes: { class: 'text-node' } },
        heading: { HTMLAttributes: { class: 'heading-node' } },
        blockquote: { HTMLAttributes: { class: 'block-node' } },
        bulletList: { HTMLAttributes: { class: 'list-node' } },
        orderedList: { HTMLAttributes: { class: 'list-node' } },
        code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
        dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
    }),
    Strike,
]
