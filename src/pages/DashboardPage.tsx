import { AlertTriangle, Boxes, Receipt } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ASSET_BASE_URL, getApiErrorMessage } from '@/apis/configs'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/state'
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
  const { data, error, isError, isLoading, refetch } = useDashboardStats()
  const stats = data?.data

  if (isLoading) {
    return <LoadingState label={t('loadingDashboard')} />
  }

  if (isError) {
    return (
      <ErrorState
        title={t('dashboardLoadError')}
        description={getApiErrorMessage(error)}
        onRetry={() => void refetch()}
        retryLabel={t('retry')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('dashboard')} description={t('inventoryOverview')} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title={t('totalProducts')} value={stats?.totalProducts ?? 0} icon={<Boxes />} />
        <StatCard title={t('totalSales')} value={stats?.totalSales ?? 0} icon={<Receipt />} />
        <StatCard
          title={t('lowStock')}
          value={stats?.lowStockProducts.length ?? 0}
          icon={<AlertTriangle />}
        />
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">{t('lowStockProducts')}</h2>
        </CardHeader>
        <CardContent>
          {stats?.lowStockProducts.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-3">{t('product')}</th>
                    <th>{t('sku')}</th>
                    <th>{t('category')}</th>
                    <th className="text-right">{t('stock')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product._id} className="border-b last:border-0">
                      <td className="py-3">
                        <Link to={`/products?search=${product.sku}`} className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={`${ASSET_BASE_URL}${product.image}`}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-slate-900 hover:text-cyan-700">
                            {product.name}
                          </span>
                        </Link>
                      </td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td className="text-right font-semibold text-red-600">
                        {product.stockQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title={t('noLowStockProducts')} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
