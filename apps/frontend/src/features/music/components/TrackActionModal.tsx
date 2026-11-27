import React, { useState } from 'react'
import { Check, FolderPlus, X } from 'lucide-react'
import { useMusicTheater } from '../hooks/useMusicTheater'
import { useMusicI18n } from '../hooks/useMusicI18n'
import type { MusicTrack } from '../types/music'

interface PlaylistAssignModalProps {
  track: MusicTrack
  onClose: () => void
}

export const PlaylistAssignModal: React.FC<PlaylistAssignModalProps> = ({ track, onClose }) => {
  const { playlists, setTrackPlaylists, createPlaylist, addTrackToPlaylist } = useMusicTheater()
  const { language, t } = useMusicI18n()
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    playlists.filter((pl) => pl.trackIds.includes(track.id)).map((pl) => pl.id)
  )
  const [quickName, setQuickName] = useState('')
  const [saving, setSaving] = useState(false)

  const togglePlaylist = (playlistId: string) => {
    setSelectedIds((prev) =>
      prev.includes(playlistId) ? prev.filter((id) => id !== playlistId) : [...prev, playlistId]
    )
  }

  const handleQuickCreate = async () => {
    if (!quickName.trim()) return
    const created = await createPlaylist({
      name: quickName.trim(),
      description:
        language === 'vi' ? 'Danh sách hòa nhạc cá nhân' : 'Personal concert playlist',
    })
    await addTrackToPlaylist(created.id, track.id)
    setSelectedIds((prev) => [...prev, created.id])
    setQuickName('')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setTrackPlaylists(track.id, selectedIds)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Assign Track to Playlists"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#C6A878]/30 bg-[#181716] p-6 text-[#F1EDE6] shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A878]">
              {t.assignPlaylistTitle}
            </p>
            <h3 className="text-lg font-semibold truncate">{track.title}</h3>
            <p className="text-xs text-[#A49C92] truncate">{track.artist}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close playlist modal"
            className="p-1.5 rounded-lg text-[#A49C92] hover:text-[#F1EDE6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
            placeholder={
              language === 'vi' ? 'Tên danh sách mới...' : 'New playlist name...'
            }
            className="flex-1 px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] placeholder:text-[#A49C92]/60 focus:outline-none focus:border-[#C6A878]"
          />
          <button
            type="button"
            onClick={() => void handleQuickCreate()}
            disabled={!quickName.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#321B22] hover:bg-[#542C35] border border-[#C6A878]/30 text-xs font-medium text-[#F1EDE6] disabled:opacity-40 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#C6A878]" />
            <span>{t.createBtn}</span>
          </button>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-2 mb-5">
          {playlists.length === 0 ? (
            <p className="text-xs text-[#A49C92] py-4 text-center">
              {language === 'vi'
                ? 'Chưa có danh sách phát nào. Hãy tạo danh sách phía trên để tổ chức bài hát này!'
                : 'No personal playlists yet. Create one above to organize this work.'}
            </p>
          ) : (
            playlists.map((pl) => {
              const checked = selectedIds.includes(pl.id)
              return (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => togglePlaylist(pl.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    checked
                      ? 'bg-[#321B22]/85 border-[#C6A878]/45 text-[#F1EDE6]'
                      : 'bg-[#22201E]/70 border-[#C6A878]/10 text-[#A49C92] hover:text-[#F1EDE6]'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-medium truncate">{pl.name}</p>
                    <p className="text-[11px] text-[#A49C92]">
                      {pl.trackIds.length} {t.trackPlural}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      checked
                        ? 'bg-[#C6A878] border-[#C6A878] text-[#101010]'
                        : 'border-[#A49C92]/40'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#C6A878]/20 text-xs text-[#A49C92] hover:text-[#F1EDE6] cursor-pointer"
          >
            {t.cancelBtn}
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
          >
            {t.saveSelection}
          </button>
        </div>
      </div>
    </div>
  )
}

interface EditMetadataModalProps {
  track: MusicTrack
  onClose: () => void
}

export const EditMetadataModal: React.FC<EditMetadataModalProps> = ({ track, onClose }) => {
  const { updateTrackMetadata } = useMusicTheater()
  const { language, t } = useMusicI18n()
  const [title, setTitle] = useState(track.title)
  const [artist, setArtist] = useState(track.artist)
  const [album, setAlbum] = useState(track.album)
  const [genre, setGenre] = useState(track.genre)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await updateTrackMetadata(track.id, { title, artist, album, genre })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit Track Metadata"
    >
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="w-full max-w-md rounded-2xl border border-[#C6A878]/30 bg-[#181716] p-6 text-[#F1EDE6] shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A878]">
              {language === 'vi' ? 'Ghi Chú Tác Phẩm' : 'Program Notes'}
            </p>
            <h3 className="text-lg font-semibold">{t.editMetadataTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close metadata modal"
            className="p-1.5 rounded-lg text-[#A49C92] hover:text-[#F1EDE6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="block space-y-1">
          <span className="text-xs text-[#A49C92]">{t.trackTitleLabel}</span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] focus:outline-none focus:border-[#C6A878]"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-[#A49C92]">{t.artistLabel}</span>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] focus:outline-none focus:border-[#C6A878]"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-xs text-[#A49C92]">{t.albumLabel}</span>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] focus:outline-none focus:border-[#C6A878]"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-[#A49C92]">{language === 'vi' ? 'Thể Loại' : 'Genre'}</span>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] focus:outline-none focus:border-[#C6A878]"
            />
          </label>
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
            disabled={saving || !title.trim()}
            className="px-5 py-2 rounded-xl bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
          >
            {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  )
}
