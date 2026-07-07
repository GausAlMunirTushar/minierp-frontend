import { useState } from 'react'
import type { FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Category } from '@/apis/types/category_type'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { EmptyState, LoadingState } from '@/components/ui/state'
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useInventoryApi'

export function CategoryManager() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const categoriesQuery = useCategories({ page: 1, limit: 100, sort: 'name' })
  const createMutation = useCreateCategory()
  const deleteMutation = useDeleteCategory()
  const categoryList = categoriesQuery.data?.data ?? []

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
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            label={t('categoryName')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={error}
            placeholder={t('categoryName')}
          />
        </div>
        <Button type="submit" disabled={createMutation.isPending} className="mt-6">
          {createMutation.isPending ? t('saving') : t('addCategory')}
        </Button>
      </form>

      {categoriesQuery.isLoading ? (
        <LoadingState label={t('loading')} />
      ) : categoryList.length === 0 ? (
        <EmptyState title={t('noCategories')} />
      ) : (
        <ul className="max-h-72 space-y-1 overflow-y-auto">
          {categoryList.map((category) => (
            <li
              key={category._id}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
            >
              <span className="text-foreground">{category.name}</span>
              <Button
                type="button"
                variant="danger"
                onClick={() => setCategoryToDelete(category)}
                aria-label={t('deleteCategory')}
              >
                <Trash2 size={14} />
              </Button>
            </li>
          ))}
        </ul>
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
