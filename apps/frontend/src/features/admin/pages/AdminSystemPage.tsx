import React, { useState, useEffect, useCallback } from 'react'
import {
  Server,
  AlertTriangle,
  Settings,
  RefreshCw,
  CheckCircle,
  Activity,
  Globe,
  Save,
} from 'lucide-react'
import { adminService } from '../services/adminService'
import type { VideoServerItem, BrokenLinkItem } from '../types/admin'

interface AdminSystemPageProps {
  initialSubTab?: 'video_servers' | 'broken_links' | 'settings'
}

export const AdminSystemPage: React.FC<AdminSystemPageProps> = ({ initialSubTab = 'video_servers' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'video_servers' | 'broken_links' | 'settings'>(initialSubTab)
  const [servers, setServers] = useState<VideoServerItem[]>([])
  const [brokenLinks, setBrokenLinks] = useState<BrokenLinkItem[]>([])
  const [settings, setSettings] = useState<any>({
    platformName: 'Movie Hub Cinema',
    maintenanceMode: false,
    defaultQuality: '4K ULTRA HD',
    allowGuestPreview: true,
    cdnCacheHours: 24,
    enableDrmProtection: true,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      if (activeSubTab === 'video_servers') {
        const s = await adminService.getVideoServers()
        setServers(s)
      } else if (activeSubTab === 'broken_links') {
        const b = await adminService.getBrokenLinks()
        setBrokenLinks(b)
      } else {
        const set = await adminService.getSettings()
        if (set) setSettings(set)
      }
    } catch (err) {
      console.error('[AdminSystemPage Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [activeSubTab])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleScanLinks = async () => {
    setIsScanning(true)
    try {
      // Simulate/trigger link scan
      await new Promise((r) => setTimeout(r, 1200))
      const b = await adminService.getBrokenLinks()
      setBrokenLinks(b)
    } finally {
      setIsScanning(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSettings(true)
    try {
      await adminService.updateSettings(settings)
      alert('Đã cập nhật cấu hình hệ thống thành công!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi lưu cấu hình')
    } finally {
      setIsSavingSettings(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b2b31] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#fafafa] flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#dc2626]" />
            Hạ Tầng & Giám Sát Kỹ Thuật (System Health)
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Giám sát trạng thái cụm máy chủ truyền phát video HLS, quét link hỏng định kỳ và điều chỉnh cấu hình toàn cục.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-[#2b2b31] pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('video_servers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'video_servers'
              ? 'bg-[#18181b] border border-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#111114]'
          }`}
        >
          <Server className="w-4 h-4 text-[#dc2626]" />
          Giám Sát Server Video ({servers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('broken_links')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'broken_links'
              ? 'bg-[#18181b] border border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#111114]'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Quét Link Hỏng (Broken Links)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-[#18181b] border border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#111114]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#d4af37]" />
          Cấu Hình Hệ Thống (Settings)
        </button>
      </div>

      {/* Content depending on subTab */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#71717a]">Đang tải thông số hạ tầng...</div>
      ) : activeSubTab === 'video_servers' ? (
        /* Video Servers Panel */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#a1a1aa]">
              Danh sách CDN Nodes và Edge Streaming Server phân phối video trực tiếp
            </span>
            <button
              type="button"
              onClick={loadData}
              className="px-3 py-1.5 rounded-md bg-[#18181b] hover:bg-[#202024] border border-[#2b2b31] text-xs font-medium text-white flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#d4af37]" />
              Làm mới Ping
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {servers.map((srv) => {
              const isOnline = srv.status === 'online'
              const isDegraded = srv.status === 'degraded'
              return (
                <div
                  key={srv.id}
                  className="bg-[#111114] border border-[#2b2b31] rounded-xl p-5 space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#a1a1aa] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#71717a]" />
                      {srv.location || srv.provider || 'Global Edge'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                        isOnline
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                          : isDegraded
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      <Activity className="w-3 h-3" />
                      {srv.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{srv.name || srv.serverName || 'Video Server'}</h3>
                    <p className="text-[11px] font-mono text-[#71717a] mt-0.5">{srv.baseUrl || srv.baseStreamUrl || ''}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#202024]">
                    <div>
                      <span className="text-[10px] font-mono text-[#71717a] block">ĐỘ TRỄ (LATENCY)</span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          (srv.latencyMs ?? srv.responseTimeMs ?? 24) < 50
                            ? 'text-emerald-400'
                            : (srv.latencyMs ?? srv.responseTimeMs ?? 24) < 120
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {srv.latencyMs ?? srv.responseTimeMs ?? 24} ms
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#71717a] block">TẢI HIỆN TẠI</span>
                      <span className="text-sm font-bold font-mono text-[#fafafa]">{srv.loadPercent ?? 45}%</span>
                    </div>
                  </div>

                  {/* Progress load bar */}
                  <div className="w-full h-1.5 bg-[#202024] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        (srv.loadPercent ?? 45) > 80 ? 'bg-rose-500' : (srv.loadPercent ?? 45) > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${srv.loadPercent ?? 45}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : activeSubTab === 'broken_links' ? (
        /* Broken Links Scanner Panel */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Quét Luồng Phát Video Hỏng & 404</h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Tự động kiểm tra tính khả dụng của file manifest HLS .m3u8 trên các server lưu trữ.
              </p>
            </div>

            <button
              type="button"
              onClick={handleScanLinks}
              disabled={isScanning}
              className="px-4 py-2 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Đang Quét Toàn Bộ Nguồn...' : 'Bắt Đầu Quét Toàn Bộ Link'}
            </button>
          </div>

          <div className="bg-[#111114] border border-[#2b2b31] rounded-xl overflow-hidden">
            {brokenLinks.length === 0 ? (
              <div className="p-12 text-center text-xs text-emerald-400 flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <span>Tuyệt vời! Tất cả các đường link stream video đều hoạt động bình thường (0 lỗi 404).</span>
              </div>
            ) : (
              <div className="divide-y divide-[#202024]">
                {brokenLinks.map((link) => (
                  <div key={link.id} className="p-4 flex items-center justify-between hover:bg-[#18181b] transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/80 text-rose-400 border border-rose-500/40">
                          {link.errorCode || 404} {link.errorMessage || link.issue || 'Not Found'}
                        </span>
                        <h4 className="text-xs font-bold text-white">{link.movieTitle || link.targetName || 'Nguồn Stream'}</h4>
                      </div>
                      <p className="text-[11px] font-mono text-[#a1a1aa] mt-1 break-all">{link.streamUrl || 'https://...'}</p>
                      <span className="text-[10px] font-mono text-[#71717a] mt-1 block">
                        Phát hiện lúc: {new Date(link.detectedAt || link.lastCheckedAt || '2026-03-30T12:00:00.000Z').toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Chuyển đến chỉnh sửa phim ID: ${link.movieId || link.id}`)}
                      className="px-3 py-1.5 rounded bg-[#202024] hover:bg-[#27272a] text-xs font-semibold text-white cursor-pointer shrink-0"
                    >
                      Sửa Nguồn Stream
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Settings Panel */
        <div className="max-w-2xl bg-[#111114] border border-[#2b2b31] rounded-xl p-6 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div>
              <label className="text-xs font-mono text-[#a1a1aa] block mb-1.5">TÊN NỀN TẢNG (PLATFORM NAME)</label>
              <input
                type="text"
                value={settings.platformName || ''}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] block mb-1.5">ĐỘ PHÂN GIẢI MẶC ĐỊNH</label>
                <select
                  value={settings.defaultQuality || '4K ULTRA HD'}
                  onChange={(e) => setSettings({ ...settings, defaultQuality: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                >
                  <option value="4K ULTRA HD">4K ULTRA HD</option>
                  <option value="1080p Full HD">1080p Full HD</option>
                  <option value="720p HD">720p HD</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#a1a1aa] block mb-1.5">CDN CACHE TTL (GIỜ)</label>
                <input
                  type="number"
                  value={settings.cdnCacheHours || 24}
                  onChange={(e) => setSettings({ ...settings, cdnCacheHours: parseInt(e.target.value) || 24 })}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode || false}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-rose-400 block">Chế Độ Bảo Trì (Maintenance Mode)</span>
                  <span className="text-[11px] text-[#71717a]">
                    Khi bật, người dùng phổ thông sẽ thấy trang thông báo bảo trì, chỉ Admin mới truy cập được.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowGuestPreview || false}
                  onChange={(e) => setSettings({ ...settings, allowGuestPreview: e.target.checked })}
                  className="rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">Cho Phép Khách Xem Thử (Guest Preview)</span>
                  <span className="text-[11px] text-[#71717a]">
                    Người dùng chưa đăng nhập có thể xem tối đa 5 phút đầu tiên của tập phim.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-[#2b2b31]">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSavingSettings ? 'Đang Lưu...' : 'Lưu Thay Đổi Cấu Hình'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
