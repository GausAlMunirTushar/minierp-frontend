export const formatDateTime = (value: string | Date, locale = 'en-BD') =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
