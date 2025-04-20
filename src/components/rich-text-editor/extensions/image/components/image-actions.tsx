import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import { IconClipboard, IconCopy, IconDownload, IconZoomIn } from 'hq-icons'
import React from 'react'

interface ImageActionsProps {
    shouldMerge?: boolean
    isLink?: boolean
    onView?: () => void
    onDownload?: () => void
    onCopy?: () => void
    onCopyLink?: () => void
}

type ActionKey = 'onView' | 'onDownload' | 'onCopy' | 'onCopyLink'

const ActionItems: Array<{
    key: ActionKey
    icon: React.ReactNode
    tooltip: string
    isLink?: boolean
}> = [
    {
        key: 'onView',
        icon: <IconZoomIn />,
        tooltip: 'View image',
    },
    {
        key: 'onDownload',
        icon: <IconDownload />,
        tooltip: 'Download image',
    },
    {
        key: 'onCopy',
        icon: <IconClipboard />,
        tooltip: 'Copy image to clipboard',
    },
    {
        key: 'onCopyLink',
        icon: <IconCopy />,
        tooltip: 'Copy image link',
        isLink: true,
    },
]

export const ImageActions = React.memo(({ isLink = false, ...actions }: ImageActionsProps) => {
    const handleAction = React.useCallback((action: (() => void) | undefined) => {
        action?.()
    }, [])

    const filteredActions = React.useMemo(() => ActionItems.filter((item) => isLink || !item.isLink), [isLink])

    return filteredActions.map(({ key, icon, tooltip }) => (
        <ToolbarButton key={key} tooltip={tooltip} onPress={() => handleAction(actions[key])} isSelected={false}>
            {icon}
        </ToolbarButton>
    ))
})
