import React, { useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  FolderPlus,
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
import type { MusicPlaylist, MusicTrack } from '../types/music'
import { MusicImportDropzone } from './MusicImportModal'
import { MusicTrackList } from './MusicTrackList'

interface PlaylistFormModalProps {
  existing?: MusicPlaylist | null
  onClose: () => void
  onSave: (data: { name: string; description: string; coverUrl?: string }) => Promise<void>
}

const PlaylistFormModal: React.FC<PlaylistFormModalProps> = ({ existing, onClose, onSave }) => {
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
          {existing ? 'Edit Playlist Details' : 'Create Personal Playlist'}
        </h3>

        <label className="block space-y-1">
          <span className="text-xs text-[#A49C92]">Playlist Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Late Night Chopin & Rain..."
            className="w-full px-3 py-2 rounded-xl bg-[#22201E] border border-[#C6A878]/20 text-sm text-[#F1EDE6] focus:outline-none focus:border-[#C6A878]"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-[#A49C92]">Program Note / Description</span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Curated works for calm focus..."
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
            <span>{coverUrl ? 'Change Cover Image' : 'Upload Cover Image'}</span>
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="px-5 py-2 rounded-xl bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer disabled:opacity-40"
          >
            {existing ? 'Save Playlist' : 'Create Playlist'}
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

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<MusicPlaylist | null>(null)
  const [playlistSearch, setPlaylistSearch] = useState('')

  const trackById = useMemo(() => new Map(allTracks.map((t) => [t.id, t])), [allTracks])
  const selectedPlaylist = playlists.find((pl) => pl.id === selectedPlaylistId) ?? null

  if (selectedPlaylist) {
    const orderedTracks = selectedPlaylist.trackIds
      .map((id) => trackById.get(id))
      .filter((t): t is MusicTrack => Boolean(t))

    const q = playlistSearch.trim().toLowerCase()
    const filteredTracks = q
      ? orderedTracks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            t.album.toLowerCase().includes(q)
        )
      : orderedTracks

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => {
            setSelectedPlaylistId(null)
            setPlaylistSearch('')
          }}
          className="inline-flex items-center gap-2 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Playlists</span>
        </button>

        <div className="rounded-3xl border border-[#C6A878]/25 bg-gradient-to-br from-[#321B22]/65 to-[#181716] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={selectedPlaylist.coverUrl}
            alt={selectedPlaylist.name}
            className="w-28 h-28 rounded-2xl object-cover border border-[#C6A878]/30 shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6A878]">
              Personal Collection Playlist
            </p>
            <h2
              className="text-3xl font-semibold text-[#F1EDE6]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {selectedPlaylist.name}
            </h2>
            {selectedPlaylist.description && (
              <p className="text-xs text-[#A49C92]">{selectedPlaylist.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={orderedTracks.length === 0}
                onClick={() => void playQueue(orderedTracks, 0)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play All ({orderedTracks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingPlaylist(selectedPlaylist)
                  setFormModalOpen(true)
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C6A878]/30 bg-[#22201E] text-xs text-[#F1EDE6] hover:bg-[#321B22] cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-[#C6A878]" />
                <span>Edit Info</span>
              </button>

              <button
                type="button"
                onClick={() => void deletePlaylist(selectedPlaylist.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-500/30 bg-[#22201E] text-xs text-rose-200 hover:bg-[#321B22] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#A49C92] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={playlistSearch}
              onChange={(e) => setPlaylistSearch(e.target.value)}
              placeholder="Search inside this playlist..."
              aria-label="Search songs in playlist"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#181716] border border-[#C6A878]/20 text-xs text-[#F1EDE6] placeholder:text-[#A49C92]/60 focus:outline-none focus:border-[#C6A878]"
            />
          </div>

          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#C6A878]/30 bg-[#22201E] hover:bg-[#321B22] text-xs text-[#F1EDE6] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#C6A878]" />
            <span>Import Audio Files</span>
          </button>
        </div>

        <MusicTrackList
          tracks={filteredTracks}
          enableReorder={!q}
          onReorder={(from, to) => void reorderPlaylistTracks(selectedPlaylist.id, from, to)}
          onRemoveFromPlaylist={(trackId) => void removeTrackFromPlaylist(selectedPlaylist.id, trackId)}
          emptyMessage="This playlist has no matching songs yet. Use '+' on any song or import your audio files."
        />

        {formModalOpen && (
          <PlaylistFormModal
            existing={editingPlaylist}
            onClose={() => {
              setFormModalOpen(false)
              setEditingPlaylist(null)
            }}
            onSave={async (data) => {
              if (editingPlaylist) {
                await updatePlaylist(editingPlaylist.id, data)
              }
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">My Music Collection</p>
          <h2
            className="text-3xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Personal Playlists ({playlists.length})
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingPlaylist(null)
              setFormModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Playlist</span>
          </button>
          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C6A878]/30 bg-[#22201E] hover:bg-[#321B22] text-xs text-[#F1EDE6] cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#C6A878]" />
            <span>Import Music</span>
          </button>
        </div>
      </div>

      {playlists.length === 0 ? (
        <div className="rounded-3xl border border-[#C6A878]/20 bg-[#181716] p-12 text-center space-y-4">
          <ListMusic className="w-10 h-10 text-[#C6A878] mx-auto opacity-80" />
          <h3
            className="text-2xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Create Your First Concert Program
          </h3>
          <p className="text-xs text-[#A49C92] max-w-md mx-auto">
            Organize imported local audio files and curated chamber pieces into personalized playlists stored permanently on this device.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingPlaylist(null)
              setFormModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlists.map((pl) => {
            const tracks = pl.trackIds
              .map((id) => trackById.get(id))
              .filter((t): t is MusicTrack => Boolean(t))

            return (
              <div
                key={pl.id}
                className="rounded-2xl border border-[#C6A878]/20 bg-[#181716] hover:border-[#C6A878]/45 transition-colors p-4 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPlaylistId(pl.id)}
                    className="w-16 h-16 rounded-xl overflow-hidden border border-[#C6A878]/25 shrink-0 cursor-pointer"
                  >
                    <img
                      src={pl.coverUrl}
                      alt={pl.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPlaylistId(pl.id)}
                      className="text-base font-semibold text-[#F1EDE6] hover:text-[#C6A878] truncate block text-left cursor-pointer"
                    >
                      {pl.name}
                    </button>
                    <p className="text-xs text-[#A49C92] mt-0.5 line-clamp-2">
                      {pl.description || 'Personal curated listening selection'}
                    </p>
                    <p className="text-[11px] text-[#C6A878] mt-1">{tracks.length} tracks</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#C6A878]/10">
                  <button
                    type="button"
                    disabled={tracks.length === 0}
                    onClick={() => void playQueue(tracks, 0)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C6A878] hover:text-[#D6AD73] disabled:opacity-40 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Play All</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlaylist(pl)
                        setFormModalOpen(true)
                      }}
                      aria-label={`Edit ${pl.name}`}
                      className="p-1.5 rounded-lg text-[#A49C92] hover:text-[#F1EDE6] hover:bg-[#22201E] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deletePlaylist(pl.id)}
                      aria-label={`Delete ${pl.name}`}
                      className="p-1.5 rounded-lg text-[#A49C92] hover:text-rose-300 hover:bg-[#321B22] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {formModalOpen && (
        <PlaylistFormModal
          existing={editingPlaylist}
          onClose={() => {
            setFormModalOpen(false)
            setEditingPlaylist(null)
          }}
          onSave={async (data) => {
            if (editingPlaylist) {
              await updatePlaylist(editingPlaylist.id, data)
            } else {
              const created = await createPlaylist(data)
              setSelectedPlaylistId(created.id)
            }
          }}
        />
      )}
    </div>
  )
}

export const ImportedMusicView: React.FC = () => {
  const { importedTracks, playQueue } = useMusicTheater()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">My Music Collection</p>
          <h2
            className="text-3xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Imported Audio Archive ({importedTracks.length})
          </h2>
        </div>

        {importedTracks.length > 0 && (
          <button
            type="button"
            onClick={() => void playQueue(importedTracks, 0)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Play Imported Archive</span>
          </button>
        )}
      </div>

      <MusicImportDropzone />

      <div className="space-y-3">
        <h3
          className="text-xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Stored Local Tracks
        </h3>
        <MusicTrackList
          tracks={importedTracks}
          showSizeColumn
          allowDeleteLocal
          emptyMessage="No local audio files imported yet. Drop .mp3, .wav, .flac, .m4a, .ogg, or .aac files above."
        />
      </div>
    </div>
  )
}
