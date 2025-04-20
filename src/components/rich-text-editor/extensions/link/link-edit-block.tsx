import { Button, Switch, TextField } from '@/components/ui'
import { cn } from '@/lib/utils'
import React from 'react'

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultUrl?: string
    defaultText?: string
    defaultIsNewTab?: boolean
    onSave: (url: string, text?: string, isNewTab?: boolean) => void
    ref?: React.Ref<HTMLDivElement>
}

export const LinkEditBlock = ({
    onSave,
    defaultIsNewTab,
    defaultUrl,
    defaultText,
    className,
    ref,
}: LinkEditorProps) => {
    const formRef = React.useRef<HTMLDivElement>(null)
    const [url, setUrl] = React.useState(defaultUrl || '')
    const [text, setText] = React.useState(defaultText || '')
    const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab || false)

    const handleSave = React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            if (formRef.current) {
                const isValid = Array.from(formRef.current.querySelectorAll('input')).every((input) =>
                    input.checkValidity(),
                )

                if (isValid) {
                    onSave(url, text, isNewTab)
                } else {
                    for (const input of formRef.current.querySelectorAll('input')) {
                        if (!input.checkValidity()) {
                            input.reportValidity()
                        }
                    }
                }
            }
        },
        [onSave, url, text, isNewTab],
    )

    React.useImperativeHandle(ref, () => formRef.current as HTMLDivElement)

    return (
        <div className={cn('grid grid-cols-2 gap-3 p-4', className)} ref={formRef}>
            <TextField
                label='URL'
                id='url'
                type='url'
                isRequired
                placeholder='Enter URL'
                value={url}
                onChange={(e) => setUrl(e)}
                className='col-span-full'
            />

            <TextField
                label='Display Text (optional)'
                id='display-text'
                type='text'
                placeholder='Enter display text'
                value={text}
                onChange={(e) => setText(e)}
                className='col-span-full'
            />

            <Switch isSelected={isNewTab} onChange={setIsNewTab}>
                Open in new tab
            </Switch>

            <Button type='button' onClick={handleSave}>
                Save
            </Button>
        </div>
    )
}
