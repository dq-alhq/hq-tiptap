import type { TiptapState } from '@/components/rich-text-editor/use-editor-state'
import { type ToggleProps, Toolbar, Tooltip } from '@/components/ui'
import type { Editor } from '@tiptap/react'
import type React from 'react'

interface ToolbarButtonProps extends ToggleProps {
    tooltip?: React.ReactNode
}

export interface FormatAction {
    label: string
    icon?: React.ReactNode
    action: (editor: Editor) => void
    isActive: (state: TiptapState | null) => boolean
    canExecute: (editor: Editor) => boolean
    shortcuts: string[]
    value: string
}

export const ToolbarButton = ({ tooltip, icon = true, variant = 'solid', ...props }: ToolbarButtonProps) => {
    return (
        <Tooltip delay={500}>
            <Toolbar.Item {...props} icon={icon} variant={variant} size='sm' />
            <Tooltip.Content placement='bottom start'>{tooltip}</Tooltip.Content>
        </Tooltip>
    )
}
