import { useQuery } from '@tanstack/react-query'

import { AxiosFetcher } from '@/apis/configs'
import { sales } from '@/apis/endpoints/sale_apis'
import type { ApiResponse } from '@/apis/types/common_type'
import type { Sale } from '@/apis/types/sale_type'

export const saleQueryKeys = {
  lists: ['sales'] as const,
  list: ['sales', 'list'] as const,
}

export const useSalesQuery = () =>
  useQuery({
    queryKey: saleQueryKeys.list,
    queryFn: () => AxiosFetcher<ApiResponse<Sale[]>>(`${sales}?page=1&limit=10`),
  })
