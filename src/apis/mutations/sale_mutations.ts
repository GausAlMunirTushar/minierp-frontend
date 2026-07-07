import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AxiosAPI } from '@/apis/configs'
import { createSale } from '@/apis/endpoints/sale_apis'
import { dashboardQueryKeys } from '@/apis/queries/dashboard_queries'
import { productQueryKeys } from '@/apis/queries/product_queries'
import { saleQueryKeys } from '@/apis/queries/sale_queries'
import type { ApiResponse } from '@/apis/types/common_type'
import type { Sale, SaleItemInput } from '@/apis/types/sale_type'

export const useCreateSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: SaleItemInput[]) =>
      AxiosAPI.post<ApiResponse<Sale>>(createSale, { items }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productQueryKeys.lists })
      void queryClient.invalidateQueries({ queryKey: saleQueryKeys.lists })
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats })
    },
  })
}
