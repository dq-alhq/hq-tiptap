import { IconCircleAlert, IconCircleCheck, IconInfo } from 'hq-icons'

import { cn } from '@/lib/utils'

interface NoteProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'info' | 'success' | 'warning' | 'outline'
    hideIndicator?: boolean
}

const Note = ({ hideIndicator = false, variant = 'primary', className, children, ...props }: NoteProps) => {
    const iconMap: Record<string, React.ElementType | null> = {
        primary: IconInfo,
        info: IconInfo,
        warning: IconCircleAlert,
        danger: IconCircleAlert,
        success: IconCircleCheck,
        secondary: null,
        outline: null,
    }

    const Icon = iconMap[variant] || null

    return (
        <div
            className={cn(
                'w-full overflow-hidden rounded-lg border p-4 text-sm backdrop-blur-2xl',
                variant === 'primary' && 'border-primary/30 bg-primary/10 text-primary',
                variant === 'secondary' && 'border-muted bg-secondary/25 text-secondary-foreground',
                variant === 'warning' && 'border-warning/40 bg-warning/5 text-warning',
                variant === 'danger' && 'border-danger/30 bg-danger/10 text-danger',
                variant === 'success' && 'border-success/20 bg-success/10 text-success',
                variant === 'info' && 'border-info/35 bg-info/10 text-info',
                variant === 'outline' && 'border-muted bg-bg/10 text-fg',
                className,
            )}
            {...props}
        >
            <div className='flex grow items-start'>
                {Icon && !hideIndicator && (
                    <Icon className='my-0.5 mr-3 size-5 shrink-0 rounded-full ring-2 ring-current/30' />
                )}
                {children}
            </div>
        </div>
    )
}

export { Note }
