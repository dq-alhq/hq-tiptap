import { cn } from '@/lib/utils'

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            slot='card'
            className={cn(
                'flex flex-col rounded-lg border bg-bg text-fg shadow-xs has-[table]:overflow-hidden **:[[slot=table]]:rounded-none **:[[slot=table]]:border-x-0',
                className,
            )}
            {...props}
        />
    )
}

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
}

const CardHeader = ({ className, title, description, children, ...props }: HeaderProps) => (
    <div
        slot='header'
        className={cn(
            'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-6 has-[[slot=action]]:grid-cols-[1fr_auto]',
            className,
        )}
        {...props}
    >
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
        {!title && typeof children === 'string' ? <CardTitle>{children}</CardTitle> : children}
    </div>
)

const CardTitle = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div slot='title' className={cn('font-semibold text-lg leading-none tracking-tight', className)} {...props} />
    )
}

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div slot='description' className={cn('row-start-2 text-muted-fg text-sm', className)} {...props} />
}

const CardAction = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            slot='action'
            className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
            {...props}
        />
    )
}

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div slot='content' className={cn('px-6 has-[table]:p-0', className)} {...props} />
}

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            slot='footer'
            className={cn('flex flex-col-reverse items-center justify-end p-6 lg:flex-row', className)}
            {...props}
        />
    )
}

Card.Content = CardContent
Card.Description = CardDescription
Card.Footer = CardFooter
Card.Header = CardHeader
Card.Title = CardTitle
Card.Action = CardAction

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
