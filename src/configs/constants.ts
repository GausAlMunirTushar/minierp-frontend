export const APP_CONFIG = {
  SITE_NAME: 'Mini ERP',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'mini_erp_access_token',
  USER: 'mini_erp_user',
  LOCALE: 'locale',
} as const

export const UI_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  LOW_STOCK_THRESHOLD: 5,
} as const
