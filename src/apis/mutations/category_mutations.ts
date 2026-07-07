import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiClient } from '@/apis/configs'
import { createCategory, deleteCategory, updateCategory } from '@/apis/endpoints/category_apis'
import { categoryQueryKeys } from '@/apis/queries/category_queries'
import type { ApiResponse } from '@/apis/types/common_type'
import type { Category, CategoryPayload } from '@/apis/types/category_type'

const useInvalidateCategories = () => {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists })
  }
}

export const useCreateCategoryMutation = () => {
  const invalidate = useInvalidateCategories()

  return useMutation({
    mutationFn: (payload: CategoryPayload) =>
      ApiClient.post<ApiResponse<Category>>(createCategory, payload),
    onSuccess: invalidate,
  })
}

export const useUpdateCategoryMutation = () => {
  const invalidate = useInvalidateCategories()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) =>
      ApiClient.patch<ApiResponse<Category>>(updateCategory(id), payload),
    onSuccess: invalidate,
  })
}

export const useDeleteCategoryMutation = () => {
  const invalidate = useInvalidateCategories()

  return useMutation({
    mutationFn: (id: string) => ApiClient.delete<ApiResponse<Category>>(deleteCategory(id)),
    onSuccess: invalidate,
  })
}
