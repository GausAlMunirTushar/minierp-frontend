import { FormEvent, useMemo, useState } from 'react'
import { Plus, Receipt, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCreateSale, useProducts, useSales } from '@/hooks/useInventoryApi'
import type { SaleItemInput } from '@/apis/types/sale_type'

const newItem = (): SaleItemInput => ({ product: '', quantity: 1 })

export function SalesPage() {
  const { t } = useTranslation()
  const [items, setItems] = useState<SaleItemInput[]>([newItem()])
  const productsQuery = useProducts({ page: 1, limit: 100 })
  const salesQuery = useSales()
  const createSale = useCreateSale()
  const products = productsQuery.data?.data ?? []

  const productById = useMemo(() => new Map(products.map((product) => [product._id, product])), [products])
  const grandTotal = items.reduce((total, item) => total + (productById.get(item.product)?.sellingPrice ?? 0) * item.quantity, 0)

  const updateItem = (index: number, patch: Partial<SaleItemInput>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const saleItems = items.filter((item) => item.product && item.quantity > 0)
    if (saleItems.length === 0) return
    createSale.mutate(saleItems, { onSuccess: () => setItems([newItem()]) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{t('sales')}</h1>
        <p className="text-sm text-slate-500">Create sales with multiple products and automatic total calculation.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">{t('createSale')}</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {items.map((item, index) => {
              const product = productById.get(item.product)
              const lineTotal = (product?.sellingPrice ?? 0) * item.quantity

              return (
                <div key={index} className="grid gap-3 rounded-md border border-slate-200 p-3 md:grid-cols-[1fr_150px_140px_auto]">
                  <label className="space-y-1.5 text-sm font-medium text-slate-700">
                    <span>Product</span>
                    <select
                      value={item.product}
                      onChange={(event) => updateItem(index, { product: event.target.value })}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2"
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((productItem) => (
                        <option key={productItem._id} value={productItem._id}>
                          {productItem.name} - Stock {productItem.stockQuantity}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                    required
                  />
                  <div className="space-y-1.5 text-sm font-medium text-slate-700">
                    <span>Line Total</span>
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">{lineTotal.toFixed(2)}</div>
                  </div>
                  <div className="flex items-end">
                    <Button variant="danger" type="button" disabled={items.length === 1} onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )
            })}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button type="button" variant="outline" onClick={() => setItems([...items, newItem()])}>
                <Plus size={16} />
                Add Product
              </Button>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Grand Total</p>
                  <p className="text-2xl font-semibold text-slate-900">{grandTotal.toFixed(2)}</p>
                </div>
                <Button type="submit" disabled={createSale.isPending}>
                  <Receipt size={16} />
                  {createSale.isPending ? 'Creating...' : 'Create Sale'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">Recent Sales</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr className="border-b">
                  <th className="py-3">Date</th>
                  <th>Items</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(salesQuery.data?.data ?? []).map((sale) => (
                  <tr key={sale._id} className="border-b last:border-0">
                    <td className="py-3">{new Date(sale.createdAt).toLocaleString()}</td>
                    <td>{sale.items.map((saleItem) => saleItem.name).join(', ')}</td>
                    <td className="text-right font-semibold">{sale.grandTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
