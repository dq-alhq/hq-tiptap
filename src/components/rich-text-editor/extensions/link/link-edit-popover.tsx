import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import { LinkEditBlock } from '@/components/rich-text-editor/extensions/link/link-edit-block'
import type { TiptapState } from '@/components/rich-text-editor/use-editor-state'
import { Popover } from '@/components/ui/popover'
import type { Editor } from '@tiptap/react'
import { IconLink } from 'hq-icons'
import React from 'react'

const LinkEditPopover = ({ editor, state }: { editor: Editor; state: TiptapState | null }) => {
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to, ' ')

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
                .setLink({ href: url })
                .run()

            editor.commands.enter()
        },
        [editor],
    )

    return (
        <Popover>
            <ToolbarButton isSelected={state?.isLink} tooltip='Link' isDisabled={state?.isCodeBlock}>
                <IconLink />
            </ToolbarButton>
            <Popover.Content className='w-full min-w-80'>
                <LinkEditBlock onSave={onSetLink} defaultText={text} />
            </Popover.Content>
        </Popover>
    )
}

export { LinkEditPopover }
