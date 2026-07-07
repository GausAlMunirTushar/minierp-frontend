import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PermissionGroupSkeleton } from '@/components/ui/skeletons/PermissionGroupSkeleton'

export function RoleCardSkeleton() {
  return (
    <Card aria-hidden>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-20" />
      </CardHeader>
      <CardContent>
        <PermissionGroupSkeleton />
      </CardContent>
    </Card>
  )
}
