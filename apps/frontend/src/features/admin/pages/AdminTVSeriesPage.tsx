import React, { useState, useEffect, useCallback } from 'react'
import {
  Tv,
  Film,
  Plus,
  Search,
  Layers,
  PlayCircle,
  Trash2,
  Edit,
  CheckCircle,
  ChevronRight,
  X,
  AlertCircle,
} from 'lucide-react'
import { adminService } from '../services/adminService'
import { adminApi } from '../services/adminApiClient'
import type { AdminMovieItem } from '../types/admin'

interface SeasonItem {
  id: string
  seasonNumber: number
  title: string
  overview?: string
  episodes: EpisodeItem[]
}

interface EpisodeItem {
  id: string
  episodeNumber: number
  title: string
  overview?: string
  durationMinutes?: number
  thumbnailUrl?: string
  sources: Array<{
    id: string
    serverName: string
    streamUrl: string
    quality: string
    isVipOnly: boolean
  }>
}

export const AdminTVSeriesPage: React.FC = () => {
  const [seriesList, setSeriesList] = useState<AdminMovieItem[]>([])
  const [selectedSeries, setSelectedSeries] = useState<AdminMovieItem | null>(null)
  const [seasons, setSeasons] = useState<SeasonItem[]>([])
  const [selectedSeason, setSelectedSeason] = useState<SeasonItem | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  // Episode modal state
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState<boolean>(false)
  const [editingEpisode, setEditingEpisode] = useState<EpisodeItem | null>(null)
  const [episodeForm, setEpisodeForm] = useState({
    episodeNumber: 1,
    title: '',
    durationMinutes: 45,
    thumbnailUrl: '',
    streamUrl: '',
    serverName: 'HLS CDN Cloudflare (Primary)',
    quality: '1080p Full HD',
    isVipOnly: false,
  })

  // Load TV series
  const loadSeries = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getMovies({
        page: 1,
        limit: 50,
        type: 'tv_series',
        search,
      })
      setSeriesList(data.movies)
      if (data.movies.length > 0 && !selectedSeries) {
        setSelectedSeries(data.movies[0])
      }
    } catch (err) {
      console.error('[AdminTVSeriesPage Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [search, selectedSeries])

  useEffect(() => {
    loadSeries()
  }, [loadSeries])

  // Load seasons & episodes when a series is selected
  const loadSeasons = useCallback(async (seriesId: string) => {
    try {
      const res = await adminApi.get<{
        success: boolean
        data: { seasons: SeasonItem[] }
      }>(`admin/movies/${seriesId}/seasons`)
      setSeasons(res.data.seasons || [])
      if (res.data.seasons?.length > 0) {
        setSelectedSeason(res.data.seasons[0])
      } else {
        setSelectedSeason(null)
      }
    } catch {
      // Fallback if no seasons found yet
      setSeasons([])
      setSelectedSeason(null)
    }
  }, [])

  useEffect(() => {
    if (selectedSeries) {
      loadSeasons(selectedSeries.id)
    }
  }, [selectedSeries, loadSeasons])

  const handleCreateSeason = async () => {
    if (!selectedSeries) return
    const nextNum = seasons.length + 1
    try {
      await adminApi.post(`admin/movies/${selectedSeries.id}/seasons`, {
        seasonNumber: nextNum,
        title: `Phần ${nextNum} - Season ${nextNum}`,
      })
      loadSeasons(selectedSeries.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể tạo season')
    }
  }

  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeries || !selectedSeason) return
    try {
      if (editingEpisode) {
        await adminApi.put(
          `admin/movies/${selectedSeries.id}/seasons/${selectedSeason.id}/episodes/${editingEpisode.id}`,
          {
            episodeNumber: episodeForm.episodeNumber,
            title: episodeForm.title,
            durationMinutes: episodeForm.durationMinutes,
            thumbnailUrl: episodeForm.thumbnailUrl,
            streamUrl: episodeForm.streamUrl,
            serverName: episodeForm.serverName,
            quality: episodeForm.quality,
            isVipOnly: episodeForm.isVipOnly,
          }
        )
      } else {
        await adminApi.post(
          `admin/movies/${selectedSeries.id}/seasons/${selectedSeason.id}/episodes`,
          {
            episodeNumber: episodeForm.episodeNumber,
            title: episodeForm.title,
            durationMinutes: episodeForm.durationMinutes,
            thumbnailUrl: episodeForm.thumbnailUrl,
            streamUrl: episodeForm.streamUrl,
            serverName: episodeForm.serverName,
            quality: episodeForm.quality,
            isVipOnly: episodeForm.isVipOnly,
          }
        )
      }
      setIsEpisodeModalOpen(false)
      setEditingEpisode(null)
      loadSeasons(selectedSeries.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể lưu tập phim')
    }
  }

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!selectedSeries || !selectedSeason) return
    if (!window.confirm('Xác nhận xóa tập phim này?')) return
    try {
      await adminApi.delete(
        `admin/movies/${selectedSeries.id}/seasons/${selectedSeason.id}/episodes/${episodeId}`
      )
      loadSeasons(selectedSeries.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi xóa tập')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b2b31] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#fafafa] flex items-center gap-2.5">
            <Tv className="w-5 h-5 text-[#dc2626]" />
            Quản Lý TV Series, Mùa & Tập Phim
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Quản trị cấu trúc đa mùa (Seasons), danh sách tập (Episodes) và nguồn phát trực tiếp HLS (.m3u8).
          </p>
        </div>
      </div>

      {/* Main 3-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: TV Series List (3 cols) */}
        <div className="lg:col-span-3 bg-[#111114] border border-[#2b2b31] rounded-lg p-4 flex flex-col space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
            <input
              type="text"
              placeholder="Tìm phim bộ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white placeholder-[#71717a] focus:border-[#dc2626] focus:outline-none"
            />
          </div>

          <div className="text-[11px] font-mono text-[#71717a] uppercase font-bold tracking-wider px-1">
            Danh Sách TV Series ({seriesList.length})
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[550px]">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-[#71717a]">Đang tải dữ liệu...</div>
            ) : seriesList.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#71717a]">
                Không có phim bộ nào. Hãy thêm phim mới trong mục Phim Điện Ảnh với định dạng TV Series.
              </div>
            ) : (
              seriesList.map((s) => {
                const isSelected = selectedSeries?.id === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSeries(s)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#18181b] border-[#dc2626] shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                        : 'bg-[#141417] border-[#2b2b31]/60 hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="w-10 h-14 bg-[#202024] rounded shrink-0 overflow-hidden">
                      {s.posterUrl ? (
                        <img src={s.posterUrl} alt={s.titleVi} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#71717a]">
                          <Film className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{s.titleVi}</h4>
                      <p className="text-[11px] text-[#71717a] truncate">{s.titleOrigin || 'N/A'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-[#d4af37]">{s.releaseYear}</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          ★ {s.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-[#71717a] ${isSelected ? 'text-[#dc2626]' : ''}`} />
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Center & Right Column: Seasons & Episodes (9 cols) */}
        <div className="lg:col-span-9 flex flex-col space-y-5">
          {selectedSeries ? (
            <>
              {/* Selected Series Header Card */}
              <div className="bg-[#111114] border border-[#2b2b31] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 rounded overflow-hidden bg-[#202024] shrink-0">
                    <img
                      src={selectedSeries.posterUrl || ''}
                      alt={selectedSeries.titleVi}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      {selectedSeries.titleVi}
                      <span className="text-xs font-normal text-[#a1a1aa]">({selectedSeries.releaseYear})</span>
                    </h2>
                    <p className="text-xs text-[#71717a] line-clamp-1 mt-0.5">
                      {selectedSeries.synopsis || 'Chưa có tóm tắt cốt truyện.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateSeason}
                  className="px-3.5 py-1.5 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Mùa (Season)
                </button>
              </div>

              {/* Seasons Tab Bar */}
              <div className="flex items-center gap-2 border-b border-[#2b2b31] pb-2 overflow-x-auto">
                {seasons.length === 0 ? (
                  <span className="text-xs text-[#71717a] py-1">Chưa có Season nào. Nhấn "+ Thêm Mùa" để bắt đầu.</span>
                ) : (
                  seasons.map((season) => {
                    const isSelected = selectedSeason?.id === season.id
                    return (
                      <button
                        key={season.id}
                        type="button"
                        onClick={() => setSelectedSeason(season)}
                        className={`px-4 py-2 rounded-t-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border-b-2 ${
                          isSelected
                            ? 'border-[#dc2626] text-white bg-[#18181b]'
                            : 'border-transparent text-[#a1a1aa] hover:text-white hover:bg-[#141417]'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                        Mùa {season.seasonNumber}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#202024] text-[#a1a1aa]">
                          {season.episodes?.length || 0} tập
                        </span>
                      </button>
                    )
                  })
                )}
              </div>

              {/* Episode List in Active Season */}
              {selectedSeason ? (
                <div className="bg-[#111114] border border-[#2b2b31] rounded-lg p-5 flex-1 flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        Danh Sách Tập Phim — {selectedSeason.title || `Mùa ${selectedSeason.seasonNumber}`}
                      </h3>
                      <p className="text-xs text-[#71717a]">
                        Tổng cộng {selectedSeason.episodes?.length || 0} tập phát sóng
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingEpisode(null)
                        setEpisodeForm({
                          episodeNumber: (selectedSeason.episodes?.length || 0) + 1,
                          title: `Tập ${(selectedSeason.episodes?.length || 0) + 1}`,
                          durationMinutes: 45,
                          thumbnailUrl: '',
                          streamUrl: '',
                          serverName: 'HLS CDN Cloudflare (Primary)',
                          quality: '1080p Full HD',
                          isVipOnly: false,
                        })
                        setIsEpisodeModalOpen(true)
                      }}
                      className="px-3 py-1.5 rounded-md bg-[#202024] hover:bg-[#27272a] border border-[#2b2b31] text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                      Thêm Tập Mới
                    </button>
                  </div>

                  {/* Episodes Table / Cards */}
                  <div className="space-y-2">
                    {!selectedSeason.episodes || selectedSeason.episodes.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#71717a] border border-dashed border-[#2b2b31] rounded-lg">
                        Mùa này chưa có tập phim nào. Nhấn "+ Thêm Tập Mới" để tạo tập 1 và dán link stream .m3u8.
                      </div>
                    ) : (
                      selectedSeason.episodes.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#18181b] border border-[#2b2b31] hover:border-[#3f3f46] transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#202024] flex items-center justify-center font-mono font-bold text-xs text-[#d4af37] border border-[#2b2b31]">
                              {ep.episodeNumber}
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                                {ep.title}
                                <span className="text-[10px] font-mono text-[#71717a]">
                                  ({ep.durationMinutes || 45} phút)
                                </span>
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {ep.sources && ep.sources.length > 0 ? (
                                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    {ep.sources.length} Nguồn Stream ({ep.sources[0]?.serverName})
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Chưa gắn link stream
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEpisode(ep)
                                setEpisodeForm({
                                  episodeNumber: ep.episodeNumber,
                                  title: ep.title,
                                  durationMinutes: ep.durationMinutes || 45,
                                  thumbnailUrl: ep.thumbnailUrl || '',
                                  streamUrl: ep.sources?.[0]?.streamUrl || '',
                                  serverName: ep.sources?.[0]?.serverName || 'HLS CDN Cloudflare (Primary)',
                                  quality: ep.sources?.[0]?.quality || '1080p Full HD',
                                  isVipOnly: ep.sources?.[0]?.isVipOnly || false,
                                })
                                setIsEpisodeModalOpen(true)
                              }}
                              className="p-1.5 rounded hover:bg-[#202024] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                              title="Chỉnh sửa tập"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEpisode(ep.id)}
                              className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                              title="Xóa tập"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="bg-[#111114] border border-[#2b2b31] rounded-lg p-12 text-center text-xs text-[#71717a]">
              Chọn một TV Series từ danh sách bên trái để quản lý danh sách mùa và tập phim.
            </div>
          )}
        </div>
      </div>

      {/* Episode Edit/Add Modal */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111114] border border-[#2b2b31] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2b2b31] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-[#dc2626]" />
                {editingEpisode ? 'Chỉnh Sửa Tập Phim' : 'Thêm Tập Phim Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEpisodeModalOpen(false)}
                className="text-[#71717a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEpisode} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Số Tập</label>
                  <input
                    type="number"
                    min={1}
                    value={episodeForm.episodeNumber}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, episodeNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Tiêu Đề Tập</label>
                  <input
                    type="text"
                    value={episodeForm.title}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                    placeholder="VD: Tập 1: Điểm Khởi Đầu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Thời Lượng (Phút)</label>
                <input
                  type="number"
                  min={1}
                  value={episodeForm.durationMinutes}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, durationMinutes: parseInt(e.target.value) || 45 })}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">URL Stream HLS (.m3u8)</label>
                <input
                  type="url"
                  value={episodeForm.streamUrl}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, streamUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none font-mono"
                  placeholder="https://stream.server.com/live/master.m3u8"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Tên Video Server</label>
                  <select
                    value={episodeForm.serverName}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, serverName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  >
                    <option value="HLS CDN Cloudflare (Primary)">HLS CDN Cloudflare (Primary)</option>
                    <option value="Fastly Edge CDN">Fastly Edge CDN</option>
                    <option value="KKPhim Public Mirror">KKPhim Public Mirror</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Độ Phân Giải</label>
                  <select
                    value={episodeForm.quality}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, quality: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  >
                    <option value="4K ULTRA HD">4K ULTRA HD</option>
                    <option value="1080p Full HD">1080p Full HD</option>
                    <option value="720p HD">720p HD</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="vipOnly"
                  checked={episodeForm.isVipOnly}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, isVipOnly: e.target.checked })}
                  className="rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="vipOnly" className="text-xs text-[#fafafa] font-medium cursor-pointer">
                  Chỉ dành riêng cho thành viên VIP
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2b2b31]">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-[#18181b] text-xs font-semibold text-[#a1a1aa] hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-semibold text-white shadow-lg cursor-pointer"
                >
                  {editingEpisode ? 'Cập Nhật Tập' : 'Thêm Tập Phim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
