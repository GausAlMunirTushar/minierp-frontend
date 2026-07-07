import { FormEvent, useMemo, useState } from 'react'
import { Boxes } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { getApiErrorMessage } from '@/apis/configs'
import { useLoginMutation } from '@/apis/mutations/auth_mutations'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

type LoginErrors = {
  email?: string
  password?: string
}

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  const mutation = useLoginMutation()
  const sessionExpired = searchParams.get('message') === 'session_expired'

  const apiError = useMemo(
    () => (mutation.error ? getApiErrorMessage(mutation.error) : ''),
    [mutation.error],
  )

  const validate = () => {
    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = t('requiredField')
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = t('invalidEmail')
    }

    if (!password.trim()) {
      nextErrors.password = t('requiredField')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    mutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          login(response.data.accessToken, response.data.user)
          const statePath = (location.state as { from?: { pathname?: string } } | null)?.from
            ?.pathname
          const queryPath = searchParams.get('next')
          navigate(queryPath || statePath || '/dashboard', { replace: true })
        },
      },
    )
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Boxes />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{t('loginTitle')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('loginSubtitle')}</p>
          </div>

          {sessionExpired && <Alert variant="info">{t('sessionExpired')}</Alert>}
          {mutation.isError && <Alert variant="error">{apiError || t('loginFailed')}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t('signingIn') : t('signIn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
