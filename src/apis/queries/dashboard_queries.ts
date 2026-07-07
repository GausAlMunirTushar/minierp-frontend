import { useQuery } from '@tanstack/react-query'

import { AxiosFetcher } from '@/apis/configs'
import { dashboardStats } from '@/apis/endpoints/dashboard_apis'
import type { ApiResponse } from '@/apis/types/common_type'
import type { DashboardStats } from '@/apis/types/dashboard_type'

export const dashboardQueryKeys = {
  stats: ['dashboard', 'stats'] as const,
}

export const useDashboardStatsQuery = () =>
  useQuery({
    queryKey: dashboardQueryKeys.stats,
    queryFn: () => AxiosFetcher<ApiResponse<DashboardStats>>(dashboardStats),
  })
