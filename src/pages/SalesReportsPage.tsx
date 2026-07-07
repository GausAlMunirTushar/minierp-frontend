import { useMemo } from 'react'
import { ArrowLeft, DollarSign, Receipt, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { getApiErrorMessage } from '@/apis/configs'
import { PageHeader } from '@/components/layout/PageHeader'
import { BarChart, ChartCard, LineChart, StatCard } from '@/components/charts'
import { Button } from '@/components/ui/button'
import { EmptyState, ErrorState } from '@/components/ui/state'
import { useSales } from '@/hooks/useInventoryApi'
import { formatCurrency } from '@/utils/currency'

type SaleItem = {
  product: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

type Sale = {
  _id: string
  items: SaleItem[]
  grandTotal: number
  createdAt: string
}

const parseCurrency = (val: unknown): number => {
  const num = Number(val)
  return Number.isFinite(num) ? num : 0
}

export function SalesReportsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const salesQuery = useSales({ page: 1, limit: 200 })

  const sales = (salesQuery.data?.data ?? []) as Sale[]

  const { salesOverTime, revenueByProduct, totalRevenue, avgOrderValue, totalSalesCount } =
    useMemo(() => {
      const dayMap = new Map<string, number>()
      const productMap = new Map<string, { name: string; revenue: number }>()

      let revenueSum = 0

      sales.forEach((sale) => {
        const day = new Date(sale.createdAt).toISOString().slice(0, 10)
        dayMap.set(day, (dayMap.get(day) ?? 0) + parseCurrency(sale.grandTotal))
        revenueSum += parseCurrency(sale.grandTotal)

        sale.items.forEach((item) => {
          const prev = productMap.get(item.product) ?? { name: item.name, revenue: 0 }
          productMap.set(item.product, {
            name: item.name,
            revenue: prev.revenue + parseCurrency(item.lineTotal),
          })
        })
      })

      const salesOverTime = Array.from(dayMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))

      const revenueByProduct = Array.from(productMap.values())
        .map((p) => ({ name: p.name, revenue: p.revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

      return {
        salesOverTime,
        revenueByProduct,
        totalRevenue: revenueSum,
        avgOrderValue: sales.length > 0 ? revenueSum / sales.length : 0,
        totalSalesCount: sales.length,
      }
    }, [sales])

  if (salesQuery.isError) {
    return (
      <ErrorState
        title={t('loadingSales')}
        description={getApiErrorMessage(salesQuery.error)}
        onRetry={() => void salesQuery.refetch()}
        retryLabel={t('retry')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('salesReports')}
        description={t('salesReportsDescription')}
        actions={
          <Button type="button" variant="outline" onClick={() => navigate('/sales')}>
            <ArrowLeft size={16} />
            {t('sales')}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title={t('totalRevenue')}
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign />}
          color="green"
          isLoading={salesQuery.isLoading}
        />
        <StatCard
          title={t('totalSales')}
          value={totalSalesCount}
          icon={<Receipt />}
          color="blue"
          isLoading={salesQuery.isLoading}
        />
        <StatCard
          title={t('averageOrderValue')}
          value={formatCurrency(avgOrderValue)}
          icon={<TrendingUp />}
          color="purple"
          isLoading={salesQuery.isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title={t('salesOverTime')}
          subtitle={t('salesOverTimeSubtitle')}
          isLoading={salesQuery.isLoading}
        >
          {salesOverTime.length ? (
            <LineChart
              data={salesOverTime}
              dataKey="date"
              valueKey="amount"
              color="#11A47C"
            />
          ) : (
            <EmptyState title={t('noSalesFound')} description={t('noSalesDescription')} />
          )}
        </ChartCard>

        <ChartCard
          title={t('revenueByProduct')}
          subtitle={t('revenueByProductSubtitle')}
          isLoading={salesQuery.isLoading}
        >
          {revenueByProduct.length ? (
            <BarChart
              data={revenueByProduct}
              dataKey="name"
              valueKey="revenue"
              color="#3b82f6"
            />
          ) : (
            <EmptyState title={t('noSalesFound')} description={t('noSalesDescription')} />
          )}
        </ChartCard>
      </div>
    </div>
  )
}
