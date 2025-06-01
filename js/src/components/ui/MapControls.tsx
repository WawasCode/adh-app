import { ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface MapControlsProps {
  children: ReactNode
  className?: string
}

export function MapControls({ children, className }: MapControlsProps) {
  return (
    <div className={cn(
      'absolute top-4 right-4 z-[1000] space-y-2',
      className
    )}>
      {children}
    </div>
  )
}

interface ControlButtonProps {
  onClick?: () => void
  icon?: ReactNode
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ControlButton({
  onClick,
  icon,
  children,
  variant = 'primary',
  size = 'md',
  className
}: ControlButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105'
  
  const variantClasses = {
    primary: 'bg-blue-600/90 text-white hover:bg-blue-700/90 border border-blue-500/50',
    secondary: 'bg-white/90 text-gray-700 hover:bg-gray-50/90 border border-gray-200/50',
    danger: 'bg-red-600/90 text-white hover:bg-red-700/90 border border-red-500/50'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}
