import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiClient } from '@/apis/configs'
import { roleByName } from '@/apis/endpoints/role_apis'
import { roleQueryKeys } from '@/apis/queries/role_queries'
import type { ApiResponse } from '@/apis/types/common_type'
import type { Permission, RoleRecord } from '@/apis/types/role_type'

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, permissions }: { name: string; permissions: Permission[] }) =>
      ApiClient.patch<ApiResponse<RoleRecord>>(roleByName(name), { permissions }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roleQueryKeys.lists })
    },
  })
}
