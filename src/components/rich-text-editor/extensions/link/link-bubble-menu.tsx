import { BubbleMenu } from '@/components/rich-text-editor/components/bubble-menu'
import type { ShouldShowProps } from '@/components/rich-text-editor/components/bubble-menu'
import { LinkEditBlock } from '@/components/rich-text-editor/extensions/link/link-edit-block'
import { LinkPopoverBlock } from '@/components/rich-text-editor/extensions/link/link-popover-block'
import type { Editor } from '@tiptap/react'
import React from 'react'

interface LinkAttributes {
    href: string
    target: string
}

export const LinkBubbleMenu = ({ editor }: { editor: Editor }) => {
    const [showEdit, setShowEdit] = React.useState(false)
    const [linkAttrs, setLinkAttrs] = React.useState<LinkAttributes>({
        href: '',
        target: '',
    })
    const [selectedText, setSelectedText] = React.useState('')

    const updateLinkState = React.useCallback(() => {
        const { from, to } = editor.state.selection
        const { href, target } = editor.getAttributes('link')
        const text = editor.state.doc.textBetween(from, to, ' ')

        setLinkAttrs({ href, target })
        setSelectedText(text)
    }, [editor])

    const shouldShow = React.useCallback(
        ({ editor, from, to }: ShouldShowProps) => {
            if (from === to) {
                return false
            }
            const { href } = editor.getAttributes('link')

            if (!editor.isEditable || !editor.isActive('link')) {
                return false
            }

            if (href) {
                updateLinkState()
                return true
            }
            return false
        },
        [updateLinkState],
    )

    const handleEdit = React.useCallback(() => {
        setShowEdit(true)
    }, [])

    const onSetLink = React.useCallback(
        (url: string, text?: string, openInNewTab?: boolean) => {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .insertContent({
                    type: 'text',
                    text: text || url,
                    marks: [
                        {
                            type: 'link',
                            attrs: {
                                href: url,
                                target: openInNewTab ? '_blank' : '',
                            },
                        },
                    ],
                })
                .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
                .run()
            setShowEdit(false)
            updateLinkState()
        },
        [editor, updateLinkState],
    )

    const onUnsetLink = React.useCallback(() => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        setShowEdit(false)
        updateLinkState()
    }, [editor, updateLinkState])

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={shouldShow}
            tippyOptions={{ placement: 'bottom-start', onHidden: () => setShowEdit(false) }}
        >
            {showEdit ? (
                <LinkEditBlock
                    defaultUrl={linkAttrs.href}
                    defaultText={selectedText}
                    defaultIsNewTab={linkAttrs.target === '_blank'}
                    onSave={onSetLink}
                />
            ) : (
                <LinkPopoverBlock onClear={onUnsetLink} url={linkAttrs.href} onEdit={handleEdit} />
            )}
        </BubbleMenu>
    )
}
