import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export function DataTablePagination({
  page,
  pageCount,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: {
  page: number
  pageCount: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}) {
  const { t } = useTranslation()
  const safePage = Number(page) || 1
  const safePageSize = Number(pageSize) || 0
  const safeTotal = Number(totalCount) || 0

  const from = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1
  const to = safeTotal === 0 ? 0 : Math.min(safePage * safePageSize, safeTotal)

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>
        {t('showing')} <span className="font-medium text-slate-900">{from}</span>–
        <span className="font-medium text-slate-900">{to}</span> {t('of')}{' '}
        <span className="font-medium text-slate-900">{safeTotal}</span>
      </span>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          {t('rowsPerPage')}
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 outline-none focus:border-cyan-500"
          >
            {[10, 20, 25, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <span className="font-medium">
          {t('page')} {safePage} {t('of')} {pageCount}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(1)}
            disabled={safePage <= 1}
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= pageCount}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-2"
            onClick={() => onPageChange(pageCount)}
            disabled={safePage >= pageCount}
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
