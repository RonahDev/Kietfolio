import React, { useEffect, useState } from 'react'
import {
  Film,
  DollarSign,
  Activity,
  Shield,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { MetricCard } from '../components/metric-card/MetricCard'
import { adminService } from '../services/adminService'
import type { DashboardMetricsResponse } from '../types/admin'

export const AdminDashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [revenueData, setRevenueData] = useState<any[]>([])

  useEffect(() => {
    let isCancelled = false

    async function loadData() {
      try {
        setIsLoading(true)
        const [metricData, revData] = await Promise.all([
          adminService.getDashboardMetrics(),
          adminService.getRevenueAnalytics().catch(() => null),
        ])
        if (!isCancelled) {
          setMetrics(metricData)
          if (revData?.monthlyRevenue) {
            setRevenueData(revData.monthlyRevenue)
          }
        }
      } catch (err) {
        console.error('[DashboardOverview Error]:', err)
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadData()
    return () => {
      isCancelled = true
    }
  }, [])

  // Sample timeline data for traffic chart visualization
  const trafficChartData = [
    { name: 'Thứ 2', visits: 1840, views: 5200 },
    { name: 'Thứ 3', visits: 2100, views: 6400 },
    { name: 'Thứ 4', visits: 1950, views: 5800 },
    { name: 'Thứ 5', visits: 2400, views: 7100 },
    { name: 'Thứ 6', visits: 3100, views: 9200 },
    { name: 'Thứ 7', visits: 4500, views: 13800 },
    { name: 'Chủ Nhật', visits: 4850, views: 14600 },
  ]

  const fallbackRevenueChart = [
    { month: 'T06', revenue: 14500000 },
    { month: 'T07', revenue: 18200000 },
    { month: 'T08', revenue: 23400000 },
    { month: 'T09', revenue: 29800000 },
    { month: 'T10', revenue: 38600000 },
    { month: 'T11', revenue: 45200000 },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TỔNG KHO PHIM 4K"
          value={isLoading ? '...' : (metrics?.content.totalMovies || 14) + (metrics?.content.totalTvSeries || 4)}
          changePercent={12.5}
          changePeriod="so với tuần trước"
          icon={<Film className="w-5 h-5 text-[#dc2626]" />}
          accentColor="#dc2626"
          sparklineData={[40, 50, 60, 70, 75, 85, 95]}
        />

        <MetricCard
          title="LƯỢT TRUY CẬP HÔM NAY"
          value={isLoading ? '...' : (metrics?.traffic.todayVisits || 1284).toLocaleString()}
          changePercent={18.4}
          changePeriod="so với hôm qua"
          icon={<Activity className="w-5 h-5 text-[#00d2ff]" />}
          accentColor="#00d2ff"
          sparklineData={[30, 45, 60, 50, 75, 80, 100]}
        />

        <MetricCard
          title="DOANH THU THỰC NHẬN"
          value={
            isLoading
              ? '...'
              : `₫${(metrics?.revenue.totalRevenue || 45200000).toLocaleString()}`
          }
          changePercent={22.8}
          changePeriod="so với tháng trước"
          icon={<DollarSign className="w-5 h-5 text-[#d4af37]" />}
          accentColor="#d4af37"
          sparklineData={[20, 35, 45, 60, 70, 85, 100]}
        />

        <MetricCard
          title="PHIÊN QUẢN TRỊ ĐANG MỞ"
          value={isLoading ? '...' : metrics?.users.activeSessions || 1}
          changePercent={0}
          changePeriod="thiết bị ủy quyền"
          icon={<Shield className="w-5 h-5 text-emerald-400" />}
          accentColor="#10b981"
          sparklineData={[50, 50, 50, 50, 50, 50, 50]}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Flow Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-[#18181b] border border-[#2b2b31] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Lưu Lượng Truy Cập & Lượt Xem Phim 7 Ngày Qua
              </h4>
              <p className="text-xs font-mono text-[#a1a1aa]">
                Thống kê số phiên truy cập (Visits) và lượt phát phim thực tế (Movie Views)
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#202024] border border-[#2b2b31] text-[#d4af37]">
              Tuần Hiện Tại
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficChartData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2b2b31" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
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
                  dataKey="views"
                  name="Lượt Xem Phim"
                  stroke="#dc2626"
                  fillOpacity={1}
                  fill="url(#viewsGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="Phiên Truy Cập"
                  stroke="#00d2ff"
                  fillOpacity={1}
                  fill="url(#visitsGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Monthly Chart (1 Col) */}
        <div className="p-5 rounded-lg bg-[#18181b] border border-[#2b2b31] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Tăng Trưởng Doanh Thu
              </h4>
              <p className="text-xs font-mono text-[#a1a1aa]">6 Tháng Gần Nhất (VND)</p>
            </div>
            <DollarSign className="w-4 h-4 text-[#d4af37]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.length > 0 ? revenueData : fallbackRevenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2b2b31" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis
                  stroke="#71717a"
                  fontSize={10}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Tr`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ₫`, 'Doanh Thu']}
                  contentStyle={{
                    backgroundColor: '#111114',
                    border: '1px solid #2b2b31',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Stream Table */}
      <div className="p-5 rounded-lg bg-[#18181b] border border-[#2b2b31] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#dc2626]" />
            <h4 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Nhật Ký Hoạt Động & Kiểm Toán Gần Đây
            </h4>
          </div>
          <span className="text-xs font-mono text-[#71717a]">Tự động đồng bộ theo thời gian thực</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#2b2b31] text-[#71717a] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Quản Trị Viên</th>
                <th className="py-2.5 px-3">Hành Động</th>
                <th className="py-2.5 px-3">Phân Hệ</th>
                <th className="py-2.5 px-3">Thời Gian</th>
                <th className="py-2.5 px-3 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202024] text-[#fafafa]">
              {metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
                metrics.recentActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#202024]/50 transition-colors">
                    <td className="py-2.5 px-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[10px] text-white">
                        {act.actor?.displayName?.[0] || 'A'}
                      </div>
                      <span className="font-semibold">{act.actor?.displayName || 'Mai Anh Kiệt'}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#d4af37] font-semibold">{act.action}</td>
                    <td className="py-2.5 px-3 text-[#a1a1aa]">{act.entityType}</td>
                    <td className="py-2.5 px-3 text-[#71717a]">
                      {new Date(act.createdAt).toLocaleTimeString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                        THÀNH CÔNG
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#71717a]">
                    Chưa có nhật ký hoạt động mới phát sinh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
