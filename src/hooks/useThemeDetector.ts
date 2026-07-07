import { useTheme } from '@/hooks/useTheme'

export const useThemeDetector = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const getThemeAwareColor = (lightColor: string, darkColor: string): string =>
    isDark ? darkColor : lightColor

  const getGridStrokeColor = (): string => getThemeAwareColor('#e5e7eb', '#374151')
  const getTickColor = (): string => getThemeAwareColor('#4b5563', '#d1d5db')
  const getTooltipBackgroundColor = (): string => getThemeAwareColor('#ffffff', '#1f2937')
  const getTooltipBorderColor = (): string => getThemeAwareColor('#e5e7eb', '#374151')
  const getTextColor = (): string => getThemeAwareColor('#111827', '#f9fafb')

  return {
    theme: resolvedTheme,
    isDark,
    isLight: !isDark,
    getThemeAwareColor,
    getGridStrokeColor,
    getTickColor,
    getTooltipBackgroundColor,
    getTooltipBorderColor,
    getTextColor,
  }
}
