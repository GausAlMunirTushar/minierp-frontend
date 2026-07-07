import { FormEvent, useMemo, useState } from 'react'
import { Edit, Package, Plus, Search, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from '@/hooks/useInventoryApi'
import { ASSET_BASE_URL } from '@/apis/configs'
import type { Product, ProductPayload } from '@/apis/types/product_type'

const emptyProduct: ProductPayload = {
  name: '',
  sku: '',
  category: '',
  purchasePrice: '',
  sellingPrice: '',
  stockQuantity: '',
  image: null,
}

export function ProductsPage() {
  const { t } = useTranslation()
  const { can } = useAuth()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductPayload>(emptyProduct)

  const productsQuery = useProducts({ page, limit, search })
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const products = productsQuery.data?.data ?? []
  const meta = productsQuery.data?.meta
  const canManage = can('products.create')
  const canUpdate = can('products.update')
  const canDelete = can('products.delete')
  const isSaving = createMutation.isPending || updateMutation.isPending

  const previewUrl = useMemo(() => {
    if (form.image) return URL.createObjectURL(form.image)
    if (editing?.image) return `${ASSET_BASE_URL}${editing.image}`
    return ''
  }, [editing?.image, form.image])

  const resetForm = () => {
    setEditing(null)
    setForm(emptyProduct)
  }

  const startEdit = (product: Product) => {
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
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editing && !form.image) return

    if (editing) {
      updateMutation.mutate({ id: editing._id, payload: form }, { onSuccess: resetForm })
      return
    }

    createMutation.mutate(form, { onSuccess: resetForm })
  }

  const handleDelete = (product: Product) => {
    if (window.confirm(`Delete ${product.name}?`)) {
      deleteMutation.mutate(product._id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('products')}</h1>
          <p className="text-sm text-slate-500">Search, paginate, upload images, and manage stock.</p>
        </div>
        <label className="relative block md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder={t('searchProducts')}
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-cyan-500"
          />
        </label>
      </div>

      {canManage && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-slate-900">{editing ? t('editProduct') : t('addProduct')}</h2>
            {editing && (
              <Button variant="ghost" type="button" onClick={resetForm}>
                <X size={16} />
                Cancel
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Input label="Product Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                <Input label="SKU" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} required />
                <Input label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
                <Input label="Purchase Price" type="number" min="0" value={form.purchasePrice} onChange={(event) => setForm({ ...form, purchasePrice: event.target.value })} required />
                <Input label="Selling Price" type="number" min="0" value={form.sellingPrice} onChange={(event) => setForm({ ...form, sellingPrice: event.target.value })} required />
                <Input label="Stock Quantity" type="number" min="0" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} required />
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <Input
                  label={`Product Image ${editing ? '' : '*'}`}
                  type="file"
                  accept="image/*"
                  onChange={(event) => setForm({ ...form, image: event.target.files?.[0] ?? null })}
                  required={!editing}
                />
                {previewUrl && <img src={previewUrl} alt="Preview" className="h-20 w-20 rounded-md border object-cover" />}
                <Button type="submit" disabled={isSaving}>
                  <Plus size={16} />
                  {isSaving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Stock</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={`${ASSET_BASE_URL}${product.image}`} alt={product.name} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <Package className="h-10 w-10 rounded border p-2" />
                        )}
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td className="text-right">{product.sellingPrice}</td>
                    <td className="text-right font-medium">{product.stockQuantity}</td>
                    <td className="px-4">
                      <div className="flex justify-end gap-2">
                        {canUpdate && (
                          <Button variant="outline" onClick={() => startEdit(product)}>
                            <Edit size={16} />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="danger" onClick={() => handleDelete(product)}>
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
          <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm">
            <span>
              Page {meta?.page ?? page} of {meta?.totalPages ?? 1} - {meta?.total ?? 0} products
            </span>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" disabled={page >= (meta?.totalPages ?? 1)} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
