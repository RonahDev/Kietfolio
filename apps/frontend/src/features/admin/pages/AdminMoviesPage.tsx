import React, { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Star,
  X,
  RefreshCw,
} from 'lucide-react'
import { adminService } from '../services/adminService'
import type { AdminMovieItem } from '../types/admin'

export const AdminMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<AdminMovieItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [theatricalFilter, setTheatricalFilter] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingMovie, setEditingMovie] = useState<AdminMovieItem | null>(null)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const handleTriggerSync = async () => {
    setIsSyncing(true)
    setSyncMessage(null)
    try {
      const res = await adminService.triggerSyncNow()
      setSyncMessage(res.message || 'Đồng bộ phim thành công!')
      await loadMovies()
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : 'Lỗi đồng bộ phim')
    } finally {
      setIsSyncing(false)
    }
  }

  // Form states
  const [formData, setFormData] = useState({
    titleVi: '',
    titleOrigin: '',
    slug: '',
    type: 'movie' as 'movie' | 'tv_series',
    releaseYear: 2026,
    rating: 8.5,
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    videoStreamUrl: '',
    director: '',
    status: 'published' as 'published' | 'draft' | 'hidden' | 'scheduled',
    isTheatrical: false,
    synopsis: '',
  })

  const loadMovies = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getMovies({
        page,
        limit: 12,
        search,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        isTheatrical: theatricalFilter ? true : undefined,
      })
      setMovies(data.movies)
      setTotalCount(data.pagination.total)
    } catch (err) {
      console.error('[AdminMoviesPage Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, typeFilter, statusFilter, theatricalFilter])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  const handleOpenCreate = () => {
    setEditingMovie(null)
    setFormData({
      titleVi: '',
      titleOrigin: '',
      slug: '',
      type: 'movie',
      releaseYear: 2026,
      rating: 8.5,
      quality: '4K ULTRA HD',
      audio: 'DOLBY ATMOS',
      posterUrl: '',
      backdropUrl: '',
      trailerUrl: '',
      videoStreamUrl: '',
      director: '',
      status: 'published',
      isTheatrical: false,
      synopsis: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (movie: AdminMovieItem) => {
    setEditingMovie(movie)
    setFormData({
      titleVi: movie.titleVi,
      titleOrigin: movie.titleOrigin || '',
      slug: movie.slug,
      type: movie.type,
      releaseYear: movie.releaseYear,
      rating: movie.rating,
      quality: movie.quality,
      audio: movie.audio,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      trailerUrl: movie.trailerUrl || '',
      videoStreamUrl: movie.videoStreamUrl || '',
      director: movie.director || '',
      status: movie.status,
      isTheatrical: movie.isTheatrical,
      synopsis: movie.synopsis || '',
    })
    setIsModalOpen(true)
  }

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingMovie) {
        await adminService.updateMovie(editingMovie.id, formData)
      } else {
        await adminService.createMovie(formData)
      }
      setIsModalOpen(false)
      loadMovies()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi lưu phim')
    }
  }

  const handleDeleteMovie = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bộ phim "${title}" không?`)) return
    try {
      await adminService.deleteMovie(id)
      loadMovies()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi xóa phim')
    }
  }

  const handleToggleSelectAll = () => {
    if (selectedMovieIds.length === movies.length) {
      setSelectedMovieIds([])
    } else {
      setSelectedMovieIds(movies.map((m) => m.id))
    }
  }

  const handleBulkPublish = async (status: 'published' | 'hidden') => {
    if (!selectedMovieIds.length) return
    try {
      await adminService.bulkUpdateStatus(selectedMovieIds, status)
      setSelectedMovieIds([])
      loadMovies()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật hàng loạt')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
            Quản Lý Phim Điện Ảnh & Chiếu Rạp
          </h3>
          <p className="text-xs font-mono text-[#a1a1aa]">
            Kho nội dung phim 4K, phim chiếu rạp Việt Nam và metadata đồng bộ TMDb
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleTriggerSync}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#18181b] hover:bg-[#202024] border border-emerald-500/50 hover:border-emerald-500 text-emerald-400 font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            title="Kích hoạt tự động lấy phim mới từ KKPhim & TMDB ngay lập tức"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'ĐANG ĐỒNG BỘ...' : 'ĐỒNG BỘ PHIM MỚI'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#dc2626] to-[#7f1d1d] hover:opacity-95 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM PHIM MỚI</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-300">
          <span>{syncMessage}</span>
          <button
            type="button"
            onClick={() => setSyncMessage(null)}
            className="text-emerald-400 hover:text-white cursor-pointer px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 rounded-lg bg-[#18181b] border border-[#2b2b31] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111114] border border-[#2b2b31] text-white w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#71717a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Tìm tên phim, slug..."
              className="bg-transparent outline-none text-xs text-white placeholder-[#71717a] w-full"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-1.5 rounded-md bg-[#111114] border border-[#2b2b31] text-[#fafafa] outline-none cursor-pointer"
          >
            <option value="all">Tất cả định dạng</option>
            <option value="movie">Phim Lẻ (Movie)</option>
            <option value="tv_series">Phim Bộ (TV Series)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-1.5 rounded-md bg-[#111114] border border-[#2b2b31] text-[#fafafa] outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã Xuất Bản</option>
            <option value="draft">Bản Nháp</option>
            <option value="hidden">Đang Ẩn</option>
          </select>

          {/* Theatrical Filter Button */}
          <button
            type="button"
            onClick={() => {
              setTheatricalFilter(!theatricalFilter)
              setPage(1)
            }}
            className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all cursor-pointer ${
              theatricalFilter
                ? 'bg-[#d4af37] text-black border-[#d4af37]'
                : 'bg-[#111114] text-[#a1a1aa] border-[#2b2b31] hover:text-white'
            }`}
          >
            ⭐ Chiếu Rạp VN
          </button>
        </div>

        {/* Bulk Action Buttons */}
        {selectedMovieIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[#a1a1aa] text-[11px]">Đã chọn {selectedMovieIds.length}</span>
            <button
              type="button"
              onClick={() => handleBulkPublish('published')}
              className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
            >
              Xuất Bản
            </button>
            <button
              type="button"
              onClick={() => handleBulkPublish('hidden')}
              className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
            >
              Ẩn
            </button>
          </div>
        )}
      </div>

      {/* Movies Table */}
      <div className="rounded-lg bg-[#18181b] border border-[#2b2b31] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111114] text-[#71717a] uppercase text-[10px] border-b border-[#2b2b31]">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedMovieIds.length === movies.length && movies.length > 0}
                    onChange={handleToggleSelectAll}
                    className="accent-[#dc2626] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Poster</th>
                <th className="py-3 px-3">Tên Phim / Tên Gốc</th>
                <th className="py-3 px-3">Định Dạng</th>
                <th className="py-3 px-3">Năm</th>
                <th className="py-3 px-3">Điểm</th>
                <th className="py-3 px-3">Lượt Xem</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202024] text-[#fafafa]">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#71717a]">
                    Đang tải dữ liệu phim từ hệ thống...
                  </td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#71717a]">
                    Không tìm thấy bộ phim nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                movies.map((m) => (
                  <tr key={m.id} className="hover:bg-[#202024]/60 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedMovieIds.includes(m.id)}
                        onChange={() => {
                          setSelectedMovieIds((prev) =>
                            prev.includes(m.id) ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                          )
                        }}
                        className="accent-[#dc2626] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <img
                        src={m.posterUrl}
                        alt={m.titleVi}
                        referrerPolicy="no-referrer"
                        className="w-10 h-14 object-cover rounded-sm border border-[#2b2b31]"
                      />
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] truncate">
                        {m.titleVi}
                      </div>
                      <div className="text-[11px] text-[#a1a1aa] truncate">{m.titleOrigin || m.slug}</div>
                      {m.isTheatrical && (
                        <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-xs bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                          CHIẾU RẠP VN
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 uppercase text-[11px] text-[#a1a1aa]">
                      {m.type === 'tv_series' ? 'TV Series' : 'Phim Lẻ'}
                    </td>
                    <td className="py-3 px-3 text-[#fafafa]">{m.releaseYear}</td>
                    <td className="py-3 px-3 text-[#d4af37] font-bold flex items-center gap-1 mt-4">
                      <Star className="w-3 h-3 fill-[#d4af37]" />
                      <span>{m.rating}</span>
                    </td>
                    <td className="py-3 px-3 text-[#a1a1aa]">{m.viewCount.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'draft'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {m.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded hover:bg-[#202024] text-[#a1a1aa] hover:text-[#00d2ff] transition-colors cursor-pointer"
                          title="Sửa thông tin phim"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMovie(m.id, m.titleVi)}
                          className="p-1.5 rounded hover:bg-rose-950/40 text-[#a1a1aa] hover:text-rose-400 transition-colors cursor-pointer"
                          title="Xóa phim"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-3 bg-[#111114] border-t border-[#2b2b31] flex items-center justify-between text-xs font-mono text-[#a1a1aa]">
          <span>Tổng số: {totalCount} phim</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1 rounded bg-[#18181b] border border-[#2b2b31] disabled:opacity-40 cursor-pointer"
            >
              Trước
            </button>
            <span className="text-white font-bold">Trang {page}</span>
            <button
              type="button"
              disabled={movies.length < 12}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 rounded bg-[#18181b] border border-[#2b2b31] disabled:opacity-40 cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Movie */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#111114] border border-[#2b2b31] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#2b2b31] flex items-center justify-between">
              <h4 className="font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] text-base">
                {editingMovie ? 'Chỉnh Sửa Phim: ' + editingMovie.titleVi : 'Thêm Phim Điện Ảnh Mới'}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded hover:bg-[#202024] text-[#a1a1aa] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="p-6 overflow-y-auto space-y-4 text-xs font-mono flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">TÊN TIẾNG VIỆT *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleVi}
                    onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">TÊN GỐC (ORIGINAL TITLE)</label>
                  <input
                    type="text"
                    value={formData.titleOrigin}
                    onChange={(e) => setFormData({ ...formData, titleOrigin: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">ĐƯỜNG DẪN SLUG *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="oppenheimer-2023"
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">ĐỊNH DẠNG</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none"
                  >
                    <option value="movie">Phim Lẻ (Movie)</option>
                    <option value="tv_series">TV Series (Phim Bộ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">POSTER URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">BACKDROP URL 4K *</label>
                  <input
                    type="url"
                    required
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">LINK STREAM HLS (.M3U8)</label>
                  <input
                    type="url"
                    value={formData.videoStreamUrl}
                    onChange={(e) => setFormData({ ...formData, videoStreamUrl: e.target.value })}
                    placeholder="https://.../index.m3u8"
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">TRAILER YOUTUBE URL</label>
                  <input
                    type="url"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">NĂM PHÁT HÀNH</label>
                  <input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a1a1aa]">ĐIỂM ĐÁNH GIÁ (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTheatrical}
                    onChange={(e) => setFormData({ ...formData, isTheatrical: e.target.checked })}
                    className="accent-[#d4af37]"
                  />
                  <span className="text-[#d4af37] font-bold">Phim Chiếu Rạp Việt Nam</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-[#a1a1aa]">TRẠNG THÁI:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-2 py-1 rounded bg-[#18181b] border border-[#2b2b31] text-white"
                  >
                    <option value="published">Xuất Bản (Published)</option>
                    <option value="draft">Bản Nháp (Draft)</option>
                    <option value="hidden">Ẩn (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#a1a1aa]">TÓM TẮT NỘI DUNG (SYNOPSIS)</label>
                <textarea
                  rows={3}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-white outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="pt-4 border-t border-[#2b2b31] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#18181b] border border-[#2b2b31] text-[#a1a1aa] hover:text-white"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold"
                >
                  {editingMovie ? 'CẬP NHẬT PHIM' : 'LƯU PHIM MỚI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
