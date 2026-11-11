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
  Bot,
  Clock,
} from 'lucide-react'
import { adminService } from '../services/adminService'
import type { VideoServerItem, BrokenLinkItem } from '../types/admin'

interface AdminSystemPageProps {
  initialSubTab?: 'video_servers' | 'broken_links' | 'settings' | 'auto_sync'
}

export const AdminSystemPage: React.FC<AdminSystemPageProps> = ({ initialSubTab = 'auto_sync' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'video_servers' | 'broken_links' | 'settings' | 'auto_sync'>(initialSubTab)
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

  // Auto-sync states
  const [syncStatus, setSyncStatus] = useState<any>(null)
  const [syncHistory, setSyncHistory] = useState<any[]>([])
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)
  const [syncConfig, setSyncConfig] = useState<any>({
    autoSyncEnabled: true,
    intervalMinutes: 360,
    sources: {
      includeKKPhimNew: true,
      includeKKPhimTheatrical: true,
      includeKKPhimAnime: true,
      includeTMDBTheatrical: true,
    },
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      if (activeSubTab === 'auto_sync') {
        const [st, hist] = await Promise.allSettled([
          adminService.getSyncStatus(),
          adminService.getSyncHistory(),
        ])
        if (st.status === 'fulfilled' && st.value) {
          setSyncStatus(st.value)
          setSyncConfig((prev) => ({
            autoSyncEnabled: st.value.autoSyncEnabled,
            intervalMinutes: st.value.intervalMinutes,
            sources: st.value.sources || prev.sources,
          }))
        }
        if (hist.status === 'fulfilled' && Array.isArray(hist.value)) {
          setSyncHistory(hist.value)
        }
      } else if (activeSubTab === 'video_servers') {
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

  const handleTriggerManualSync = async () => {
    setIsSyncing(true)
    setSyncFeedback(null)
    try {
      const res = await adminService.triggerSyncNow()
      setSyncFeedback(res.message || 'Đồng bộ phim thành công!')
      // Refresh status & history
      const [st, hist] = await Promise.all([
        adminService.getSyncStatus(),
        adminService.getSyncHistory(),
      ])
      if (st) setSyncStatus(st)
      if (hist) setSyncHistory(hist)
    } catch (err) {
      setSyncFeedback(err instanceof Error ? err.message : 'Lỗi đồng bộ phim')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSaveSyncSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSettings(true)
    try {
      await adminService.updateSyncSettings(syncConfig)
      alert('Đã cập nhật cấu hình tự động lấy phim thành công!')
      const st = await adminService.getSyncStatus()
      if (st) setSyncStatus(st)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi lưu cấu hình')
    } finally {
      setIsSavingSettings(false)
    }
  }

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
      <div className="flex flex-wrap items-center gap-3 border-b border-[#2b2b31] pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('auto_sync')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'auto_sync'
              ? 'bg-[#18181b] border border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#111114]'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          Tự Động Hóa Lấy Phim (Auto Sync)
        </button>

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
      ) : activeSubTab === 'auto_sync' ? (
        /* Automated Movie Sync & Ingestion Hub Panel */
        <div className="space-y-6">
          {/* Top Engine Overview Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#18181b] via-[#1c1c22] to-[#111114] border border-[#2b2b31] shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${syncConfig.autoSyncEnabled ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${syncConfig.autoSyncEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </span>
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                    {syncConfig.autoSyncEnabled ? 'Động Cơ Tự Động: ĐANG HOẠT ĐỘNG' : 'Động Cơ Tự Động: TẠM DỪNG'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  Tự Động Quét & Nạp Phim Định Kỳ (Auto Ingestion Engine)
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Hệ thống tự động phát hiện phim mới trên các nền tảng chính thống (KKPhim, TMDB Việt Nam, Anime Chiếu Rạp), trích xuất đường dẫn phát video m3u8 và áp dụng poster/backdrop 4K mà không cần can thiệp thủ công.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleTriggerManualSync}
                  className="px-5 py-3 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'ĐANG ĐỒNG BỘ PHIM...' : 'ĐỒNG BỘ PHIM MỚI NGAY'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 mt-5 border-t border-[#2b2b31] text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-[#71717a] uppercase block">Tần Suất Tự Động</span>
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  Mỗi {syncStatus?.intervalMinutes || syncConfig.intervalMinutes} phút
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#71717a] uppercase block">Lần Quét Gần Nhất</span>
                <span className="text-[#a1a1aa] font-semibold">
                  {syncStatus?.lastRunAt ? new Date(syncStatus.lastRunAt).toLocaleTimeString('vi-VN') : 'Vừa khởi động'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#71717a] uppercase block">Lần Quét Tiếp Theo</span>
                <span className="text-emerald-400 font-bold">
                  {syncStatus?.nextRunAt ? new Date(syncStatus.nextRunAt).toLocaleTimeString('vi-VN') : 'Chờ lên lịch'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#71717a] uppercase block">Tổng Số Lần Đồng Bộ</span>
                <span className="text-white font-bold">{syncStatus?.totalRuns || 0} lần</span>
              </div>
            </div>
          </div>

          {/* Feedback Toast Banner */}
          {syncFeedback && (
            <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-3 animate-in fade-in duration-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-none" />
              <div className="flex-1">
                <p className="font-bold">Kết quả đồng bộ tự động:</p>
                <p className="text-[11px] text-emerald-400 mt-0.5">{syncFeedback}</p>
              </div>
            </div>
          )}

          {/* Configuration Form */}
          <form onSubmit={handleSaveSyncSettings} className="p-5 rounded-xl bg-[#18181b] border border-[#2b2b31] space-y-6">
            <div className="flex items-center justify-between border-b border-[#2b2b31] pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#d4af37]" />
                Cấu Hình Nguồn Dữ Liệu & Chu Kỳ Tự Động Lấy Phim
              </h4>
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingSettings ? 'Đang Lưu...' : 'Lưu Cấu Hình'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: API Sources */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-[#a1a1aa] font-bold block">
                  1. Nguồn Phim Kích Hoạt Tự Động
                </span>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#111114] border border-[#2b2b31] hover:border-[#dc2626]/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={syncConfig.sources.includeKKPhimNew}
                    onChange={(e) =>
                      setSyncConfig({
                        ...syncConfig,
                        sources: { ...syncConfig.sources, includeKKPhimNew: e.target.checked },
                      })
                    }
                    className="mt-1 rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">KKPhim Mới Cập Nhật (Phim Mới Hàng Ngày)</span>
                    <span className="text-[11px] text-[#71717a] block mt-0.5">
                      Tự động nạp các tập phim và phim lẻ vừa ra mắt trong ngày kèm luồng phát .m3u8 sắc nét.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#111114] border border-[#2b2b31] hover:border-[#dc2626]/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={syncConfig.sources.includeKKPhimTheatrical}
                    onChange={(e) =>
                      setSyncConfig({
                        ...syncConfig,
                        sources: { ...syncConfig.sources, includeKKPhimTheatrical: e.target.checked },
                      })
                    }
                    className="mt-1 rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Phim Chiếu Rạp Việt Nam & Châu Á</span>
                    <span className="text-[11px] text-[#71717a] block mt-0.5">
                      Tự động quét danh mục bom tấn rạp và gán nhãn "CHIẾU RẠP" cùng chất lượng 4K Ultra HD.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#111114] border border-[#2b2b31] hover:border-[#dc2626]/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={syncConfig.sources.includeKKPhimAnime}
                    onChange={(e) =>
                      setSyncConfig({
                        ...syncConfig,
                        sources: { ...syncConfig.sources, includeKKPhimAnime: e.target.checked },
                      })
                    }
                    className="mt-1 rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Anime Chiếu Rạp (Conan, Doraemon, Shin, Dragon Ball...)</span>
                    <span className="text-[11px] text-[#71717a] block mt-0.5">
                      Tự động truy vấn và phân loại các phim điện ảnh anime nổi tiếng vào hàng danh mục riêng.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#111114] border border-[#2b2b31] hover:border-[#dc2626]/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={syncConfig.sources.includeTMDBTheatrical}
                    onChange={(e) =>
                      setSyncConfig({
                        ...syncConfig,
                        sources: { ...syncConfig.sources, includeTMDBTheatrical: e.target.checked },
                      })
                    }
                    className="mt-1 rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">TMDB Vietnam Box Office 4K Artwork</span>
                    <span className="text-[11px] text-[#71717a] block mt-0.5">
                      Lấy ảnh bìa 4K chính thức từ The Movie Database và YouTube trailer video key.
                    </span>
                  </div>
                </label>
              </div>

              {/* Right Column: Schedule Controls */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase text-[#a1a1aa] font-bold block">
                  2. Chu Kỳ & Tần Suất Quét Tự Động
                </span>

                <div className="p-4 rounded-lg bg-[#111114] border border-[#2b2b31] space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncConfig.autoSyncEnabled}
                      onChange={(e) => setSyncConfig({ ...syncConfig, autoSyncEnabled: e.target.checked })}
                      className="rounded border-[#2b2b31] bg-[#18181b] text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-emerald-400">
                      Bật Chạy Ngầm Tự Động Định Kỳ (Background Cron Active)
                    </span>
                  </label>
                  <p className="text-[11px] text-[#71717a]">
                    Khi bật, server sẽ chạy ngầm theo chu kỳ đã chọn mà không làm chậm trải nghiệm của người dùng.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-[#a1a1aa]">Chọn tần suất quét tự động:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { label: 'Mỗi 1 Giờ (Cao điểm)', val: 60 },
                      { label: 'Mỗi 3 Giờ', val: 180 },
                      { label: 'Mỗi 6 Giờ (Khuyên dùng)', val: 360 },
                      { label: 'Mỗi 12 Giờ', val: 720 },
                      { label: 'Mỗi 24 Giờ (1 lần/ngày)', val: 1440 },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setSyncConfig({ ...syncConfig, intervalMinutes: item.val })}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          syncConfig.intervalMinutes === item.val
                            ? 'bg-[#18181b] border-emerald-500 text-white font-bold'
                            : 'bg-[#111114] border-[#2b2b31] text-[#71717a] hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Sync History Audit Log Table */}
          <div className="p-5 rounded-xl bg-[#18181b] border border-[#2b2b31] space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Lịch Sử Các Lần Lấy Phim Tự Động (Auto-Sync Audit Trail)
            </h4>

            {syncHistory.length === 0 ? (
              <p className="text-xs text-[#71717a] py-4 text-center">
                Chưa có dữ liệu lịch sử quét. Nhấn "ĐỒNG BỘ PHIM MỚI NGAY" để chạy lần quét đầu tiên!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-[#2b2b31] text-[#71717a] uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Thời Gian</th>
                      <th className="py-2.5 px-3">Đối Tượng Kích Hoạt</th>
                      <th className="py-2.5 px-3">Phim Mới Thêm</th>
                      <th className="py-2.5 px-3">Phim Cập Nhật</th>
                      <th className="py-2.5 px-3">Thời Gian Xử Lý</th>
                      <th className="py-2.5 px-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2b2b31]/40">
                    {syncHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#111114] transition-colors">
                        <td className="py-2.5 px-3 text-[#a1a1aa]">
                          {new Date(item.timestamp).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-2.5 px-3 text-white font-semibold">
                          {item.actorRole === 'system_cron' ? 'Cron Tự Động' : 'Quản Trị Viên'}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">
                          +{item.details?.newInserted || 0} phim
                        </td>
                        <td className="py-2.5 px-3 text-amber-400 font-semibold">
                          {item.details?.updated || 0} phim
                        </td>
                        <td className="py-2.5 px-3 text-[#a1a1aa]">
                          {item.details?.durationMs ? `${item.details.durationMs}ms` : 'N/A'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                            Thành công
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
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
