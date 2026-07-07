import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return <img src="/logo.png" alt="Mini ERP" className={cn('h-9 w-9 object-contain', className)} />
}
