import React from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useThemeDetector } from '@/hooks/useThemeDetector'

interface LineChartProps {
  data: Array<Record<string, number | string>>
  dataKey: string
  valueKey: string
  title?: string
  color?: string
  height?: number
  isLoading?: boolean
}

const LineChart: React.FC<LineChartProps> = ({
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
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Legend wrapperStyle={{ color: getTextColor() }} />
          <Line type="monotone" dataKey={valueKey} stroke={color} activeDot={{ r: 8 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChart
