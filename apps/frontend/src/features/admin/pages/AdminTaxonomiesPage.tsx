import React, { useState, useEffect, useCallback } from 'react'
import {
  Tags,
  Layers,
  Plus,
  Trash2,
  FolderPlus,
  Film,
  Search,
  CheckCircle,
  X,
} from 'lucide-react'
import { adminService } from '../services/adminService'

interface AdminTaxonomiesPageProps {
  initialTab?: 'genres' | 'categories'
}

export const AdminTaxonomiesPage: React.FC<AdminTaxonomiesPageProps> = ({ initialTab = 'genres' }) => {
  const [activeTab, setActiveTab] = useState<'genres' | 'categories'>(initialTab)
  const [genres, setGenres] = useState<Array<{ id: string; nameVi: string; nameEn: string; slug: string; movieCount: number }>>([])
  const [categories, setCategories] = useState<Array<{ id: string; nameVi: string; nameEn: string; slug: string; displayOrder: number; isActive: boolean; movieCount: number }>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  // Create Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [formVi, setFormVi] = useState('')
  const [formEn, setFormEn] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formOrder, setFormOrder] = useState(0)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      if (activeTab === 'genres') {
        const data = await adminService.getGenres()
        setGenres(data)
      } else {
        const data = await adminService.getCategories()
        setCategories(data)
      }
    } catch (err) {
      console.error('[AdminTaxonomies Error]:', err)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSlugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const generatedSlug = formSlug || handleSlugify(formVi)
      const generatedId = generatedSlug

      if (activeTab === 'genres') {
        await adminService.createGenre({
          id: generatedId,
          nameVi: formVi,
          nameEn: formEn || undefined,
          slug: generatedSlug,
        })
      } else {
        await adminService.createCategory({
          id: generatedId,
          nameVi: formVi,
          nameEn: formEn || undefined,
          slug: generatedSlug,
          displayOrder: formOrder,
        })
      }

      setIsModalOpen(false)
      setFormVi('')
      setFormEn('')
      setFormSlug('')
      setFormOrder(0)
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi tạo dữ liệu')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xác nhận xóa "${name}"?`)) return
    try {
      if (activeTab === 'genres') {
        await adminService.deleteGenre(id)
      } else {
        await adminService.deleteCategory(id)
      }
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi xóa')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2b2b31] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#fafafa] flex items-center gap-2.5">
            {activeTab === 'genres' ? (
              <Tags className="w-5 h-5 text-[#dc2626]" />
            ) : (
              <Layers className="w-5 h-5 text-[#d4af37]" />
            )}
            Quản Lý Thể Loại & Danh Mục Phim
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Thiết lập danh mục phân loại phim, bộ sưu tập độc quyền và taxonomy tìm kiếm hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormVi('')
            setFormEn('')
            setFormSlug('')
            setFormOrder(0)
            setIsModalOpen(true)
          }}
          className="px-4 py-2 rounded-md bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'genres' ? 'Thêm Thể Loại Mới' : 'Thêm Danh Mục Mới'}
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-[#2b2b31] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('genres')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'genres'
              ? 'bg-[#18181b] border border-[#dc2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#111114]'
          }`}
        >
          <Tags className="w-4 h-4 text-[#dc2626]" />
          Thể Loại Phim (Genres)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#18181b] border border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#111114]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#d4af37]" />
          Danh Mục & Bộ Sưu Tập (Categories)
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input
            type="text"
            placeholder={`Tìm kiếm ${activeTab === 'genres' ? 'thể loại' : 'danh mục'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#111114] border border-[#2b2b31] rounded-lg text-xs text-white placeholder-[#71717a] focus:border-[#dc2626] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#71717a]">Đang tải danh sách...</div>
      ) : activeTab === 'genres' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres
            .filter((g) => g.nameVi.toLowerCase().includes(search.toLowerCase()) || g.slug.includes(search.toLowerCase()))
            .map((genre) => (
              <div
                key={genre.id}
                className="bg-[#111114] border border-[#2b2b31] rounded-lg p-4 flex flex-col justify-between hover:border-[#3f3f46] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#71717a]">{genre.id}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      {genre.movieCount} phim
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-[#dc2626] transition-colors">
                    {genre.nameVi}
                  </h3>
                  <p className="text-xs text-[#71717a] mt-0.5">{genre.nameEn || 'N/A'}</p>
                  <p className="text-[11px] font-mono text-[#a1a1aa] mt-2">slug: {genre.slug}</p>
                </div>

                <div className="flex items-center justify-end pt-3 mt-3 border-t border-[#202024]">
                  <button
                    type="button"
                    onClick={() => handleDelete(genre.id, genre.nameVi)}
                    className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Xóa thể loại"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories
            .filter((c) => c.nameVi.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search.toLowerCase()))
            .map((cat) => (
              <div
                key={cat.id}
                className="bg-[#111114] border border-[#2b2b31] rounded-lg p-4 flex flex-col justify-between hover:border-[#3f3f46] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202024] text-[#d4af37]">
                      Thứ tự: {cat.displayOrder}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      {cat.movieCount} phim
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2 group-hover:text-[#d4af37] transition-colors">
                    {cat.nameVi}
                  </h3>
                  <p className="text-xs text-[#71717a] mt-0.5">{cat.nameEn || 'N/A'}</p>
                  <p className="text-[11px] font-mono text-[#a1a1aa] mt-2">slug: {cat.slug}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#202024]">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Đang hiển thị
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.nameVi)}
                    className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Xóa danh mục"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111114] border border-[#2b2b31] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2b2b31] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#dc2626]" />
                {activeTab === 'genres' ? 'Tạo Thể Loại Phim Mới' : 'Tạo Danh Mục Mới'}
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
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Tên Tiếng Việt *</label>
                <input
                  type="text"
                  value={formVi}
                  onChange={(e) => {
                    setFormVi(e.target.value)
                    if (!formSlug) setFormSlug(handleSlugify(e.target.value))
                  }}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  placeholder="VD: Hành Động, Khoa Học Viễn Tưởng..."
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Tên Tiếng Anh</label>
                <input
                  type="text"
                  value={formEn}
                  onChange={(e) => setFormEn(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  placeholder="VD: Action, Sci-Fi..."
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Slug URL</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none font-mono"
                  placeholder="hanh-dong"
                  required
                />
              </div>

              {activeTab === 'categories' && (
                <div>
                  <label className="text-[11px] font-mono text-[#a1a1aa] block mb-1">Thứ Tự Hiển Thị</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#2b2b31] rounded-md text-xs text-white focus:border-[#dc2626] focus:outline-none"
                  />
                </div>
              )}

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
                  Xác Nhận Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
