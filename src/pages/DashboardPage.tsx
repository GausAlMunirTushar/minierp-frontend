import { useMemo } from 'react'
import { AlertTriangle, Boxes, Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getApiErrorMessage } from '@/apis/configs'
import { useProductsQuery } from '@/apis/queries/product_queries'
import { BarChart, ChartCard, PieChart, StatCard } from '@/components/charts'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EmptyState, ErrorState } from '@/components/ui/state'
import { TableSkeleton } from '@/components/ui/skeletons'
import { useDashboardStats } from '@/hooks/useInventoryApi'

export function DashboardPage() {
  const { t } = useTranslation()
  const { data, error, isError, isLoading, refetch } = useDashboardStats()
  const stats = data?.data

  const categoriesQuery = useProductsQuery({ page: 1, limit: 100, sort: 'name' })

  const stockLevelData = useMemo(
    () =>
      (stats?.lowStockProducts ?? []).map((product) => ({
        name: product.name,
        stockQuantity: product.stockQuantity,
      })),
    [stats?.lowStockProducts],
  )

  const categoryData = useMemo(() => {
    const products = categoriesQuery.data?.data ?? []
    const counts = new Map<string, number>()
    products.forEach((product) => {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1)
    })
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
  }, [categoriesQuery.data?.data])

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
        <StatCard
          title={t('totalProducts')}
          value={stats?.totalProducts ?? 0}
          icon={<Boxes />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title={t('totalSales')}
          value={stats?.totalSales ?? 0}
          icon={<Receipt />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title={t('lowStock')}
          value={stats?.lowStockProducts.length ?? 0}
          icon={<AlertTriangle />}
          color="red"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title={t('stockLevelsChartTitle')}
          subtitle={t('stockLevelsChartSubtitle')}
          isLoading={isLoading}
        >
          {stockLevelData.length ? (
            <BarChart data={stockLevelData} dataKey="name" valueKey="stockQuantity" color="#ef4444" />
          ) : (
            <EmptyState title={t('noLowStockProducts')} />
          )}
        </ChartCard>

        <ChartCard
          title={t('categoryChartTitle')}
          subtitle={t('categoryChartSubtitle')}
          isLoading={categoriesQuery.isLoading}
        >
          {categoryData.length ? (
            <PieChart data={categoryData} dataKey="count" nameKey="category" />
          ) : (
            <EmptyState title={t('noProductsFound')} />
          )}
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-card-foreground">{t('lowStockProducts')}</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={4} rows={4} />
          ) : stats?.lowStockProducts.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-3">{t('product')}</th>
                    <th>{t('sku')}</th>
                    <th>{t('category')}</th>
                    <th className="text-right">{t('stock')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product._id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <Link to={`/products?search=${product.sku}`} className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-card-foreground hover:text-primary">{product.name}</span>
                        </Link>
                      </td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td className="text-right font-semibold text-destructive">{product.stockQuantity}</td>
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
