import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Category } from '@/apis/types/category_type'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { EmptyState, ErrorState } from '@/components/ui/state'
import { ListSkeleton } from '@/components/ui/skeletons'
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useInventoryApi'

export function CategoriesPage() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const categoriesQuery = useCategories({ page: 1, limit: 100, sort: 'name' })
  const createMutation = useCreateCategory()
  const deleteMutation = useDeleteCategory()
  const navigate = useNavigate()
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
    <div className="space-y-6">
      <PageHeader
        title={t('categories')}
        description={t('categoriesDescription')}
        actions={
          <Button type="button" variant="outline" onClick={() => navigate('/products')}>
            <ArrowLeft size={16} />
            {t('products')}
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
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
            <ListSkeleton rows={6} />
          ) : categoriesQuery.isError ? (
            <ErrorState
              title={t('loading')}
              description={getApiErrorMessage(categoriesQuery.error)}
              onRetry={() => void categoriesQuery.refetch()}
              retryLabel={t('retry')}
            />
          ) : categoryList.length === 0 ? (
            <EmptyState title={t('noCategories')} />
          ) : (
            <ul className="divide-y divide-border rounded-md border border-border">
              {categoryList.map((category) => (
                <li
                  key={category._id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="font-medium text-foreground">{category.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCategoryToDelete(category)}
                    aria-label={t('deleteCategory')}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

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
