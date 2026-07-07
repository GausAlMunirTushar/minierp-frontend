import { useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeft, Check, Edit, Plus, Search, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Category } from '@/apis/types/category_type'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { EmptyState, ErrorState } from '@/components/ui/state'
import { UI_CONSTANTS } from '@/configs/constants'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/useInventoryApi'

const getParamNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function CategoriesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = getParamNumber(searchParams.get('page'), 1)
  const limit = getParamNumber(searchParams.get('limit'), UI_CONSTANTS.DEFAULT_PAGE_SIZE)
  const sort = searchParams.get('sort') ?? 'name'
  const search = searchParams.get('search') ?? ''

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [addError, setAddError] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState('')

  const categoriesQuery = useCategories({ page, limit, search: search || undefined, sort })
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const categories = categoriesQuery.data?.data ?? []
  const meta = categoriesQuery.data?.meta

  const openAddDialog = () => {
    setName('')
    setAddError('')
    setIsAddOpen(true)
  }

  const closeAddDialog = () => {
    setIsAddOpen(false)
    setName('')
    setAddError('')
  }

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAddError('')

    if (!name.trim()) {
      setAddError(t('requiredField'))
      return
    }

    createMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          closeAddDialog()
          toast.success(t('createdSuccessfully'))
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    )
  }

  const startEditing = (category: Category) => {
    setEditingId(category._id)
    setEditName(category.name)
    setEditError('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName('')
    setEditError('')
  }

  const saveEdit = () => {
    const trimmed = editName.trim()

    if (!trimmed) {
      setEditError(t('requiredField'))
      return
    }

    const original = categories.find((c) => c._id === editingId)

    if (original && trimmed === original.name) {
      cancelEditing()
      return
    }

    if (!editingId) return

    updateMutation.mutate(
      { id: editingId, payload: { name: trimmed } },
      {
        onSuccess: () => {
          cancelEditing()
          toast.success(t('updatedSuccessfully'))
        },
        onError: (err) => setEditError(getApiErrorMessage(err)),
      },
    )
  }

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') saveEdit()
    if (event.key === 'Escape') cancelEditing()
  }

  const confirmDelete = () => {
    if (!categoryToDelete) return

    deleteMutation.mutate(categoryToDelete._id, {
      onSuccess: () => {
        setCategoryToDelete(null)
        toast.success(t('deletedSuccessfully'))
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err))
        setCategoryToDelete(null)
      },
    })
  }

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value) {
      nextParams.set(key, value)
    } else {
      nextParams.delete(key)
    }
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const setPage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(nextPage))
    setSearchParams(nextParams)
  }

  const setLimit = (nextLimit: number) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('limit', String(nextLimit))
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('categoryName')} />,
        cell: ({ row }) => {
          const category = row.original

          if (editingId === category._id) {
            return (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="h-9 w-full min-w-[200px] rounded-md border border-ring bg-background px-3 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={saveEdit}
                  disabled={updateMutation.isPending}
                  className="h-9 w-9 shrink-0 p-0 text-green-600 hover:text-green-700"
                  aria-label={t('save')}
                >
                  <Check size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={cancelEditing}
                  className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-foreground"
                  aria-label={t('cancel')}
                >
                  <X size={16} />
                </Button>
              </div>
            )
          }

          return <span className="font-medium text-foreground">{category.name}</span>
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('date')} />,
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt)
          return (
            <span className="text-muted-foreground">
              {date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{t('actions')}</div>,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          if (editingId === row.original._id) return null

          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => startEditing(row.original)}
                aria-label={t('update')}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={() => setCategoryToDelete(row.original)}
                aria-label={t('deleteCategory')}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )
        },
      },
    ],
    [editingId, editName, updateMutation.isPending, t],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('categories')}
        description={t('categoriesDescription')}
        actions={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/products')}>
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">{t('products')}</span>
            </Button>
            <Button type="button" onClick={openAddDialog}>
              <Plus size={16} />
              <span>{t('addCategory')}</span>
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 lg:grid-cols-[1fr]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={search}
            onChange={(event) => updateParam('search', event.target.value)}
            placeholder={`${t('search')} ${t('categories').toLowerCase()}...`}
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground outline-none focus:border-ring"
          />
        </label>
      </div>

      <Card>
        <CardContent className="p-0">
          {categoriesQuery.isError ? (
            <div className="p-4">
              <ErrorState
                title={t('loading')}
                description={getApiErrorMessage(categoriesQuery.error)}
                onRetry={() => void categoriesQuery.refetch()}
                retryLabel={t('retry')}
              />
            </div>
          ) : !categoriesQuery.isLoading && categories.length === 0 && !search ? (
            <div className="p-4">
              <EmptyState title={t('noCategories')} />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              isLoading={categoriesQuery.isLoading}
              pagination={{
                page,
                pageCount: meta?.totalPages ?? 1,
                pageSize: limit,
                totalCount: meta?.total ?? 0,
                onPageChange: setPage,
                onPageSizeChange: setLimit,
              }}
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isAddOpen}
        onClose={closeAddDialog}
        title={t('addCategory')}
        closeLabel={t('close')}
        className="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4" noValidate>
          <Input
            label={t('categoryName')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => {
              if (!name.trim()) setAddError(t('requiredField'))
              else setAddError('')
            }}
            error={addError}
            placeholder={t('categoryName')}
            autoFocus
          />
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={closeAddDialog} disabled={createMutation.isPending}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? t('saving') : t('create')}
            </Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title={t('deleteCategory')}
        description={`${t('deleteCategoryConfirm')} ${t('deleteCategoryDescription')}`}
        confirmLabel={t('confirmDelete')}
        cancelLabel={t('cancel')}
        isLoading={deleteMutation.isPending}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
