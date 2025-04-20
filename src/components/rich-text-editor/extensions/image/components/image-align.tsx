import { ToolbarButton } from '@/components/rich-text-editor/components/toolbar-button'
import { IconAlignCenterVertical, IconAlignEndVertical, IconAlignStartVertical } from 'hq-icons'
import React from 'react'

interface ImageAlignProps {
    onLeft: () => void
    onCenter: () => void
    onRight: () => void
    currentAlign: 'left' | 'center' | 'right'
}

type ActionKey = 'left' | 'center' | 'right'

const ActionItems: Array<{
    key: ActionKey
    icon: React.ReactNode
    tooltip: string
    isLink?: boolean
}> = [
    {
        key: 'left',
        icon: <IconAlignStartVertical />,
        tooltip: 'Align left',
    },
    {
        key: 'center',
        icon: <IconAlignCenterVertical />,
        tooltip: 'Align center',
    },
    {
        key: 'right',
        icon: <IconAlignEndVertical />,
        tooltip: 'Align right',
    },
]

export const ImageAlign = React.memo(({ onLeft, onCenter, onRight, currentAlign }: ImageAlignProps) => {
    const handleAction = React.useCallback((action: (() => void) | undefined) => {
        action?.()
    }, [])

    return ActionItems.map(({ key, icon, tooltip }) => (
        <ToolbarButton
            key={key}
            tooltip={tooltip}
            onPress={() => handleAction(key === 'right' ? onRight : key === 'center' ? onCenter : onLeft)}
            isSelected={currentAlign === key}
        >
            {icon}
        </ToolbarButton>
    ))
})
