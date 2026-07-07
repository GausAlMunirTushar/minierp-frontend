import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Package, Plus, Search, Tags, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Product } from '@/apis/types/product_type'
import { PageHeader } from '@/components/layout/PageHeader'
import { CategoryManager } from '@/components/products/CategoryManager'
import { ProductForm } from '@/components/products/ProductForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState, ErrorState } from '@/components/ui/state'
import { Select } from '@/components/ui/select'
import { UI_CONSTANTS } from '@/configs/constants'
import { useAuth } from '@/hooks/useAuth'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCategories, useDeleteProduct, useProducts } from '@/hooks/useInventoryApi'
import { formatCurrency } from '@/utils/currency'

const getParamNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function ProductsPage() {
  const { t } = useTranslation()
  const { can } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
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
  const deleteMutation = useDeleteProduct()
  const categoriesQuery = useCategories({ page: 1, limit: 100, sort: 'name' })
  const categoryOptions = categoriesQuery.data?.data ?? []

  const products = productsQuery.data?.data ?? []
  const meta = productsQuery.data?.meta
  const canManage = can('products.create')
  const canUpdate = can('products.update')
  const canDelete = can('products.delete')

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

  const setLimit = (nextLimit: number) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('limit', String(nextLimit))
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const openCreateForm = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const confirmDelete = () => {
    if (!productToDelete) return

    deleteMutation.mutate(productToDelete._id, {
      onSuccess: () => {
        setProductToDelete(null)
        toast.success(t('deletedSuccessfully'))
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    })
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('product')} />,
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex items-center gap-3">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <Package className="h-10 w-10 rounded border p-2" />
              )}
              <span className="font-medium text-foreground">{product.name}</span>
            </div>
          )
        },
      },
      {
        accessorKey: 'sku',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('sku')} />,
      },
      {
        accessorKey: 'category',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('category')} />,
      },
      {
        accessorKey: 'sellingPrice',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('sellingPrice')} className="justify-end" />
        ),
        cell: ({ row }) => <div className="text-right">{formatCurrency(row.original.sellingPrice)}</div>,
      },
      {
        accessorKey: 'stockQuantity',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('stock')} className="justify-end" />
        ),
        cell: ({ row }) => <div className="text-right font-medium">{row.original.stockQuantity}</div>,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('actions')}</div>,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex justify-end gap-2">
              {canUpdate && (
                <Button variant="outline" type="button" onClick={() => openEditForm(product)}>
                  <Edit size={16} />
                </Button>
              )}
              {canDelete && (
                <Button variant="danger" type="button" onClick={() => setProductToDelete(product)}>
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          )
        },
      },
    ],
    [canUpdate, canDelete, t],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('products')}
        description={t('productDescription')}
        actions={
          canManage && (
            <>
              <Button type="button" variant="outline" onClick={() => setIsCategoryManagerOpen(true)}>
                <Tags size={16} />
                {t('manageCategories')}
              </Button>
              <Button type="button" onClick={openCreateForm}>
                <Plus size={16} />
                {t('addProduct')}
              </Button>
            </>
          )
        }
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t('searchProducts')}
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground outline-none focus:border-ring"
          />
        </label>
        <Select
          value={category}
          onChange={(event) => updateParam('category', event.target.value)}
          placeholder={t('filterByCategory')}
          options={categoryOptions.map((c) => ({ value: c.name, label: c.name }))}
          aria-label={t('filterByCategory')}
        />
        <Select
          value={sort}
          onChange={(event) => updateParam('sort', event.target.value)}
          options={[
            { value: '-createdAt', label: t('newest') },
            { value: 'createdAt', label: t('oldest') },
            { value: 'name', label: t('nameAsc') },
            { value: 'stockQuantity', label: t('stockLow') },
          ]}
          aria-label={t('sortBy')}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {productsQuery.isError ? (
            <div className="p-4">
              <ErrorState
                title={t('loadingProducts')}
                description={getApiErrorMessage(productsQuery.error)}
                onRetry={() => void productsQuery.refetch()}
                retryLabel={t('retry')}
              />
            </div>
          ) : !productsQuery.isLoading && products.length === 0 ? (
            <div className="p-4">
              <EmptyState title={t('noProductsFound')} description={t('noProductsDescription')} />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={products}
              isLoading={productsQuery.isLoading}
              pagination={{
                page,
                pageCount: meta?.totalPages ?? 1,
                pageSize: limit,
                totalCount: meta?.total ?? 0,
                onPageChange: setPage,
                onPageSizeChange: setLimit,
              }}
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isFormOpen}
        onClose={closeForm}
        title={editingProduct ? t('editProduct') : t('addProduct')}
        closeLabel={t('close')}
      >
        <ProductForm
          key={editingProduct?._id ?? 'create'}
          mode={editingProduct ? 'edit' : 'create'}
          product={editingProduct}
          onSuccess={closeForm}
          onCancel={closeForm}
        />
      </Dialog>

      <Dialog
        open={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        title={t('manageCategories')}
        closeLabel={t('close')}
      >
        <CategoryManager />
      </Dialog>

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
