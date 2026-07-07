import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AxiosAPI } from '@/apis/configs'
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/apis/endpoints/product_apis'
import { dashboardQueryKeys } from '@/apis/queries/dashboard_queries'
import { productQueryKeys } from '@/apis/queries/product_queries'
import type { ApiResponse } from '@/apis/types/common_type'
import type { Product, ProductPayload } from '@/apis/types/product_type'
import { productToFormData } from '@/utils/formData'

const useInvalidateProducts = () => {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: productQueryKeys.lists })
    void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats })
  }
}

export const useCreateProductMutation = () => {
  const invalidate = useInvalidateProducts()

  return useMutation({
    mutationFn: (payload: ProductPayload) =>
      AxiosAPI.post<ApiResponse<Product>>(createProduct, productToFormData(payload)).then(
        (res) => res.data,
      ),
    onSuccess: invalidate,
  })
}

export const useUpdateProductMutation = () => {
  const invalidate = useInvalidateProducts()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductPayload }) =>
      AxiosAPI.patch<ApiResponse<Product>>(updateProduct(id), productToFormData(payload)).then(
        (res) => res.data,
      ),
    onSuccess: invalidate,
  })
}

export const useDeleteProductMutation = () => {
  const invalidate = useInvalidateProducts()

  return useMutation({
    mutationFn: (id: string) =>
      AxiosAPI.delete<ApiResponse<Product>>(deleteProduct(id)).then((res) => res.data),
    onSuccess: invalidate,
  })
}
