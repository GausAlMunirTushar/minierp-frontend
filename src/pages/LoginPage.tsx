import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { getApiErrorMessage } from '@/apis/configs'
import { useLoginMutation } from '@/apis/mutations/auth_mutations'
import { Logo } from '@/components/common/Logo'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

type LoginErrors = {
  email?: string
  password?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@minierp.com')
  const [password, setPassword] = useState('Password123!')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  const mutation = useLoginMutation()
  const sessionExpired = searchParams.get('message') === 'session_expired'

  const apiError = useMemo(
    () => (mutation.error ? getApiErrorMessage(mutation.error) : ''),
    [mutation.error],
  )

  const validateField = (field: keyof LoginErrors) => {
    setErrors((current) => {
      const next = { ...current }

      if (field === 'email') {
        if (!email.trim()) {
          next.email = t('requiredField')
        } else if (!EMAIL_REGEX.test(email)) {
          next.email = t('invalidEmail')
        } else {
          delete next.email
        }
      }

      if (field === 'password') {
        if (!password.trim()) {
          next.password = t('requiredField')
        } else {
          delete next.password
        }
      }

      return next
    })
  }

  const validate = () => {
    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = t('requiredField')
    } else if (!EMAIL_REGEX.test(email)) {
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
    <div className="grid min-h-screen place-items-center bg-muted p-4 sm:p-6">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-5 p-6 sm:space-y-6 sm:p-8">
          <div className="text-center">
            <Logo className="mx-auto mb-4 h-12 w-12 sm:h-14 sm:w-14" />
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{t('loginTitle')}</h1>
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
              onBlur={() => validateField('email')}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => validateField('password')}
              error={errors.password}
              autoComplete="current-password"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  className="rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
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
