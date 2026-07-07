import { useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Check, Pencil, Search, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Category } from '@/apis/types/category_type'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/state'
import { ListSkeleton } from '@/components/ui/skeletons'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/useInventoryApi'

export function CategoryManager() {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState('')

  const categoriesQuery = useCategories({ page: 1, limit: 200, sort: 'name' })
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()
  const categoryList = categoriesQuery.data?.data ?? []

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categoryList
    const term = search.toLowerCase()
    return categoryList.filter((c) => c.name.toLowerCase().includes(term))
  }, [categoryList, search])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError(t('requiredField'))
      return
    }

    createMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName('')
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

    const original = categoryList.find((c) => c._id === editingId)

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

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            label={t('categoryName')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={error}
            placeholder={t('categoryName')}
          />
        </div>
        <Button type="submit" disabled={createMutation.isPending} className="mt-6 w-full sm:w-auto">
          {createMutation.isPending ? t('saving') : t('addCategory')}
        </Button>
      </form>

      {categoryList.length > 5 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`${t('search')}...`}
            className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-sm text-foreground outline-none transition focus:border-ring"
          />
        </div>
      )}

      {categoriesQuery.isLoading ? (
        <ListSkeleton rows={5} />
      ) : categoryList.length === 0 ? (
        <EmptyState title={t('noCategories')} />
      ) : (
        <ul className="max-h-64 space-y-1 overflow-y-auto">
          {filteredCategories.map((category) => (
            <li
              key={category._id}
              className="group flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
            >
              {editingId === category._id ? (
                <div className="flex flex-1 items-center gap-1.5">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    onKeyDown={handleEditKeyDown}
                    className="h-8 flex-1 rounded border border-ring bg-background px-2 text-sm text-foreground outline-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={saveEdit}
                    disabled={updateMutation.isPending}
                    className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                    aria-label={t('save')}
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelEditing}
                    className="h-7 w-7 p-0 text-muted-foreground"
                    aria-label={t('cancel')}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-foreground">{category.name}</span>
                  <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => startEditing(category)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      aria-label={t('update')}
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCategoryToDelete(category)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      aria-label={t('deleteCategory')}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {editingId && editError && (
        <p className="text-xs text-destructive">{editError}</p>
      )}

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
