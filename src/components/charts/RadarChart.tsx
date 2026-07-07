import React from 'react'
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useThemeDetector } from '@/hooks/useThemeDetector'

interface RadarChartProps {
  data: Array<Record<string, number | string>>
  dataKey: string
  valueKey: string
  title?: string
  color?: string
  height?: number
  isLoading?: boolean
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  dataKey,
  valueKey,
  title,
  color = '#3b82f6',
  height = 300,
  isLoading = false,
}) => {
  const { getGridStrokeColor, getTickColor, getTooltipBackgroundColor, getTooltipBorderColor, getTextColor } =
    useThemeDetector()

  if (isLoading) {
    return (
      <div className="w-full">
        {title && <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">{title}</h3>}
        <div className="animate-pulse rounded-xl bg-muted" style={{ height }}>
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full">
      {title && <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={getGridStrokeColor()} />
          <PolarAngleAxis dataKey={dataKey} tick={{ fontSize: 12, fill: getTickColor() }} />
          <PolarRadiusAxis tick={{ fontSize: 12, fill: getTickColor() }} />
          <Radar name="Performance" dataKey={valueKey} stroke={color} fill={color} fillOpacity={0.6} />
          <Tooltip
            contentStyle={{
              fontSize: '12px',
              backgroundColor: getTooltipBackgroundColor(),
              borderColor: getTooltipBorderColor(),
              borderRadius: '0.5rem',
              color: getTextColor(),
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RadarChart
