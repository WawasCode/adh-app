import { ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface SidebarProps {
  children: ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={cn(
      'w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto',
      className
    )}>
      {children}
    </aside>
  )
}

interface SidebarHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SidebarHeader({ title, subtitle, className }: SidebarHeaderProps) {
  return (
    <div className={cn('p-6 border-b border-gray-200', className)}>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

interface SidebarContentProps {
  children: ReactNode
  className?: string
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}
