import { HTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

/**
 * Card component for displaying content in a styled container.
 * @param props - HTML div attributes and custom className.
 */
export function Card(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', props.className)} {...props} />
  )
}

/**
 * CardHeader component for the card's header section.
 * @param props - HTML div attributes and custom className.
 */
export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', props.className)} {...props} />
  )
}

/**
 * CardTitle component for the card's title.
 * @param props - HTML heading attributes and custom className.
 */
export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', props.className)} {...props} />
  )
}

/**
 * CardDescription component for the card's description.
 * @param props - HTML paragraph attributes and custom className.
 */
export function CardDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted-foreground', props.className)} {...props} />
  )
}

/**
 * CardContent component for the card's main content area.
 * @param props - HTML div attributes and custom className.
 */
export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', props.className)} {...props} />
  )
}

/**
 * CardFooter component for the card's footer section.
 * @param props - HTML div attributes and custom className.
 */
export function CardFooter(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center p-6 pt-0', props.className)} {...props} />
  )
}
