import React from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useThemeDetector } from '@/hooks/useThemeDetector'

interface PieChartProps {
  data: Array<Record<string, number | string>>
  dataKey: string
  nameKey: string
  title?: string
  colorPalette?: string[]
  height?: number
  isLoading?: boolean
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  dataKey,
  nameKey,
  title,
  colorPalette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'],
  height = 300,
  isLoading = false,
}) => {
  const { getTooltipBackgroundColor, getTooltipBorderColor, getTextColor } = useThemeDetector()

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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#d1d5db"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : '0'}%`}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [value, dataKey]}
            contentStyle={{
              fontSize: '12px',
              backgroundColor: getTooltipBackgroundColor(),
              borderColor: getTooltipBorderColor(),
              borderRadius: '0.5rem',
              color: getTextColor(),
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: getTextColor() }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChart
