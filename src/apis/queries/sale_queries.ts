import { useQuery } from '@tanstack/react-query'

import { AxiosFetcher } from '@/apis/configs'
import { sales } from '@/apis/endpoints/sale_apis'
import type { PaginatedResponse } from '@/apis/types/common_type'
import type { Sale } from '@/apis/types/sale_type'
import { buildQueryString } from '@/utils/query'

export type SaleQueryParams = {
  page?: number
  limit?: number
}

export const saleQueryKeys = {
  lists: ['sales'] as const,
  list: ['sales', 'list'] as const,
  page: (params: SaleQueryParams) => ['sales', 'list', params] as const,
}

export const useSalesQuery = (params: SaleQueryParams = { page: 1, limit: 10 }) =>
  useQuery({
    queryKey: saleQueryKeys.page(params),
    queryFn: () => {
      const query = buildQueryString(params)
      return AxiosFetcher<PaginatedResponse<Sale>>(query ? `${sales}?${query}` : sales)
    },
  })
