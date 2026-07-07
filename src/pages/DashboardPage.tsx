import { AlertTriangle, Boxes, Receipt } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ASSET_BASE_URL } from '@/apis/configs'
import { useDashboardStats } from '@/hooks/useInventoryApi'

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-lg bg-cyan-50 p-3 text-cyan-700">{icon}</div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useDashboardStats()
  const stats = data?.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{t('dashboard')}</h1>
        <p className="text-sm text-slate-500">Inventory and sales overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title={t('totalProducts')} value={isLoading ? '...' : (stats?.totalProducts ?? 0)} icon={<Boxes />} />
        <StatCard title={t('totalSales')} value={isLoading ? '...' : (stats?.totalSales ?? 0)} icon={<Receipt />} />
        <StatCard title={t('lowStock')} value={isLoading ? '...' : (stats?.lowStockProducts.length ?? 0)} icon={<AlertTriangle />} />
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">{t('lowStockProducts')}</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-3">Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th className="text-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.lowStockProducts ?? []).map((product) => (
                  <tr key={product._id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {product.image && <img src={`${ASSET_BASE_URL}${product.image}`} alt={product.name} className="h-10 w-10 rounded object-cover" />}
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td className="text-right font-semibold text-red-600">{product.stockQuantity}</td>
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
