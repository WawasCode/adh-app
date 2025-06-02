import { InputHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

/**
 * Input component for text input fields.
 * @param props - Input HTML attributes and custom className.
 */
export function Input(props: InputProps) {
  return (
    <input
      type={props.type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.className
      )}
      {...props}
    />
  )
}
