import { useQuery } from '@tanstack/react-query'

import { AxiosFetcher } from '@/apis/configs'
import { products } from '@/apis/endpoints/product_apis'
import type { PaginatedResponse } from '@/apis/types/common_type'
import type { Product } from '@/apis/types/product_type'
import { buildQueryString } from '@/utils/query'

export type ProductQueryParams = {
  page: number
  limit: number
  search?: string
  category?: string
  sort?: string
}

export const productQueryKeys = {
  lists: ['products'] as const,
  list: (params: ProductQueryParams) => ['products', params] as const,
}

const buildProductUrl = (params: ProductQueryParams) => {
  const query = buildQueryString(params)
  return query ? `${products}?${query}` : products
}

export const useProductsQuery = (params: ProductQueryParams) =>
  useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => AxiosFetcher<PaginatedResponse<Product>>(buildProductUrl(params)),
  })
