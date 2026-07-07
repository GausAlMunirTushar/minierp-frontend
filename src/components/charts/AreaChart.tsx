import React from 'react'
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useThemeDetector } from '@/hooks/useThemeDetector'

interface AreaChartProps {
  data: Array<Record<string, number | string>>
  dataKey: string
  valueKey: string
  title?: string
  color?: string
  height?: number
  isLoading?: boolean
}

const AreaChart: React.FC<AreaChartProps> = ({
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
        <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`color${valueKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={getGridStrokeColor()} />
          <XAxis dataKey={dataKey} tick={{ fontSize: 12, fill: getTickColor() }} />
          <YAxis tick={{ fontSize: 12, fill: getTickColor() }} />
          <Tooltip
            formatter={(value) => [value, valueKey]}
            labelFormatter={(label) => `${dataKey}: ${label}`}
            contentStyle={{
              fontSize: '12px',
              backgroundColor: getTooltipBackgroundColor(),
              borderColor: getTooltipBorderColor(),
              borderRadius: '0.5rem',
              color: getTextColor(),
            }}
          />
          <Area type="monotone" dataKey={valueKey} stroke={color} fillOpacity={1} fill={`url(#color${valueKey})`} />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AreaChart
