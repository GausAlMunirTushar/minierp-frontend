export const formatCurrency = (value: number, locale = 'en-BD') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(value)
