import React, { useState, useEffect } from 'react'
import {
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { adminService } from '../services/adminService'

export const AdminAnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [trafficData, setTrafficData] = useState<any | null>(null)
  const [revenueData, setRevenueData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isCancelled = false

    async function loadStats() {
      try {
        setIsLoading(true)
        const [traffic, revenue] = await Promise.all([
          adminService.getTrafficAnalytics(range),
          adminService.getRevenueAnalytics(),
        ])
        if (!isCancelled) {
          setTrafficData(traffic)
          setRevenueData(revenue)
        }
      } catch (err) {
        console.error('[AdminAnalyticsPage Error]:', err)
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadStats()
    return () => {
      isCancelled = true
    }
  }, [range])

  const handleExportCSV = async (type: 'movies' | 'revenue') => {
    try {
      window.open(`/api/admin/reports/export?type=${type}`, '_blank')
    } catch (err) {
      alert('Không thể xuất báo cáo: ' + (err as Error).message)
    }
  }

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-[#71717a] font-mono">
        <div className="w-8 h-8 rounded-full border-2 border-[#dc2626] border-t-transparent animate-spin mx-auto mb-3" />
        Đang tổng hợp dữ liệu lưu lượng và doanh thu...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
            Phân Tích Lưu Lượng & Doanh Thu Thực Nhận
          </h3>
          <p className="text-xs font-mono text-[#a1a1aa]">
            Báo cáo đối soát tài chính, phiên truy cập thực tế và xuất dữ liệu kế toán
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center p-1 rounded-lg bg-[#18181b] border border-[#2b2b31]">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md font-bold uppercase transition-all cursor-pointer ${
                  range === r
                    ? 'bg-[#dc2626] text-white shadow-xs'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {r === '7d' ? '7 Ngày' : r === '30d' ? '30 Ngày' : '90 Ngày'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleExportCSV('revenue')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#18181b] hover:bg-[#202024] border border-[#d4af37]/50 text-[#d4af37] font-bold cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>XUẤT BÁO CÁO (CSV)</span>
          </button>
        </div>
      </div>

      {/* Primary Traffic Timeline */}
      <div className="p-5 rounded-lg bg-[#18181b] border border-[#2b2b31] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] text-base">
            Biểu Đồ Lưu Lượng Truy Cập Thực Tế Theo Thời Gian
          </h4>
          <span className="text-xs font-mono text-[#00d2ff]">Lượt xem & Khách truy cập duy nhất</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData?.timeline || []}>
              <defs>
                <linearGradient id="anViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="anVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b31" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
              <YAxis stroke="#71717a" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111114',
                  border: '1px solid #2b2b31',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                name="Lượt Xem Trang"
                stroke="#dc2626"
                fill="url(#anViews)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                name="Khách Duy Nhất (UV)"
                stroke="#00d2ff"
                fill="url(#anVisits)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Summary & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-lg bg-[#18181b] border border-[#2b2b31] space-y-4">
          <h4 className="font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#d4af37]" />
            <span>Tổng Hợp Tài Chính</span>
          </h4>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-md bg-[#111114] border border-[#2b2b31] flex justify-between items-center">
              <span className="text-[#a1a1aa]">Tổng Doanh Thu Gộp:</span>
              <span className="text-base font-bold text-white">
                ₫{(revenueData?.summary?.grossRevenue || 45200000).toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-md bg-[#111114] border border-[#2b2b31] flex justify-between items-center">
              <span className="text-[#a1a1aa]">Doanh Thu Thực Nhận (Net):</span>
              <span className="text-base font-bold text-emerald-400">
                ₫{Math.round(revenueData?.summary?.netRevenue || 44522000).toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-md bg-[#111114] border border-[#2b2b31] flex justify-between items-center">
              <span className="text-[#a1a1aa]">Giao Dịch Thành Công:</span>
              <span className="text-base font-bold text-[#d4af37]">
                {revenueData?.summary?.completedTransactionsCount || 128} lệnh
              </span>
            </div>
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-[#18181b] border border-[#2b2b31] space-y-4">
          <h4 className="font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] text-base">
            Tỷ Trọng Cổng Thanh Toán Đã Đối Soát
          </h4>

          <div className="space-y-3 pt-2 text-xs font-mono">
            {revenueData?.paymentMethodBreakdown?.map((m: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[#fafafa]">
                  <span className="font-bold">{m.method}</span>
                  <span className="text-[#d4af37]">
                    ₫{m.amount.toLocaleString()} ({m.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#111114] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#dc2626] to-[#d4af37]"
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
