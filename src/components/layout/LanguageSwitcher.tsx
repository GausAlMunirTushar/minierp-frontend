import { useTranslation } from 'react-i18next'

import { STORAGE_KEYS } from '@/configs/constants'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const language = i18n.language === 'bn' ? 'bn' : 'en'

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn'
    localStorage.setItem(STORAGE_KEYS.LOCALE, next)
    void i18n.changeLanguage(next)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t('language')}
      className="relative flex h-9 w-36 select-none items-center rounded-full border border-border bg-muted/80 p-1 backdrop-blur-sm"
    >
      <span
        className={cn(
          'absolute h-[28px] w-[68px] rounded-full bg-card shadow-sm transition-all duration-300 ease-in-out',
          language === 'bn' ? 'translate-x-0' : 'translate-x-[68px]',
        )}
      />
      <span className="relative z-10 flex w-full justify-between px-1">
        <span
          className={cn(
            'flex-1 text-center text-xs font-medium transition-colors duration-300',
            language === 'bn' ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          বাংলা
        </span>
        <span
          className={cn(
            'flex-1 text-center text-xs font-medium transition-colors duration-300',
            language === 'en' ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          English
        </span>
      </span>
    </button>
  )
}
