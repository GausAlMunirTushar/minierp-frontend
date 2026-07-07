import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'

import bnTranslation from '@/translation/bn/translation.json'
import enTranslation from '@/translation/en/translation.json'
import { STORAGE_KEYS } from '@/configs/constants'
import { fallbackLng, getOptions } from '@/i18n/settings'

const resources = {
  en: { translation: enTranslation },
  bn: { translation: bnTranslation },
}

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    ...getOptions(localStorage.getItem(STORAGE_KEYS.LOCALE) || fallbackLng),
    resources,
    interpolation: {
      escapeValue: false,
    },
  })
}

export function useTranslationClient(lng?: string, ns = 'translation') {
  const translation = useTranslationOrg(ns)

  if (lng && translation.i18n.resolvedLanguage !== lng) {
    void translation.i18n.changeLanguage(lng)
  }

  return translation
}

export const useTranslation = useTranslationClient
export default i18next
