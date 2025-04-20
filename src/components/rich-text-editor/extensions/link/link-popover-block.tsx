import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import { Toolbar } from '@/components/ui'
import { cn } from '@/lib/utils'
import { IconCheck, IconClipboard, IconExternalLink, IconPencil, IconUnlink } from 'hq-icons'
import React from 'react'

interface LinkPopoverBlockProps {
    url: string
    onClear: () => void
    onEdit: () => void
}

export const LinkPopoverBlock = ({ url, onClear, onEdit }: LinkPopoverBlockProps) => {
    const [copied, setCopied] = React.useState<boolean>(false)

    const handleCopy = React.useCallback(() => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1000)
            })
            .catch(console.error)
    }, [url])

    const handleOpenLink = React.useCallback(() => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }, [url])

    return (
        <Toolbar className='p-2'>
            <Toolbar.Group>
                <ToolbarButton icon={false} isSelected={false} tooltip='Edit link' onPress={onEdit}>
                    <IconPencil /> Edit Link
                </ToolbarButton>
                <ToolbarButton isSelected={false} tooltip='Open link in a new tab' onPress={handleOpenLink}>
                    <IconExternalLink />
                </ToolbarButton>
                <ToolbarButton isSelected={false} tooltip='Clear link' onPress={onClear}>
                    <IconUnlink />
                </ToolbarButton>
                <ToolbarButton isSelected={false} tooltip='Copy' onPress={handleCopy}>
                    <IconClipboard
                        className={cn('rotate-0 scale-100 transition-all duration-200', copied && 'rotate-90 scale-0')}
                    />
                    <IconCheck
                        className={cn(
                            'absolute rotate-90 scale-0 transition-all duration-200',
                            copied && 'rotate-0 scale-100',
                        )}
                    />
                </ToolbarButton>
            </Toolbar.Group>
        </Toolbar>
    )
}
