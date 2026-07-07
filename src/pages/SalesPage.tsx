import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getApiErrorMessage } from '@/apis/configs'
import type { Sale } from '@/apis/types/sale_type'
import { PageHeader } from '@/components/layout/PageHeader'
import { SaleForm } from '@/components/sales/SaleForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState, ErrorState } from '@/components/ui/state'
import { useSales } from '@/hooks/useInventoryApi'
import { formatCurrency } from '@/utils/currency'
import { formatDateTime } from '@/utils/date'

export function SalesPage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const salesQuery = useSales({ page: 1, limit: 10 })

  const closeForm = () => setIsFormOpen(false)

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sales')}
        description={t('salesDescription')}
        actions={
          <Button type="button" onClick={() => setIsFormOpen(true)}>
            <Plus size={16} />
            {t('createSale')}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-card-foreground">{t('recentSales')}</h2>
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

      <Dialog
        open={isFormOpen}
        onClose={closeForm}
        title={t('createSale')}
        description={t('salesDescription')}
        closeLabel={t('close')}
        className="max-w-3xl"
      >
        <SaleForm onSuccess={closeForm} onCancel={closeForm} />
      </Dialog>
    </div>
  )
}
