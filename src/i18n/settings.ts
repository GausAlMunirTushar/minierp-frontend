export const fallbackLng = 'en'
export const languages = ['en', 'bn'] as const
export const defaultNS = 'translation'

export type Language = (typeof languages)[number]

export function getOptions(lng: Language | string = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
