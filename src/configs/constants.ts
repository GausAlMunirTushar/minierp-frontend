export const APP_CONFIG = {
  SITE_NAME: 'Mini ERP',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'bn'],
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'mini_erp_access_token',
  USER: 'mini_erp_user',
  LOCALE: 'mini_erp_locale',
  THEME: 'mini_erp_theme',
} as const

export const UI_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  LOW_STOCK_THRESHOLD: 5,
} as const
