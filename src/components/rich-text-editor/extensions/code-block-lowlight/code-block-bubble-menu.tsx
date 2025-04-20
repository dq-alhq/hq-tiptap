import { BubbleMenu } from '@/components/rich-text-editor/components/bubble-menu'
import type { ShouldShowProps } from '@/components/rich-text-editor/components/bubble-menu'
import { Select } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import React from 'react'
import type { Key } from 'react-aria-components'
import { type GetReferenceClientRect, sticky } from 'tippy.js'
import { langs } from './langs'

export const CodeBlockBubbleMenu = ({ editor }: { editor: Editor }) => {
    const [language, setLanguage] = React.useState('')

    const shouldShow = React.useCallback(({ editor }: ShouldShowProps) => {
        if (!editor.isEditable || !editor.isActive('codeBlock')) {
            return false
        }

        const { language } = editor.getAttributes('codeBlock')
        setLanguage(language)

        return true
    }, [])

    const onSetCodeBlock = React.useCallback(
        (language: Key) => {
            setLanguage(language.toString())
            editor.chain().focus().setCodeBlock({ language: language.toString() }).run()
        },
        [editor],
    )

    const getReferenceClientRect: GetReferenceClientRect = () => {
        const node = document.getSelection()?.getRangeAt(0).startContainer?.parentElement
        if (!node) {
            return new DOMRect(-1000, -1000, 0, 0)
        }

        const blockNode = node?.closest?.('.block-node')
        if (!blockNode) {
            return new DOMRect(-1000, -1000, 0, 0)
        }

        return blockNode.getBoundingClientRect()
    }
    return (
        <BubbleMenu
            editor={editor}
            shouldShow={shouldShow}
            tippyOptions={{
                placement: 'top-end',
                arrow: false,
                offset: [-5, -40],
                popperOptions: {
                    modifiers: [{ name: 'flip', enabled: false }],
                },
                maxWidth: 'auto',
                getReferenceClientRect,
                plugins: [sticky],
                sticky: 'popper',
            }}
        >
            <Select
                searchable
                aria-label='Language'
                selectedKey={language}
                onSelectionChange={onSetCodeBlock}
                items={langs.map((lang) => ({ id: lang, label: lang }))}
                className='w-full border-0 min-w-42 h-8'
            >
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        </BubbleMenu>
    )
}
