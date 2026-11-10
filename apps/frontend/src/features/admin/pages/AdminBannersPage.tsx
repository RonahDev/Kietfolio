import React, { useState, useEffect, useCallback } from 'react'
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Film,
  X,
} from 'lucide-react'
import { adminService } from '../services/adminService'

export const AdminBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    mobileImageUrl: '',
    linkUrl: '',
    movieId: '',
    displayOrder: 0,
    isActive: true,
  })

  const loadBanners = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getBanners()
      setBanners(data)
    } catch (err) {
      console.error('[AdminBanners Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBanners()
  }, [loadBanners])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await adminService.createBanner(formData)
      setIsModalOpen(false)
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        mobileImageUrl: '',
        linkUrl: '',
        movieId: '',
        displayOrder: 0,
        isActive: true,
      })
      loadBanners()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi tạo banner')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xác nhận xóa banner "${title}"?`)) return
    try {
      await adminService.deleteBanner(id)
      loadBanners()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi xóa banner')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b2b31] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#fafafa] flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-[#dc2626]" />
            Quản Lý Banner & Hero Spotlight Trang Chủ
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Điều chỉnh các banner xoay vòng nổi bật (Hero Carousel) hiển thị ở đầu trang Movie Hub.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Thêm Banner Nổi Bật
        </button>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#71717a]">Đang tải danh sách banner...</div>
      ) : banners.length === 0 ? (
        <div className="bg-[#111114] border border-[#2b2b31] rounded-lg p-12 text-center text-xs text-[#71717a]">
          Chưa có banner nào. Nhấn "+ Thêm Banner Nổi Bật" để tạo slide đầu tiên.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-[#111114] border border-[#2b2b31] rounded-xl overflow-hidden hover:border-[#3f3f46] transition-all flex flex-col group"
            >
              <div className="relative aspect-video w-full bg-[#18181b] overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-[#d4af37] border border-[#d4af37]/40">
                    Vị trí: {banner.displayOrder}
                  </span>
                  {banner.isActive ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400">
                      Ẩn
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#dc2626] transition-colors">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-2">
                    {banner.subtitle || 'Không có mô tả phụ.'}
                  </p>
                  {banner.movie && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#d4af37]">
                      <Film className="w-3.5 h-3.5" />
                      Gắn với: {banner.movie.titleVi}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#202024]">
                  <span className="text-[10px] font-mono text-[#71717a]">
                    ID: {banner.id.slice(0, 8)}...
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id, banner.title)}
                    className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Xóa banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111114] border border-[#2b2b31] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2b2b31] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#dc2626]" />
                Tạo Banner Trang Chủ Mới
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#71717a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Tiêu Đề Banner *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  placeholder="VD: DUNE: PHẦN HAI - ĐỈNH CAO HOÀN MỸ"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Mô Tả / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  placeholder="VD: Bản 4K Dolby Atmos độc quyền trải nghiệm chiếu rạp tại gia."
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Ảnh Backdrop 4K (16:9) *</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none font-mono"
                  placeholder="https://image.tmdb.org/t/p/original/..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Thứ Tự Hiển Thị</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">ID Phim Liên Kết (Tùy chọn)</label>
                  <input
                    type="text"
                    value={formData.movieId}
                    onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none font-mono"
                    placeholder="movie-slug hoặc UUID"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-[#2b2b31] bg-[#18181b] text-[#dc2626] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="bannerActive" className="text-xs text-[#fafafa] font-medium cursor-pointer">
                  Kích hoạt hiển thị ngay lập tức
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2b2b31]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-[#18181b] text-xs font-semibold text-[#a1a1aa] hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-semibold text-white shadow-lg cursor-pointer"
                >
                  Tạo Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
