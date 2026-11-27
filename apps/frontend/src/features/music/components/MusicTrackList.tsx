import React, { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Heart,
  ListPlus,
  Pause,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react'
import { formatFileSize, formatMusicTime, useMusicTheater } from '../hooks/useMusicTheater'
import type { MusicTrack } from '../types/music'
import { EditMetadataModal, PlaylistAssignModal } from './TrackActionModal'

interface MusicTrackListProps {
  tracks: MusicTrack[]
  emptyMessage?: string
  showSizeColumn?: boolean
  enableReorder?: boolean
  onReorder?: (fromIndex: number, toIndex: number) => void
  onRemoveFromPlaylist?: (trackId: string) => void
  allowDeleteLocal?: boolean
}

export const MusicTrackList: React.FC<MusicTrackListProps> = ({
  tracks,
  emptyMessage = 'No works found matching your filter.',
  showSizeColumn = false,
  enableReorder = false,
  onReorder,
  onRemoveFromPlaylist,
  allowDeleteLocal = false,
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleFavorite,
    isFavorite,
    deleteImportedTrack,
  } = useMusicTheater()

  const [assignModalTrack, setAssignModalTrack] = useState<MusicTrack | null>(null)
  const [editModalTrack, setEditModalTrack] = useState<MusicTrack | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  if (tracks.length === 0) {
    return (
      <div className="rounded-2xl border border-[#C6A878]/15 bg-[#181716] p-10 text-center">
        <p className="text-sm text-[#A49C92]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl border border-[#C6A878]/15 bg-[#181716] overflow-hidden">
        <div className="divide-y divide-[#C6A878]/10">
          {tracks.map((track, index) => {
            const isCurrent = currentTrack?.id === track.id
            const fav = isFavorite(track.id)

            return (
              <div
                key={`${track.id}_${index}`}
                draggable={enableReorder}
                onDragStart={() => enableReorder && setDragIndex(index)}
                onDragOver={(e) => {
                  if (enableReorder) e.preventDefault()
                }}
                onDrop={(e) => {
                  if (!enableReorder || dragIndex === null || !onReorder) return
                  e.preventDefault()
                  onReorder(dragIndex, index)
                  setDragIndex(null)
                }}
                onDragEnd={() => setDragIndex(null)}
                data-testid={`track-row-${track.id}`}
                className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
                  isCurrent ? 'bg-[#321B22]/70' : 'hover:bg-[#22201E]/85'
                } ${dragIndex === index ? 'opacity-50' : ''}`}
              >
                {enableReorder && (
                  <div className="flex items-center gap-1 text-[#A49C92]">
                    <GripVertical className="w-4 h-4 cursor-grab shrink-0" />
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onReorder?.(index, index - 1)}
                      aria-label={`Move ${track.title} up`}
                      className="p-1 rounded hover:bg-[#22201E] disabled:opacity-25 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === tracks.length - 1}
                      onClick={() => onReorder?.(index, index + 1)}
                      aria-label={`Move ${track.title} down`}
                      className="p-1 rounded hover:bg-[#22201E] disabled:opacity-25 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <span className="w-6 text-xs text-[#A49C92] tabular-nums hidden sm:inline-block">
                  {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (isCurrent) {
                      void togglePlayPause()
                    } else {
                      void playTrack(track, tracks)
                    }
                  }}
                  aria-label={isCurrent && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#C6A878]/20 cursor-pointer"
                >
                  <img
                    src={track.artworkUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity ${
                      isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 text-[#C6A878]" />
                    ) : (
                      <Play className="w-4 h-4 text-[#C6A878]" />
                    )}
                  </div>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void playTrack(track, tracks)}
                      className={`text-sm font-medium truncate text-left hover:underline cursor-pointer ${
                        isCurrent ? 'text-[#D6AD73]' : 'text-[#F1EDE6]'
                      }`}
                    >
                      {track.title}
                    </button>
                    <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#22201E] text-[#C6A878] border border-[#C6A878]/20 uppercase shrink-0">
                      {track.sourceType === 'local' ? track.format : 'Stage'}
                    </span>
                  </div>
                  <p className="text-xs text-[#A49C92] truncate">
                    {track.artist} • {track.album}
                  </p>
                </div>

                {showSizeColumn && (
                  <span className="hidden lg:inline-block text-xs text-[#A49C92] w-20 text-right tabular-nums">
                    {formatFileSize(track.fileSize)}
                  </span>
                )}

                <span className="text-xs text-[#A49C92] tabular-nums w-12 text-right">
                  {formatMusicTime(track.duration)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => void toggleFavorite(track.id)}
                    aria-label={fav ? `Unfavorite ${track.title}` : `Favorite ${track.title}`}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      fav ? 'text-[#D6AD73]' : 'text-[#A49C92] hover:text-[#F1EDE6]'
                    }`}
                    title="Favorite"
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-[#D6AD73]' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignModalTrack(track)}
                    aria-label={`Add ${track.title} to playlists`}
                    className="p-1.5 rounded-lg text-[#A49C92] hover:text-[#C6A878] hover:bg-[#22201E] transition-colors cursor-pointer"
                    title="Add to Playlists"
                  >
                    <ListPlus className="w-4 h-4" />
                  </button>

                  {track.sourceType === 'local' && (
                    <button
                      type="button"
                      onClick={() => setEditModalTrack(track)}
                      aria-label={`Edit metadata for ${track.title}`}
                      className="p-1.5 rounded-lg text-[#A49C92] hover:text-[#C6A878] hover:bg-[#22201E] transition-colors cursor-pointer"
                      title="Edit Metadata"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  {onRemoveFromPlaylist && (
                    <button
                      type="button"
                      onClick={() => onRemoveFromPlaylist(track.id)}
                      aria-label={`Remove ${track.title} from playlist`}
                      className="p-1.5 rounded-lg text-[#A49C92] hover:text-[#D6AD73] hover:bg-[#321B22] transition-colors cursor-pointer"
                      title="Remove from Playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {allowDeleteLocal && track.sourceType === 'local' && (
                    <button
                      type="button"
                      onClick={() => void deleteImportedTrack(track.id)}
                      aria-label={`Delete ${track.title} from library`}
                      className="p-1.5 rounded-lg text-[#A49C92] hover:text-rose-300 hover:bg-[#321B22] transition-colors cursor-pointer"
                      title="Delete Imported File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {assignModalTrack && (
        <PlaylistAssignModal track={assignModalTrack} onClose={() => setAssignModalTrack(null)} />
      )}
      {editModalTrack && (
        <EditMetadataModal track={editModalTrack} onClose={() => setEditModalTrack(null)} />
      )}
    </>
  )
}
