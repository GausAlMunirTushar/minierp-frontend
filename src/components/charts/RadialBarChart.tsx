import React from 'react'
import { RadialBarChart as RechartsRadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts'
import { useThemeDetector } from '@/hooks/useThemeDetector'

interface RadialBarChartProps {
  data: Array<Record<string, number | string>>
  dataKey: string
  valueKey: string
  title?: string
  color?: string
  height?: number
  isLoading?: boolean
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({
  data,
  valueKey,
  title,
  color = '#3b82f6',
  height = 300,
  isLoading = false,
}) => {
  const { getTickColor, getTextColor } = useThemeDetector()

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
        <RechartsRadialBarChart innerRadius="10%" outerRadius="80%" barSize={10} data={data} startAngle={180} endAngle={0}>
          <RadialBar label={{ position: 'insideStart', fill: getTickColor(), fontSize: 12 }} background dataKey={valueKey} fill={color} />
          <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="right" wrapperStyle={{ color: getTextColor() }} />
        </RechartsRadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RadialBarChart
