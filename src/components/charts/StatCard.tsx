import React from 'react'

import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'yellow' | 'gray' | 'pink'
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
  isLoading?: boolean
}

const colorMap: Record<NonNullable<StatCardProps['color']>, string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300',
  green:
    'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300',
  purple:
    'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300',
  orange:
    'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300',
  red: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300',
  indigo:
    'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300',
  yellow:
    'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-300',
  gray: 'bg-muted border-border text-foreground',
  pink: 'bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-950 dark:border-pink-800 dark:text-pink-300',
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
  className = '',
  isLoading = false,
}) => {
  const colorClasses = colorMap[color] ?? colorMap.blue

  if (isLoading) {
    return (
      <div className={cn('rounded-xl border p-4 transition-all duration-200 sm:p-5', colorClasses, className)}>
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-current/20"></div>
            <div className="h-6 w-16 animate-pulse rounded bg-current/20"></div>
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-current/20"></div>
          </div>
          <div className="h-8 w-8 animate-pulse rounded bg-current/20"></div>
        </div>
        <div className="mt-3 h-3 w-16 animate-pulse rounded bg-current/20"></div>
      </div>
    )
  }

  return (
    <div
      className={cn('rounded-xl border p-4 transition-all duration-200 hover:shadow-md sm:p-5', colorClasses, className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-80 sm:text-sm">{title}</p>
          <h3 className="mt-1 text-xl font-bold sm:text-2xl">{value}</h3>
          {subtitle && <p className="mt-1 text-xs opacity-70">{subtitle}</p>}
        </div>
        {icon && <div className="text-xl sm:text-2xl">{icon}</div>}
      </div>
      {trend && (
        <div
          className={cn(
            'mt-2 text-xs sm:mt-3 sm:text-sm',
            trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
          )}
        >
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
