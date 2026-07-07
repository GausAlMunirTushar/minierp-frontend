import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Product, ProductPayload } from '@/apis/types/product_type'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/useInventoryApi'

type ProductFormErrors = Partial<Record<keyof ProductPayload, string>>

const emptyProduct: ProductPayload = {
  name: '',
  sku: '',
  category: '',
  purchasePrice: '',
  sellingPrice: '',
  stockQuantity: '',
  image: null,
}

const generateSku = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const initials = words
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join('')
  const random = Math.floor(1000 + Math.random() * 9000)
  return initials ? `${initials}-${random}` : `SKU-${random}`
}

export function ProductForm({
  mode,
  product,
  onSuccess,
  onCancel,
}: {
  mode: 'create' | 'edit'
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const [form, setForm] = useState<ProductPayload>(() =>
    mode === 'edit' && product
      ? {
          name: product.name,
          sku: product.sku,
          category: product.category,
          purchasePrice: String(product.purchasePrice),
          sellingPrice: String(product.sellingPrice),
          stockQuantity: String(product.stockQuantity),
          image: null,
        }
      : emptyProduct,
  )
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const skuManuallyEdited = useRef(false)
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const categoriesQuery = useCategories({ page: 1, limit: 100, sort: 'name' })
  const isSaving = createMutation.isPending || updateMutation.isPending

  const categoryOptions = useMemo(() => {
    const names = (categoriesQuery.data?.data ?? []).map((category) => category.name)
    if (form.category && !names.includes(form.category)) {
      return [form.category, ...names]
    }
    return names
  }, [categoriesQuery.data?.data, form.category])

  const handleNameChange = (value: string) => {
    setForm((current) => {
      const sku = skuManuallyEdited.current || !value.trim()
        ? current.sku
        : generateSku(value)
      return { ...current, name: value, sku }
    })
  }

  const handleSkuChange = (value: string) => {
    skuManuallyEdited.current = true
    setForm((current) => ({ ...current, sku: value }))
  }

  const previewUrl = useMemo(() => {
    if (form.image) return URL.createObjectURL(form.image)
    if (mode === 'edit' && product?.image) return product.image
    return ''
  }, [form.image, mode, product])

  useEffect(() => {
    if (!form.image || !previewUrl.startsWith('blob:')) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [form.image, previewUrl])

  const validateField = (field: keyof ProductFormErrors) => {
    setErrors((current) => {
      const next = { ...current }

      if (field === 'image') {
        if (mode === 'create' && !form.image) {
          next.image = t('imageRequired')
        } else {
          delete next.image
        }
      } else if (field === 'purchasePrice') {
        if (Number(form.purchasePrice) <= 0) {
          next.purchasePrice = t('positiveNumber')
        } else {
          delete next.purchasePrice
        }
      } else if (field === 'sellingPrice') {
        if (Number(form.sellingPrice) <= 0) {
          next.sellingPrice = t('positiveNumber')
        } else {
          delete next.sellingPrice
        }
      } else if (field === 'stockQuantity') {
        if (Number(form.stockQuantity) < 0) {
          next.stockQuantity = t('nonNegativeNumber')
        } else {
          delete next.stockQuantity
        }
      } else {
        if (!String(form[field]).trim()) {
          next[field] = t('requiredField')
        } else {
          delete next[field]
        }
      }

      return next
    })
  }

  const validate = () => {
    const nextErrors: ProductFormErrors = {}
    const requiredFields: (keyof ProductPayload)[] = [
      'name',
      'sku',
      'category',
      'purchasePrice',
      'sellingPrice',
      'stockQuantity',
    ]

    requiredFields.forEach((field) => {
      if (!String(form[field]).trim()) {
        nextErrors[field] = t('requiredField')
      }
    })

    if (mode === 'create' && !form.image) {
      nextErrors.image = t('imageRequired')
    }

    if (Number(form.purchasePrice) <= 0) {
      nextErrors.purchasePrice = t('positiveNumber')
    }

    if (Number(form.sellingPrice) <= 0) {
      nextErrors.sellingPrice = t('positiveNumber')
    }

    if (Number(form.stockQuantity) < 0) {
      nextErrors.stockQuantity = t('nonNegativeNumber')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    if (mode === 'edit' && product) {
      updateMutation.mutate(
        { id: product._id, payload: form },
        {
          onSuccess: () => {
            toast.success(t('updatedSuccessfully'))
            onSuccess()
          },
          onError: (error) => toast.error(getApiErrorMessage(error)),
        },
      )
      return
    }

    createMutation.mutate(form, {
      onSuccess: () => {
        toast.success(t('createdSuccessfully'))
        onSuccess()
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label={t('productName')}
          placeholder={t('productNamePlaceholder')}
          value={form.name}
          onChange={(event) => handleNameChange(event.target.value)}
          onBlur={() => validateField('name')}
          error={errors.name}
        />
        <Input
          label={t('sku')}
          placeholder={t('skuPlaceholder')}
          value={form.sku}
          onChange={(event) => handleSkuChange(event.target.value)}
          onBlur={() => validateField('sku')}
          error={errors.sku}
        />
        <Select
          label={t('category')}
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
          onBlur={() => validateField('category')}
          placeholder={t('selectCategory')}
          options={categoryOptions.map((name) => ({ value: name, label: name }))}
          error={errors.category}
        />
        <Input
          label={t('purchasePrice')}
          placeholder="0.00"
          type="number"
          min="0"
          value={form.purchasePrice}
          onChange={(event) => setForm({ ...form, purchasePrice: event.target.value })}
          onBlur={() => validateField('purchasePrice')}
          error={errors.purchasePrice}
        />
        <Input
          label={t('sellingPrice')}
          placeholder="0.00"
          type="number"
          min="0"
          value={form.sellingPrice}
          onChange={(event) => setForm({ ...form, sellingPrice: event.target.value })}
          onBlur={() => validateField('sellingPrice')}
          error={errors.sellingPrice}
        />
        <Input
          label={t('stockQuantity')}
          placeholder="0"
          type="number"
          min="0"
          value={form.stockQuantity}
          onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })}
          onBlur={() => validateField('stockQuantity')}
          error={errors.stockQuantity}
        />
      </div>

      <FileUpload
        label={t('productImage')}
        required={mode === 'create'}
        previewUrl={previewUrl}
        error={errors.image}
        onChange={(image) => setForm({ ...form, image })}
      />

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? t('saving') : mode === 'edit' ? t('update') : t('create')}
        </Button>
      </div>
    </form>
  )
}
