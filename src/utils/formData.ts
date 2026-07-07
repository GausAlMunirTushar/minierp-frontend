import type { ProductPayload } from '@/apis/types/product_type'

export const productToFormData = (payload: ProductPayload) => {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('sku', payload.sku)
  formData.append('category', payload.category)
  formData.append('purchasePrice', payload.purchasePrice)
  formData.append('sellingPrice', payload.sellingPrice)
  formData.append('stockQuantity', payload.stockQuantity)

  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}
