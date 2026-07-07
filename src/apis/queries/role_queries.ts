import { useQuery } from '@tanstack/react-query'

import { AxiosFetcher } from '@/apis/configs'
import { roles } from '@/apis/endpoints/role_apis'
import type { ApiResponse } from '@/apis/types/common_type'
import type { RolesResponseData } from '@/apis/types/role_type'

export const roleQueryKeys = {
  lists: ['roles'] as const,
}

export const useRolesQuery = () =>
  useQuery({
    queryKey: roleQueryKeys.lists,
    queryFn: () => AxiosFetcher<ApiResponse<RolesResponseData>>(roles),
  })
