import React, { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Heart,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useMusicTheater } from '../hooks/useMusicTheater'
import type { MusicSortOption, MusicThemePreset, MusicTrack } from '../types/music'
import { MusicTrackList } from './MusicTrackList'

function sortTracks(tracks: MusicTrack[], sortBy: MusicSortOption): MusicTrack[] {
  const copy = [...tracks]
  switch (sortBy) {
    case 'alphabetical':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    case 'duration-asc':
      return copy.sort((a, b) => a.duration - b.duration)
    case 'duration-desc':
      return copy.sort((a, b) => b.duration - a.duration)
    case 'recent-played':
      return copy.sort((a, b) => (b.lastPlayedAt ?? 0) - (a.lastPlayedAt ?? 0))
    case 'recent-added':
    default:
      return copy.sort((a, b) => b.addedAt - a.addedAt)
  }
}

export const AllSongsView: React.FC = () => {
  const {
    allTracks,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sourceFilter,
    setSourceFilter,
    playQueue,
  } = useMusicTheater()

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const base = allTracks.filter((track) => {
      if (sourceFilter !== 'all' && track.sourceType !== sourceFilter) return false
      if (!q) return true
      return (
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q) ||
        track.genre.toLowerCase().includes(q)
      )
    })
    return sortTracks(base, sortBy)
  }, [allTracks, searchQuery, sortBy, sourceFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">Complete Library</p>
          <h2
            className="text-3xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            All Songs ({filtered.length})
          </h2>
        </div>

        <button
          type="button"
          disabled={filtered.length === 0}
          onClick={() => void playQueue(filtered, 0)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer disabled:opacity-40"
        >
          <Play className="w-4 h-4" />
          <span>Play Selection</span>
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A49C92] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by song title, artist, album, or genre..."
            aria-label="Global music search"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181716] border border-[#C6A878]/20 text-sm text-[#F1EDE6] placeholder:text-[#A49C92]/60 focus:outline-none focus:border-[#C6A878]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as 'all' | 'curated' | 'local')}
            aria-label="Filter audio source"
            className="px-3 py-2.5 rounded-xl bg-[#181716] border border-[#C6A878]/20 text-xs text-[#F1EDE6]"
          >
            <option value="all">All Sources</option>
            <option value="curated">Concert Hall Curated</option>
            <option value="local">Imported Files Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as MusicSortOption)}
            aria-label="Sort songs"
            className="px-3 py-2.5 rounded-xl bg-[#181716] border border-[#C6A878]/20 text-xs text-[#F1EDE6]"
          >
            <option value="recent-added">Recently Added</option>
            <option value="alphabetical">Title (A–Z)</option>
            <option value="duration-asc">Shortest First</option>
            <option value="duration-desc">Longest First</option>
          </select>
        </div>
      </div>

      <MusicTrackList
        tracks={filtered}
        allowDeleteLocal
        emptyMessage="No tracks match your current search or filter criteria."
      />
    </div>
  )
}

export const DiscoverView: React.FC = () => {
  const { categories, curatedTracks, allTracks, playQueue } = useMusicTheater()
  const trackById = useMemo(() => new Map(allTracks.map((t) => [t.id, t])), [allTracks])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">Curated Spotlight</p>
        <h2
          className="text-3xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Discover Concert Programs
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const catTracks = cat.trackIds
            .map((id) => trackById.get(id))
            .filter((t): t is MusicTrack => Boolean(t))

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-[#C6A878]/20 bg-gradient-to-br from-[#321B22]/60 to-[#181716] p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#C6A878]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{catTracks.length} Movements</span>
                </span>
                <h3
                  className="text-2xl font-semibold text-[#F1EDE6] mt-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {cat.name}
                </h3>
                <p className="text-xs text-[#A49C92] mt-1">{cat.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => void playQueue(catTracks, 0)}
                className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play Program</span>
              </button>
            </div>
          )
        })}
      </div>

      <section className="space-y-3">
        <h3
          className="text-2xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Full Curated Concert Catalog
        </h3>
        <MusicTrackList tracks={curatedTracks} />
      </section>
    </div>
  )
}

export const AlbumsView: React.FC = () => {
  const { albums, allTracks, selectedAlbumId, setSelectedAlbumId, playQueue } = useMusicTheater()
  const trackById = useMemo(() => new Map(allTracks.map((t) => [t.id, t])), [allTracks])
  const selected = albums.find((a) => a.id === selectedAlbumId) ?? null

  if (selected) {
    const tracks = selected.trackIds
      .map((id) => trackById.get(id))
      .filter((t): t is MusicTrack => Boolean(t))

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedAlbumId(null)}
          className="inline-flex items-center gap-2 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Albums</span>
        </button>

        <div className="rounded-3xl border border-[#C6A878]/25 bg-[#181716] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={selected.coverUrl}
            alt={selected.title}
            className="w-28 h-28 rounded-2xl object-cover border border-[#C6A878]/30 shrink-0"
          />
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">
              {selected.genre} • {selected.year}
            </p>
            <h2
              className="text-3xl font-semibold text-[#F1EDE6]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {selected.title}
            </h2>
            <p className="text-xs text-[#A49C92]">{selected.description}</p>
            <button
              type="button"
              onClick={() => void playQueue(tracks, 0)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Album</span>
            </button>
          </div>
        </div>

        <MusicTrackList tracks={tracks} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">Discography</p>
        <h2
          className="text-3xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Concert Hall Albums
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {albums.map((album) => {
          const tracks = album.trackIds
            .map((id) => trackById.get(id))
            .filter((t): t is MusicTrack => Boolean(t))

          return (
            <div
              key={album.id}
              className="rounded-2xl border border-[#C6A878]/15 bg-[#181716] p-4 space-y-3"
            >
              <button
                type="button"
                onClick={() => setSelectedAlbumId(album.id)}
                className="w-full aspect-square rounded-xl overflow-hidden border border-[#C6A878]/20 cursor-pointer"
              >
                <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
              </button>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setSelectedAlbumId(album.id)}
                    className="text-base font-semibold text-[#F1EDE6] hover:text-[#C6A878] truncate block text-left cursor-pointer"
                  >
                    {album.title}
                  </button>
                  <p className="text-xs text-[#A49C92] truncate">
                    {album.artist} • {album.year}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void playQueue(tracks, 0)}
                  aria-label={`Play ${album.title}`}
                  className="p-2 rounded-full bg-[#321B22] text-[#C6A878] hover:bg-[#542C35] cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ArtistsView: React.FC = () => {
  const { artists, allTracks, selectedArtistId, setSelectedArtistId, playQueue } = useMusicTheater()
  const selected = artists.find((a) => a.id === selectedArtistId) ?? null

  if (selected) {
    const artistTracks = allTracks.filter(
      (t) => t.artist.toLowerCase() === selected.name.toLowerCase() || selected.featuredTrackIds.includes(t.id)
    )

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedArtistId(null)}
          className="inline-flex items-center gap-2 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Artists</span>
        </button>

        <div className="rounded-3xl border border-[#C6A878]/25 bg-[#181716] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={selected.portraitUrl}
            alt={selected.name}
            className="w-24 h-24 rounded-full object-cover border border-[#C6A878]/35 shrink-0"
          />
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">{selected.eraOrRole}</p>
            <h2
              className="text-3xl font-semibold text-[#F1EDE6]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {selected.name}
            </h2>
            <p className="text-xs text-[#A49C92]">{selected.bio}</p>
            <button
              type="button"
              onClick={() => void playQueue(artistTracks, 0)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Artist Repertoire</span>
            </button>
          </div>
        </div>

        <MusicTrackList tracks={artistTracks} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">Soloists & Ensembles</p>
        <h2
          className="text-3xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Concert Artists
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artists.map((artist) => (
          <button
            key={artist.id}
            type="button"
            onClick={() => setSelectedArtistId(artist.id)}
            className="flex items-center gap-4 p-4 rounded-2xl border border-[#C6A878]/15 bg-[#181716] hover:bg-[#22201E] hover:border-[#C6A878]/40 text-left transition-colors cursor-pointer"
          >
            <img
              src={artist.portraitUrl}
              alt={artist.name}
              className="w-16 h-16 rounded-full object-cover border border-[#C6A878]/30 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#F1EDE6] truncate">{artist.name}</h3>
              <p className="text-xs text-[#C6A878]">{artist.eraOrRole}</p>
              <p className="text-xs text-[#A49C92] mt-1 line-clamp-2">{artist.bio}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export const FavoritesView: React.FC = () => {
  const { allTracks, favoriteIds, playQueue } = useMusicTheater()
  const trackById = useMemo(() => new Map(allTracks.map((t) => [t.id, t])), [allTracks])
  const favTracks = useMemo(
    () =>
      favoriteIds
        .map((id) => trackById.get(id))
        .filter((t): t is MusicTrack => Boolean(t)),
    [favoriteIds, trackById]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">Personal Encore</p>
          <h2
            className="text-3xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Favorites ({favTracks.length})
          </h2>
        </div>

        <button
          type="button"
          disabled={favTracks.length === 0}
          onClick={() => void playQueue(favTracks, 0)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer disabled:opacity-40"
        >
          <Heart className="w-4 h-4" />
          <span>Play All Favorites</span>
        </button>
      </div>

      <MusicTrackList
        tracks={favTracks}
        emptyMessage="No favorites saved yet. Click the heart icon on any performance to keep it here."
      />
    </div>
  )
}

export const RecentlyPlayedView: React.FC = () => {
  const { allTracks, historyEntries, clearHistory, playQueue } = useMusicTheater()
  const trackById = useMemo(() => new Map(allTracks.map((t) => [t.id, t])), [allTracks])

  const recentTracks = useMemo(
    () =>
      historyEntries
        .map((entry) => trackById.get(entry.trackId))
        .filter((t): t is MusicTrack => Boolean(t)),
    [historyEntries, trackById]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">Listening Log</p>
          <h2
            className="text-3xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Recently Played ({recentTracks.length})
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {recentTracks.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => void playQueue(recentTracks, 0)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Replay Recent</span>
              </button>
              <button
                type="button"
                onClick={() => void clearHistory()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C6A878]/25 bg-[#22201E] hover:bg-[#321B22] text-xs text-[#F1EDE6] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#C6A878]" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      <MusicTrackList
        tracks={recentTracks}
        emptyMessage="Your evening listening log is empty. Play any piece to begin recording your history."
      />
    </div>
  )
}

export const MusicSettingsView: React.FC = () => {
  const { settings, updateSettings, replayIntro, clearAllLocalData, importedTracks, playlists } =
    useMusicTheater()
  const [confirmReset, setConfirmReset] = useState(false)

  const themeOptions: Array<{ id: MusicThemePreset; label: string; desc: string }> = [
    {
      id: 'concert-hall',
      label: 'Concert Hall Obsidian',
      desc: 'Classic #101010 charcoal hall with burgundy velvet accents',
    },
    {
      id: 'warm-amber',
      label: 'Warm Amber Stage',
      desc: 'Candlelit amber stage warmth over #181716 surface',
    },
    {
      id: 'deep-velvet',
      label: 'Deep Velvet Burgundy',
      desc: 'Rich #321B22 royal salon backdrop tone',
    },
  ]

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#C6A878]">Theater Preferences</p>
        <h2
          className="text-3xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Hall Acoustics & Settings
        </h2>
      </div>

      {/* Theme Presets */}
      <section className="rounded-2xl border border-[#C6A878]/20 bg-[#181716] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#F1EDE6]">Atmosphere Theme Variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const active = settings.themePreset === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => updateSettings({ themePreset: option.id })}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#321B22] border-[#C6A878] text-[#F1EDE6]'
                    : 'bg-[#22201E] border-[#C6A878]/15 text-[#A49C92] hover:text-[#F1EDE6]'
                }`}
              >
                <p className="text-xs font-semibold text-[#F1EDE6]">{option.label}</p>
                <p className="text-[11px] text-[#A49C92] mt-1">{option.desc}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Audio & Animation Controls */}
      <section className="rounded-2xl border border-[#C6A878]/20 bg-[#181716] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#F1EDE6]">Playback & Entrance Experience</h3>

        <label className="flex items-center justify-between gap-4 py-1">
          <div>
            <p className="text-sm text-[#F1EDE6]">Default Acoustic Volume</p>
            <p className="text-xs text-[#A49C92]">{Math.round(settings.defaultVolume * 100)}%</p>
          </div>
          <input
            type="range"
            aria-label="Default volume setting"
            min={0}
            max={1}
            step={0.05}
            value={settings.defaultVolume}
            onChange={(e) => updateSettings({ defaultVolume: Number(e.target.value) })}
            className="w-36 accent-[#C6A878] cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
          <div>
            <p className="text-sm text-[#F1EDE6]">Autoplay Next Movement</p>
            <p className="text-xs text-[#A49C92]">
              Automatically proceed through your queue when a piece finishes
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoplayNext}
            onChange={(e) => updateSettings({ autoplayNext: e.target.checked })}
            className="w-4 h-4 accent-[#C6A878]"
          />
        </label>

        <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
          <div>
            <p className="text-sm text-[#F1EDE6]">Enable Stage Audio Pulse</p>
            <p className="text-xs text-[#A49C92]">
              Display subtle warm amber resonance bars beside the active track
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableVisualizer}
            onChange={(e) => updateSettings({ enableVisualizer: e.target.checked })}
            className="w-4 h-4 accent-[#C6A878]"
          />
        </label>

        <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
          <div>
            <p className="text-sm text-[#F1EDE6]">Enable Velvet Curtain Intro</p>
            <p className="text-xs text-[#A49C92]">
              Play the 4-scene curtain opening & chandelier sequence upon entering the theater
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableIntroSequence}
            onChange={(e) => updateSettings({ enableIntroSequence: e.target.checked })}
            className="w-4 h-4 accent-[#C6A878]"
          />
        </label>

        <label className="flex items-center justify-between gap-4 py-1 cursor-pointer">
          <div>
            <p className="text-sm text-[#F1EDE6]">Reduce Motion Animations</p>
            <p className="text-xs text-[#A49C92]">
              Skip animated curtain & lighting choreography transitions
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.reduceMotionOverride}
            onChange={(e) => updateSettings({ reduceMotionOverride: e.target.checked })}
            className="w-4 h-4 accent-[#C6A878]"
          />
        </label>

        <div className="pt-2">
          <button
            type="button"
            onClick={replayIntro}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#C6A878]/35 bg-[#321B22] hover:bg-[#542C35] text-xs font-medium text-[#F1EDE6] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C6A878]" />
            <span>Replay Curtain Opening Sequence</span>
          </button>
        </div>
      </section>

      {/* Keyboard Shortcuts Reference */}
      <section className="rounded-2xl border border-[#C6A878]/20 bg-[#181716] p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[#F1EDE6]">Theater Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#22201E] text-[#A49C92]">
            <kbd className="text-[#C6A878] font-mono block mb-0.5">Space</kbd>
            Play / Pause
          </div>
          <div className="p-2.5 rounded-xl bg-[#22201E] text-[#A49C92]">
            <kbd className="text-[#C6A878] font-mono block mb-0.5">Alt + Right</kbd>
            Seek +5s
          </div>
          <div className="p-2.5 rounded-xl bg-[#22201E] text-[#A49C92]">
            <kbd className="text-[#C6A878] font-mono block mb-0.5">Alt + Left</kbd>
            Seek -5s
          </div>
          <div className="p-2.5 rounded-xl bg-[#22201E] text-[#A49C92]">
            <kbd className="text-[#C6A878] font-mono block mb-0.5">M</kbd>
            Mute / Unmute
          </div>
        </div>
      </section>

      {/* Local Data Cleanup */}
      <section className="rounded-2xl border border-rose-500/25 bg-[#181716] p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[#F1EDE6]">Local Storage Management</h3>
        <p className="text-xs text-[#A49C92]">
          Currently storing {importedTracks.length} local audio file(s) and {playlists.length} playlist(s) inside browser IndexedDB.
        </p>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/35 bg-[#22201E] hover:bg-[#321B22] text-xs text-rose-200 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Music Vault</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                void clearAllLocalData()
                setConfirmReset(false)
              }}
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-xs font-semibold text-white cursor-pointer"
            >
              Confirm Permanent Removal
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-4 py-2 rounded-xl border border-[#C6A878]/20 text-xs text-[#A49C92] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
