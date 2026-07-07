import { useTranslation } from 'react-i18next'

import { STORAGE_KEYS } from '@/configs/constants'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const changeLanguage = (language: string) => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, language)
    void i18n.changeLanguage(language)
  }

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span>{t('language')}</span>
      <select
        value={i18n.language}
        onChange={(event) => changeLanguage(event.target.value)}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 outline-none focus:border-cyan-500"
        aria-label={t('language')}
      >
        <option value="en">EN</option>
        <option value="bn">BN</option>
      </select>
    </label>
  )
}
