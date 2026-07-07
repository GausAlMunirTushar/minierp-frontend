import { FormEvent, useState } from 'react'
import { Boxes } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useLoginMutation } from '@/apis/mutations/auth_mutations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@minierp.local')
  const [password, setPassword] = useState('Admin123!')

  const mutation = useLoginMutation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
      login(response.data.accessToken, response.data.user)
      const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(nextPath || '/dashboard', { replace: true })
        },
      },
    )
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-white">
              <Boxes />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">{t('loginTitle')}</h1>
            <p className="mt-1 text-sm text-slate-500">{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t('email')} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {mutation.isError && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {t('loginFailed')}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Signing in...' : t('signIn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
