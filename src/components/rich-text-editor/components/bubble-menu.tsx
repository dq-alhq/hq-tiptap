import type { EditorState } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import type { Editor, BubbleMenuProps as TiptapBubbleMenuProps } from '@tiptap/react'
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react'
import type { Props } from 'tippy.js'
export interface ShouldShowProps {
    editor: Editor
    view: EditorView
    state: EditorState
    oldState?: EditorState
    from: number
    to: number
}

export interface BubbleMenuProps extends TiptapBubbleMenuProps {
    shouldShow: ({ editor, view, state, oldState, from, to }: ShouldShowProps) => boolean
    tippyOptions?: Partial<Props>
}

export const BubbleMenu = ({ editor, shouldShow, tippyOptions, children }: BubbleMenuProps) => {
    return (
        <TiptapBubbleMenu
            editor={editor}
            shouldShow={shouldShow}
            tippyOptions={{
                arrow: svgArrow,
                ...tippyOptions,
            }}
            className='w-full rounded-lg bg-bg border text-fg shadow-md outline-hidden'
        >
            {children}
        </TiptapBubbleMenu>
    )
}

const svgArrow = `<svg width="12px" height="12px" viewBox="0 0 12 12" class="fill-bg stroke-muted"><title>Arrow</title><path d="M0 0 L6 6 L12 0" /></svg>`
