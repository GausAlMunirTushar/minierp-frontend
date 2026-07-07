import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Edit, Package, Plus, Search, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { ASSET_BASE_URL, getApiErrorMessage } from '@/apis/configs'
import type { Product, ProductPayload } from '@/apis/types/product_type'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state'
import { UI_CONSTANTS } from '@/configs/constants'
import { useAuth } from '@/hooks/useAuth'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from '@/hooks/useInventoryApi'
import { formatCurrency } from '@/utils/currency'

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

const getParamNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function ProductsPage() {
  const { t } = useTranslation()
  const { can } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductPayload>(emptyProduct)
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [feedback, setFeedback] = useState('')
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')

  const page = getParamNumber(searchParams.get('page'), 1)
  const limit = getParamNumber(searchParams.get('limit'), UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const category = searchParams.get('category') ?? ''
  const sort = searchParams.get('sort') ?? '-createdAt'
  const debouncedSearch = useDebouncedValue(searchInput)

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''
    if (debouncedSearch === currentSearch) return

    const nextParams = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      nextParams.set('search', debouncedSearch)
    } else {
      nextParams.delete('search')
    }
    nextParams.set('page', '1')
    setSearchParams(nextParams, { replace: true })
  }, [debouncedSearch, searchParams, setSearchParams])

  const productsQuery = useProducts({
    page,
    limit,
    search: searchParams.get('search') ?? undefined,
    category: category || undefined,
    sort,
  })
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const products = productsQuery.data?.data ?? []
  const meta = productsQuery.data?.meta
  const canManage = can('products.create')
  const canUpdate = can('products.update')
  const canDelete = can('products.delete')
  const isSaving = createMutation.isPending || updateMutation.isPending
  const mutationError = createMutation.error || updateMutation.error || deleteMutation.error

  const previewUrl = useMemo(() => {
    if (form.image) return URL.createObjectURL(form.image)
    if (editing?.image) return `${ASSET_BASE_URL}${editing.image}`
    return ''
  }, [editing?.image, form.image])

  useEffect(() => {
    if (!form.image || !previewUrl.startsWith('blob:')) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [form.image, previewUrl])

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value) {
      nextParams.set(key, value)
    } else {
      nextParams.delete(key)
    }
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const setPage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(nextPage))
    setSearchParams(nextParams)
  }

  const resetForm = () => {
    setEditing(null)
    setForm(emptyProduct)
    setErrors({})
  }

  const startEdit = (product: Product) => {
    setFeedback('')
    setEditing(product)
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      purchasePrice: String(product.purchasePrice),
      sellingPrice: String(product.sellingPrice),
      stockQuantity: String(product.stockQuantity),
      image: null,
    })
    setErrors({})
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

    if (!editing && !form.image) {
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
    setFeedback('')
    if (!validate()) return

    if (editing) {
      updateMutation.mutate(
        { id: editing._id, payload: form },
        {
          onSuccess: () => {
            resetForm()
            setFeedback(t('updatedSuccessfully'))
          },
        },
      )
      return
    }

    createMutation.mutate(form, {
      onSuccess: () => {
        resetForm()
        setFeedback(t('createdSuccessfully'))
      },
    })
  }

  const confirmDelete = () => {
    if (!productToDelete) return

    deleteMutation.mutate(productToDelete._id, {
      onSuccess: () => {
        setProductToDelete(null)
        setFeedback(t('deletedSuccessfully'))
      },
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('products')} description={t('productDescription')} />

      <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t('searchProducts')}
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-cyan-500"
          />
        </label>
        <input
          value={category}
          onChange={(event) => updateParam('category', event.target.value)}
          placeholder={t('filterByCategory')}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
        />
        <select
          value={sort}
          onChange={(event) => updateParam('sort', event.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
          aria-label={t('sortBy')}
        >
          <option value="-createdAt">{t('newest')}</option>
          <option value="createdAt">{t('oldest')}</option>
          <option value="name">{t('nameAsc')}</option>
          <option value="stockQuantity">{t('stockLow')}</option>
        </select>
      </div>

      {feedback && <Alert variant="success">{feedback}</Alert>}
      {mutationError && <Alert variant="error">{getApiErrorMessage(mutationError)}</Alert>}

      {canManage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              {editing ? t('editProduct') : t('addProduct')}
            </h2>
            {editing && (
              <Button variant="ghost" type="button" onClick={resetForm}>
                <X size={16} />
                {t('cancel')}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label={t('productName')}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  error={errors.name}
                />
                <Input
                  label={t('sku')}
                  value={form.sku}
                  onChange={(event) => setForm({ ...form, sku: event.target.value })}
                  error={errors.sku}
                />
                <Input
                  label={t('category')}
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  error={errors.category}
                />
                <Input
                  label={t('purchasePrice')}
                  type="number"
                  min="0"
                  value={form.purchasePrice}
                  onChange={(event) => setForm({ ...form, purchasePrice: event.target.value })}
                  error={errors.purchasePrice}
                />
                <Input
                  label={t('sellingPrice')}
                  type="number"
                  min="0"
                  value={form.sellingPrice}
                  onChange={(event) => setForm({ ...form, sellingPrice: event.target.value })}
                  error={errors.sellingPrice}
                />
                <Input
                  label={t('stockQuantity')}
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })}
                  error={errors.stockQuantity}
                />
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <FileUpload
                    label={t('productImage')}
                    required={!editing}
                    previewUrl={previewUrl}
                    error={errors.image}
                    onChange={(image) => setForm({ ...form, image })}
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  <Plus size={16} />
                  {isSaving ? t('saving') : editing ? t('update') : t('create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {productsQuery.isLoading ? (
            <div className="p-4">
              <LoadingState label={t('loadingProducts')} />
            </div>
          ) : productsQuery.isError ? (
            <div className="p-4">
              <ErrorState
                title={t('loadingProducts')}
                description={getApiErrorMessage(productsQuery.error)}
                onRetry={() => void productsQuery.refetch()}
                retryLabel={t('retry')}
              />
            </div>
          ) : products.length === 0 ? (
            <div className="p-4">
              <EmptyState title={t('noProductsFound')} description={t('noProductsDescription')} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{t('product')}</th>
                    <th>{t('sku')}</th>
                    <th>{t('category')}</th>
                    <th className="text-right">{t('sellingPrice')}</th>
                    <th className="text-right">{t('stock')}</th>
                    <th className="px-4 text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={`${ASSET_BASE_URL}${product.image}`}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <Package className="h-10 w-10 rounded border p-2" />
                          )}
                          <span className="font-medium text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td className="text-right">{formatCurrency(product.sellingPrice)}</td>
                      <td className="text-right font-medium">{product.stockQuantity}</td>
                      <td className="px-4">
                        <div className="flex justify-end gap-2">
                          {canUpdate && (
                            <Button variant="outline" type="button" onClick={() => startEdit(product)}>
                              <Edit size={16} />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="danger"
                              type="button"
                              onClick={() => setProductToDelete(product)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            meta={meta}
            page={page}
            onPageChange={setPage}
            labels={{
              page: t('page'),
              of: t('of'),
              previous: t('previous'),
              next: t('next'),
              total: t('total'),
            }}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(productToDelete)}
        title={t('deleteProduct')}
        description={`${t('deleteProductConfirm')} ${t('deleteProductDescription')}`}
        confirmLabel={t('confirmDelete')}
        cancelLabel={t('cancel')}
        isLoading={deleteMutation.isPending}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
