import { FormEvent, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Receipt, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getApiErrorMessage } from '@/apis/configs'
import type { Sale, SaleItemInput } from '@/apis/types/sale_type'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Input } from '@/components/ui/input'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state'
import { useCreateSale, useProducts, useSales } from '@/hooks/useInventoryApi'
import { formatCurrency } from '@/utils/currency'
import { formatDateTime } from '@/utils/date'

type SaleErrors = Record<number, Partial<Record<keyof SaleItemInput, string>>>

const newItem = (): SaleItemInput => ({ product: '', quantity: 1 })

export function SalesPage() {
  const { t } = useTranslation()
  const [items, setItems] = useState<SaleItemInput[]>([newItem()])
  const [errors, setErrors] = useState<SaleErrors>({})
  const [feedback, setFeedback] = useState('')
  const productsQuery = useProducts({ page: 1, limit: 100, sort: 'name' })
  const salesQuery = useSales({ page: 1, limit: 10 })
  const createSale = useCreateSale()
  const products = productsQuery.data?.data ?? []

  const productById = useMemo(
    () => new Map(products.map((product) => [product._id, product])),
    [products],
  )
  const selectedProducts = useMemo(() => items.map((item) => item.product).filter(Boolean), [items])
  const grandTotal = items.reduce(
    (total, item) => total + (productById.get(item.product)?.sellingPrice ?? 0) * item.quantity,
    0,
  )

  const updateItem = (index: number, patch: Partial<SaleItemInput>) => {
    setFeedback('')
    setErrors((current) => ({ ...current, [index]: {} }))
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    )
  }

  const validate = () => {
    const nextErrors: SaleErrors = {}
    const seenProducts = new Set<string>()

    items.forEach((item, index) => {
      const itemErrors: Partial<Record<keyof SaleItemInput, string>> = {}
      const product = productById.get(item.product)

      if (!item.product) {
        itemErrors.product = t('requiredField')
      } else if (seenProducts.has(item.product)) {
        itemErrors.product = t('duplicateProduct')
      } else {
        seenProducts.add(item.product)
      }

      if (!item.quantity || item.quantity <= 0) {
        itemErrors.quantity = t('positiveNumber')
      } else if (product && item.quantity > product.stockQuantity) {
        itemErrors.quantity = t('quantityExceedsStock')
      }

      if (Object.keys(itemErrors).length > 0) {
        nextErrors[index] = itemErrors
      }
    })

    const saleItems = items.filter((item) => item.product && item.quantity > 0)
    if (saleItems.length === 0) {
      nextErrors[0] = {
        ...(nextErrors[0] ?? {}),
        product: t('selectAtLeastOneProduct'),
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const saleColumns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('date')} />,
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        id: 'items',
        accessorFn: (row) => row.items.map((item) => item.name).join(', '),
        header: t('items'),
        enableSorting: false,
      },
      {
        accessorKey: 'grandTotal',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('total')} className="justify-end" />
        ),
        cell: ({ row }) => (
          <div className="text-right font-semibold">{formatCurrency(row.original.grandTotal)}</div>
        ),
      },
    ],
    [t],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback('')
    if (!validate()) return

    createSale.mutate(items, {
      onSuccess: () => {
        setItems([newItem()])
        setErrors({})
        setFeedback(t('saleCreated'))
      },
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sales')} description={t('salesDescription')} />

      {feedback && <Alert variant="success">{feedback}</Alert>}
      {createSale.error && <Alert variant="error">{getApiErrorMessage(createSale.error)}</Alert>}

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">{t('createSale')}</h2>
        </CardHeader>
        <CardContent>
          {productsQuery.isLoading ? (
            <LoadingState label={t('loadingProducts')} />
          ) : productsQuery.isError ? (
            <ErrorState
              title={t('loadingProducts')}
              description={getApiErrorMessage(productsQuery.error)}
              onRetry={() => void productsQuery.refetch()}
              retryLabel={t('retry')}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {items.map((item, index) => {
                const product = productById.get(item.product)
                const lineTotal = (product?.sellingPrice ?? 0) * item.quantity

                return (
                  <div
                    key={index}
                    className="grid gap-3 rounded-md border border-slate-200 p-3 md:grid-cols-[1fr_150px_160px_auto]"
                  >
                    <label className="space-y-1.5 text-sm font-medium text-slate-700">
                      <span>{t('product')}</span>
                      <select
                        value={item.product}
                        onChange={(event) => updateItem(index, { product: event.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 outline-none focus:border-cyan-500"
                      >
                        <option value="">{t('selectProduct')}</option>
                        {products.map((productItem) => {
                          const selectedElsewhere =
                            selectedProducts.includes(productItem._id) &&
                            productItem._id !== item.product
                          const outOfStock = productItem.stockQuantity <= 0

                          return (
                            <option
                              key={productItem._id}
                              value={productItem._id}
                              disabled={selectedElsewhere || outOfStock}
                            >
                              {productItem.name} - {t('stock')} {productItem.stockQuantity}
                              {outOfStock ? ` (${t('outOfStock')})` : ''}
                            </option>
                          )
                        })}
                      </select>
                      {errors[index]?.product && (
                        <span className="text-xs text-red-600">{errors[index]?.product}</span>
                      )}
                    </label>
                    <Input
                      label={t('quantity')}
                      type="number"
                      min="1"
                      max={product?.stockQuantity}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, { quantity: Number(event.target.value) })
                      }
                      error={errors[index]?.quantity}
                    />
                    <div className="space-y-1.5 text-sm font-medium text-slate-700">
                      <span>{t('lineTotal')}</span>
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                        {formatCurrency(lineTotal)}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="danger"
                        type="button"
                        disabled={items.length === 1}
                        onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                )
              })}

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Button type="button" variant="outline" onClick={() => setItems([...items, newItem()])}>
                  <Plus size={16} />
                  {t('addProductLine')}
                </Button>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{t('grandTotal')}</p>
                    <p className="text-2xl font-semibold text-slate-900">
                      {formatCurrency(grandTotal)}
                    </p>
                  </div>
                  <Button type="submit" disabled={createSale.isPending}>
                    <Receipt size={16} />
                    {createSale.isPending ? t('creatingSale') : t('createSale')}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">{t('recentSales')}</h2>
        </CardHeader>
        <CardContent className="p-0">
          {salesQuery.isError ? (
            <div className="p-4">
              <ErrorState
                title={t('loadingSales')}
                description={getApiErrorMessage(salesQuery.error)}
                onRetry={() => void salesQuery.refetch()}
                retryLabel={t('retry')}
              />
            </div>
          ) : !salesQuery.isLoading && (salesQuery.data?.data ?? []).length === 0 ? (
            <div className="p-4">
              <EmptyState title={t('noSalesFound')} description={t('noSalesDescription')} />
            </div>
          ) : (
            <DataTable
              columns={saleColumns}
              data={salesQuery.data?.data ?? []}
              isLoading={salesQuery.isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
