import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  changePercent?: number
  changePeriod?: string
  icon?: React.ReactNode
  sparklineData?: number[]
  accentColor?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changePercent = 0,
  changePeriod = 'so với tháng trước',
  icon,
  sparklineData = [35, 45, 40, 60, 55, 75, 80],
  accentColor = '#dc2626',
}) => {
  const isPositive = changePercent >= 0

  return (
    <div className="p-5 rounded-lg bg-[#18181b] border border-[#2b2b31] hover:border-[#3f3f46] transition-all shadow-lg flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-[#a1a1aa] uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-md bg-[#202024] border border-[#2b2b31] text-white">
            {icon}
          </div>
        )}
      </div>

      <div className="my-3 flex items-baseline justify-between">
        <h3 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#fafafa] tracking-tight">
          {value}
        </h3>

        {/* Mini Sparkline Visualization */}
        <div className="flex items-end gap-1 h-8 opacity-75 group-hover:opacity-100 transition-opacity">
          {sparklineData.map((val, idx) => (
            <div
              key={idx}
              className="w-1.5 rounded-t-xs transition-all duration-300"
              style={{
                height: `${Math.max(15, Math.min(100, val))}%`,
                backgroundColor: accentColor,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-mono">
        <span
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-xs font-bold text-[10px] ${
            isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? `+${changePercent}%` : `${changePercent}%`}
        </span>
        <span className="text-[#71717a] text-[11px] truncate">{changePeriod}</span>
      </div>
    </div>
  )
}
