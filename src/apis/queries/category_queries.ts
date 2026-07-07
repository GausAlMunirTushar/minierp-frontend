import { useQuery } from '@tanstack/react-query'

import { AxiosFetcher } from '@/apis/configs'
import { categories } from '@/apis/endpoints/category_apis'
import type { PaginatedResponse } from '@/apis/types/common_type'
import type { Category } from '@/apis/types/category_type'
import { buildQueryString } from '@/utils/query'

export type CategoryQueryParams = {
  page: number
  limit: number
  search?: string
  sort?: string
}

export const categoryQueryKeys = {
  lists: ['categories'] as const,
  list: (params: CategoryQueryParams) => ['categories', params] as const,
}

const buildCategoryUrl = (params: CategoryQueryParams) => {
  const query = buildQueryString(params)
  return query ? `${categories}?${query}` : categories
}

export const useCategoriesQuery = (params: CategoryQueryParams) =>
  useQuery({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => AxiosFetcher<PaginatedResponse<Category>>(buildCategoryUrl(params)),
  })
