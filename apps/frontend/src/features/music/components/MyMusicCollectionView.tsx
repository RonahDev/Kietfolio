import React, { useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ImagePlus,
  ListMusic,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { useMusicTheater } from '../hooks/useMusicTheater'
import { useMusicI18n } from '../hooks/useMusicI18n'
import type { MusicPlaylist, MusicTrack } from '../types/music'
import { MusicImportDropzone } from './MusicImportModal'
import { MusicTrackList } from './MusicTrackList'

interface PlaylistFormModalProps {
  existing?: MusicPlaylist | null
  onClose: () => void
  onSave: (data: { name: string; description: string; coverUrl?: string }) => Promise<void>
}

const PlaylistFormModal: React.FC<PlaylistFormModalProps> = ({ existing, onClose, onSave }) => {
  const { language, t } = useMusicI18n()
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [coverUrl, setCoverUrl] = useState(existing?.coverUrl ?? '')
  const [saving, setSaving] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleCoverUpload = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onSave({ name, description, coverUrl: coverUrl || undefined })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const modalTitle = existing
    ? language === 'vi'
      ? 'Chỉnh Sửa Thông Tin Danh Sách'
      : 'Edit Playlist Details'
    : language === 'vi'
      ? 'Tạo Danh Sách Phát Mới'
      : 'Create Personal Playlist'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={existing ? 'Edit Playlist' : 'Create New Playlist'}
    >
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="w-full max-w-md rounded-2xl border border-[#C6A878]/30 bg-[#181716] p-6 text-[#F1EDE6] shadow-2xl space-y-4"
      >
        <h3
          className="text-2xl font-semibold"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {modalTitle}
        </h3>

        <label className="block space-y-1">
          <span className="text-xs text-[#A49C92]">{t.playlistNameLabel}</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Đêm Hòa Nhạc Thính Phòng...'
                : 'Late Night Chopin & Rain...'
            }
            className="w-full px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] focus:outline-none focus:border-[#C6A878]"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-[#A49C92]">{t.playlistDescLabel}</span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Giai điệu tuyển chọn giúp bạn tập trung và thư giãn...'
                : 'Curated works for calm focus...'
            }
            className="w-full px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] focus:outline-none focus:border-[#C6A878]"
          />
        </label>

        <div className="flex items-center gap-3">
          {coverUrl && (
            <img
              src={coverUrl}
              alt="Cover preview"
              className="w-12 h-12 rounded-xl object-cover border border-[#C6A878]/30"
            />
          )}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#C6A878]/25 bg-[#22201E] hover:bg-[#321B22] text-xs text-[#F1EDE6] cursor-pointer"
          >
            <ImagePlus className="w-4 h-4 text-[#C6A878]" />
            <span>
              {coverUrl
                ? language === 'vi'
                  ? 'Đổi Ảnh Bìa'
                  : 'Change Cover Image'
                : language === 'vi'
                  ? 'Tải Ảnh Bìa'
                  : 'Upload Cover Image'}
            </span>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleCoverUpload(e.target.files?.[0])}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#C6A878]/20 text-xs text-[#A49C92] hover:text-[#F1EDE6] cursor-pointer"
          >
            {t.cancelBtn}
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="px-5 py-2 rounded-xl bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer disabled:opacity-40"
          >
            {existing
              ? language === 'vi'
                ? 'Lưu Danh Sách'
                : 'Save Playlist'
              : t.createBtn}
          </button>
        </div>
      </form>
    </div>
  )
}

export const MyPlaylistsView: React.FC<{ onOpenImportModal: () => void }> = ({
  onOpenImportModal,
}) => {
  const {
    playlists,
    allTracks,
    selectedPlaylistId,
    setSelectedPlaylistId,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
    playQueue,
  } = useMusicTheater()
  const { language, t } = useMusicI18n()

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<MusicPlaylist | null>(null)
  const [playlistSearch, setPlaylistSearch] = useState('')

  const trackById = useMemo(() => new Map(allTracks.map((t) => [t.id, t])), [allTracks])
  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId) ?? null

  const selectedTracks = useMemo(() => {
    if (!selectedPlaylist) return []
    return selectedPlaylist.trackIds
      .map((id) => trackById.get(id))
      .filter((t): t is MusicTrack => Boolean(t))
  }, [selectedPlaylist, trackById])

  const filteredSelectedTracks = useMemo(() => {
    const q = playlistSearch.trim().toLowerCase()
    if (!q) return selectedTracks
    return selectedTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q)
    )
  }, [playlistSearch, selectedTracks])

  const handleSavePlaylist = async (data: {
    name: string
    description: string
    coverUrl?: string
  }) => {
    if (editingPlaylist) {
      await updatePlaylist(editingPlaylist.id, data)
    } else {
      const created = await createPlaylist(data)
      setSelectedPlaylistId(created.id)
    }
  }

  // Single Playlist Deep Dive
  if (selectedPlaylist) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedPlaylistId(null)}
          className="inline-flex items-center gap-2 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay Lại Tất Cả Danh Sách' : 'Back to All Playlists'}</span>
        </button>

        <div className="rounded-3xl border border-[#C6A878]/25 bg-[#181716] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5 min-w-0">
            <img
              src={selectedPlaylist.coverUrl}
              alt={selectedPlaylist.name}
              className="w-24 h-24 rounded-2xl object-cover border border-[#C6A878]/30 shrink-0"
            />
            <div className="space-y-1.5 min-w-0">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C6A878]">
                {language === 'vi' ? 'Danh Sách Phát Cá Nhân' : 'Personal Playlist'}
              </span>
              <h2
                className="text-3xl font-semibold text-[#F1EDE6] truncate"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {selectedPlaylist.name}
              </h2>
              {selectedPlaylist.description && (
                <p className="text-xs text-[#A49C92] max-w-xl">{selectedPlaylist.description}</p>
              )}
              <p className="text-[11px] text-[#A49C92]/80">
                {selectedPlaylist.trackIds.length} {t.trackPlural}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={selectedTracks.length === 0}
              onClick={() => void playQueue(selectedTracks, 0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer disabled:opacity-40"
            >
              <Play className="w-4 h-4" />
              <span>
                {language === 'vi'
                  ? `Phát Tất Cả (${selectedTracks.length})`
                  : `Play All (${selectedTracks.length})`}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C6A878]/35 bg-[#22201E] hover:bg-[#321B22] text-xs text-[#F1EDE6] cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#C6A878]" />
              <span>{t.importAudio}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingPlaylist(selectedPlaylist)
                setFormModalOpen(true)
              }}
              aria-label="Edit playlist info"
              className="p-2.5 rounded-full border border-[#C6A878]/25 bg-[#22201E] hover:bg-[#321B22] text-[#A49C92] hover:text-[#F1EDE6] cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                void deletePlaylist(selectedPlaylist.id)
                setSelectedPlaylistId(null)
              }}
              aria-label="Delete playlist"
              className="p-2.5 rounded-full border border-rose-500/30 bg-[#22201E] hover:bg-rose-950/40 text-rose-300 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Playlist Tracks Search Filter */}
        {selectedTracks.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-[#A49C92] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={playlistSearch}
              onChange={(e) => setPlaylistSearch(e.target.value)}
              placeholder={t.searchInPlaylist}
              aria-label="Search songs in playlist"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181716] border border-[#C6A878]/20 text-xs sm:text-sm text-[#F1EDE6] placeholder:text-[#A49C92]/60 focus:outline-none focus:border-[#C6A878]"
            />
          </div>
        )}

        <MusicTrackList
          tracks={filteredSelectedTracks}
          enableReorder
          onReorder={(from, to) => void reorderPlaylistTracks(selectedPlaylist.id, from, to)}
          onRemoveFromPlaylist={(trackId) =>
            void removeTrackFromPlaylist(selectedPlaylist.id, trackId)
          }
          emptyMessage={
            selectedTracks.length === 0
              ? language === 'vi'
                ? 'Danh sách phát này chưa có bài hát nào. Hãy kéo tệp vào hoặc gán bài từ kho nhạc!'
                : 'This playlist has no songs yet. Drag audio files in or assign works from your library!'
              : language === 'vi'
                ? 'Không có bài hát nào trong danh sách khớp với từ khóa tìm kiếm.'
                : 'No songs in this playlist match your search query.'
          }
        />

        {formModalOpen && (
          <PlaylistFormModal
            existing={editingPlaylist}
            onClose={() => {
              setFormModalOpen(false)
              setEditingPlaylist(null)
            }}
            onSave={handleSavePlaylist}
          />
        )}
      </div>
    )
  }

  // Playlist Grid Overview
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">
            {language === 'vi' ? 'Kho Lưu Trữ Nhạc' : 'Curated Boxes'}
          </p>
          <h2
            className="text-3xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {t.myPlaylistsTitle} ({playlists.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPlaylist(null)
            setFormModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newPlaylist}</span>
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="rounded-3xl border border-[#C6A878]/20 bg-[#181716] p-10 text-center space-y-4 max-w-xl mx-auto">
          <ListMusic className="w-12 h-12 text-[#C6A878] mx-auto opacity-75" />
          <h3
            className="text-2xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {t.personalPlaylistsTitle}
          </h3>
          <p className="text-sm text-[#A49C92]">{t.emptyPlaylistsPrompt}</p>
          <button
            type="button"
            onClick={() => {
              setEditingPlaylist(null)
              setFormModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === 'vi' ? 'Tạo Danh Sách Đầu Tiên' : 'Create First Playlist'}
            </span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="rounded-2xl border border-[#C6A878]/15 bg-[#181716] hover:border-[#C6A878]/40 transition-colors p-4 flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                  className="w-20 h-20 rounded-xl overflow-hidden border border-[#C6A878]/20 shrink-0 cursor-pointer"
                >
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => setSelectedPlaylistId(playlist.id)}
                    className="text-base font-semibold text-[#F1EDE6] hover:text-[#C6A878] truncate block text-left cursor-pointer"
                  >
                    {playlist.name}
                  </button>
                  <p className="text-xs text-[#A49C92] line-clamp-2 mt-0.5">
                    {playlist.description ||
                      (language === 'vi'
                        ? 'Chương trình hòa nhạc cá nhân'
                        : 'Personal recital program')}
                  </p>
                  <span className="text-[11px] text-[#C6A878] mt-2 block">
                    {playlist.trackIds.length} {t.trackPlural}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#C6A878]/10 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                  className="text-xs text-[#C6A878] hover:text-[#D6AD73] font-medium cursor-pointer"
                >
                  {language === 'vi' ? 'Xem & Sắp Xếp Bài' : 'View & Organize'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlaylist(playlist)
                      setFormModalOpen(true)
                    }}
                    aria-label={`Edit ${playlist.name}`}
                    className="p-1.5 rounded-lg text-[#A49C92] hover:text-[#F1EDE6] cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deletePlaylist(playlist.id)}
                    aria-label={`Delete ${playlist.name}`}
                    className="p-1.5 rounded-lg text-rose-300/70 hover:text-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formModalOpen && (
        <PlaylistFormModal
          existing={editingPlaylist}
          onClose={() => {
            setFormModalOpen(false)
            setEditingPlaylist(null)
          }}
          onSave={handleSavePlaylist}
        />
      )}
    </div>
  )
}

export const ImportedMusicView: React.FC = () => {
  const { importedTracks, playQueue } = useMusicTheater()
  const { language, t } = useMusicI18n()

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">
          {language === 'vi' ? 'Tệp Nhạc Riêng Tư' : 'Personal Audio Files'}
        </p>
        <h2
          className="text-3xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {t.importedTitle} ({importedTracks.length})
        </h2>
        <p className="text-xs text-[#A49C92] mt-1">{t.importedDesc}</p>
      </div>

      {/* Import Drag & Drop Section */}
      <MusicImportDropzone />

      {/* Track Listing of Imported Files */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3
            className="text-2xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {language === 'vi' ? 'Danh Sách Tệp Đã Lưu' : 'Stored Files in Browser Vault'}
          </h3>
          {importedTracks.length > 0 && (
            <button
              type="button"
              onClick={() => void playQueue(importedTracks, 0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>
                {language === 'vi'
                  ? `Phát Toàn Bộ Nhạc Đã Nhập (${importedTracks.length})`
                  : `Play All Imported (${importedTracks.length})`}
              </span>
            </button>
          )}
        </div>

        <MusicTrackList
          tracks={importedTracks}
          showSizeColumn
          allowDeleteLocal
          emptyMessage={
            language === 'vi'
              ? 'Chưa có tệp âm thanh nào được nhập. Kéo thả bài hát MP3, WAV, FLAC, M4A của bạn vào khung bên trên để lưu trữ!'
              : 'No audio files imported yet. Drag your MP3, WAV, FLAC, or M4A tracks above to add them!'
          }
        />
      </section>
    </div>
  )
}
