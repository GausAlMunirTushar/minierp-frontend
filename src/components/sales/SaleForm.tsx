import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Receipt, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { SaleItemInput } from '@/apis/types/sale_type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ErrorState } from '@/components/ui/state'
import { FormRowSkeleton } from '@/components/ui/skeletons'
import { useCreateSale, useProducts } from '@/hooks/useInventoryApi'
import { formatCurrency } from '@/utils/currency'

type SaleErrors = Record<number, Partial<Record<keyof SaleItemInput, string>>>

const newItem = (): SaleItemInput => ({ product: '', quantity: 1 })

export function SaleForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { t } = useTranslation()
  const [items, setItems] = useState<SaleItemInput[]>([newItem()])
  const [errors, setErrors] = useState<SaleErrors>({})
  const productsQuery = useProducts({ page: 1, limit: 100, sort: 'name' })
  const createSale = useCreateSale()
  const products = useMemo(() => productsQuery.data?.data ?? [], [productsQuery.data?.data])

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    createSale.mutate(items, {
      onSuccess: () => {
        toast.success(t('saleCreated'))
        onSuccess()
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    })
  }

  if (productsQuery.isError) {
    return (
      <ErrorState
        title={t('loadingProducts')}
        description={getApiErrorMessage(productsQuery.error)}
        onRetry={() => void productsQuery.refetch()}
        retryLabel={t('retry')}
      />
    )
  }

  if (productsQuery.isLoading) {
    return <FormRowSkeleton rows={items.length} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {items.map((item, index) => {
        const product = productById.get(item.product)
        const lineTotal = (product?.sellingPrice ?? 0) * item.quantity

        return (
          <div
            key={index}
            className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[1fr_150px_160px_auto]"
          >
            <Select
              label={t('product')}
              value={item.product}
              onChange={(event) => updateItem(index, { product: event.target.value })}
              placeholder={t('selectProduct')}
              error={errors[index]?.product}
            >
              {products.map((productItem) => {
                const selectedElsewhere =
                  selectedProducts.includes(productItem._id) && productItem._id !== item.product
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
            </Select>
            <Input
              label={t('quantity')}
              type="number"
              min="1"
              max={product?.stockQuantity}
              value={item.quantity}
              onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
              error={errors[index]?.quantity}
            />
            <div className="space-y-1.5 text-sm font-medium text-foreground">
              <span>{t('lineTotal')}</span>
              <div className="rounded-md border border-border bg-muted px-3 py-2">
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

      <div className="flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
        <Button type="button" variant="outline" onClick={() => setItems([...items, newItem()])}>
          <Plus size={16} />
          {t('addProductLine')}
        </Button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t('grandTotal')}</p>
            <p className="text-2xl font-semibold text-foreground">{formatCurrency(grandTotal)}</p>
          </div>
          <Button type="button" variant="ghost" onClick={onCancel} disabled={createSale.isPending}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={createSale.isPending}>
            <Receipt size={16} />
            {createSale.isPending ? t('creatingSale') : t('createSale')}
          </Button>
        </div>
      </div>
    </form>
  )
}
