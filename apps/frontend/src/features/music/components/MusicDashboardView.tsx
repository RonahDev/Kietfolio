import React from 'react'
import { ArrowRight, Disc3, Flame, FolderPlus, Mic2, Play, Sparkles } from 'lucide-react'
import { useMusicTheater } from '../hooks/useMusicTheater'
import { useMusicI18n } from '../hooks/useMusicI18n'
import { MusicTrackList } from './MusicTrackList'

interface MusicDashboardViewProps {
  onOpenImportModal: () => void
}

export const MusicDashboardView: React.FC<MusicDashboardViewProps> = ({ onOpenImportModal }) => {
  const {
    allTracks,
    curatedTracks,
    albums,
    artists,
    categories,
    playlists,
    historyEntries,
    playTrack,
    playQueue,
    setActiveTab,
    setSelectedAlbumId,
    setSelectedArtistId,
    setSelectedPlaylistId,
  } = useMusicTheater()
  const { t } = useMusicI18n()

  const trackById = new Map(allTracks.map((t) => [t.id, t]))
  const vpopTracks = allTracks.filter((t) => t.id.startsWith('vpop_'))
  const recentlyPlayedTracks = historyEntries
    .map((entry) => trackById.get(entry.trackId))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .slice(0, 4)

  const handleOpenAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId)
    setActiveTab('albums')
  }

  const handleOpenArtist = (artistId: string) => {
    setSelectedArtistId(artistId)
    setActiveTab('artists')
  }

  const handleOpenPlaylist = (playlistId: string) => {
    setSelectedPlaylistId(playlistId)
    setActiveTab('my-playlists')
  }

  return (
    <div className="space-y-10">
      {/* Evening Concert Hall Hero Welcome */}
      <section className="rounded-3xl border border-[#C6A878]/25 bg-gradient-to-br from-[#321B22]/75 via-[#181716] to-[#101010] p-6 sm:p-9 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(214,173,115,0.55) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22201E]/90 border border-[#C6A878]/30 text-[#C6A878] text-[11px] uppercase tracking-[0.22em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.welcomeBadge}</span>
          </div>

          <h2
            className="text-3xl sm:text-5xl font-semibold text-[#F1EDE6] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {t.welcomeTitle}
          </h2>

          <p className="text-sm text-[#A49C92] leading-relaxed">
            {t.welcomeDesc}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => void playQueue(curatedTracks, 0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{t.playOpening}</span>
            </button>

            <button
              type="button"
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C6A878]/35 bg-[#22201E]/90 hover:bg-[#321B22] text-[#F1EDE6] text-xs font-medium transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-[#C6A878]" />
              <span>{t.importAudio}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Recently Played */}
      {recentlyPlayedTracks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-2xl font-semibold text-[#F1EDE6]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {t.recentlyPlayedTitle}
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('recently-played')}
              className="inline-flex items-center gap-1 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
            >
              <span>{t.viewHistory}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyPlayedTracks.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => void playTrack(track, recentlyPlayedTracks)}
                className="group flex items-center gap-3 p-3 rounded-2xl border border-[#C6A878]/15 bg-[#181716] hover:bg-[#22201E] hover:border-[#C6A878]/35 text-left transition-all cursor-pointer"
              >
                <img
                  src={track.artworkUrl}
                  alt={track.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#C6A878]/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#F1EDE6] truncate group-hover:text-[#D6AD73]">
                    {track.title}
                  </p>
                  <p className="text-xs text-[#A49C92] truncate">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Top Trending Vietnamese Hits */}
      {vpopTracks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <Flame className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h3
                  className="text-2xl font-semibold text-[#F1EDE6]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {t.trendingVpopTitle}
                </h3>
                <p className="text-xs text-[#A49C92]">{t.trendingVpopDesc}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('all-songs')}
              className="inline-flex items-center gap-1 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer shrink-0"
            >
              <span>{t.viewAllSongs}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <MusicTrackList tracks={vpopTracks.slice(0, 4)} />
        </section>
      )}

      {/* Featured Albums */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-2xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {t.curatedAlbums}
          </h3>
          <button
            type="button"
            onClick={() => setActiveTab('albums')}
            className="inline-flex items-center gap-1 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
          >
            <span>{t.tabAlbums}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {albums.map((album) => {
            const albumTracks = album.trackIds
              .map((id) => trackById.get(id))
              .filter((t): t is NonNullable<typeof t> => Boolean(t))

            return (
              <div
                key={album.id}
                className="rounded-2xl border border-[#C6A878]/15 bg-[#181716] hover:border-[#C6A878]/40 transition-colors p-4 flex flex-col gap-3"
              >
                <button
                  type="button"
                  onClick={() => handleOpenAlbum(album.id)}
                  className="relative aspect-square w-full rounded-xl overflow-hidden border border-[#C6A878]/20 cursor-pointer group"
                >
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => handleOpenAlbum(album.id)}
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
                    onClick={() => void playQueue(albumTracks, 0)}
                    aria-label={`Play album ${album.title}`}
                    className="w-9 h-9 rounded-full bg-[#321B22] hover:bg-[#542C35] border border-[#C6A878]/35 flex items-center justify-center shrink-0 text-[#C6A878] cursor-pointer"
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recommended Songs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-2xl font-semibold text-[#F1EDE6]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {t.featuredMasterworks}
          </h3>
          <button
            type="button"
            onClick={() => setActiveTab('all-songs')}
            className="inline-flex items-center gap-1 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
          >
            <span>{t.viewAllSongs}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <MusicTrackList tracks={curatedTracks.slice(0, 4)} />
      </section>

      {/* Favorite Artists & My Playlists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-2xl font-semibold text-[#F1EDE6]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {t.composersTitle}
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('artists')}
              className="inline-flex items-center gap-1 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
            >
              <span>{t.tabArtists}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {artists.map((artist) => (
              <button
                key={artist.id}
                type="button"
                onClick={() => handleOpenArtist(artist.id)}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-[#C6A878]/15 bg-[#181716] hover:bg-[#22201E] hover:border-[#C6A878]/35 text-left transition-colors cursor-pointer"
              >
                <img
                  src={artist.portraitUrl}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#C6A878]/30 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#F1EDE6] truncate">{artist.name}</p>
                  <p className="text-xs text-[#A49C92] truncate">{artist.eraOrRole}</p>
                </div>
                <Mic2 className="w-4 h-4 text-[#C6A878] shrink-0" />
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-2xl font-semibold text-[#F1EDE6]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {t.myPlaylistsTitle}
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('my-playlists')}
              className="inline-flex items-center gap-1 text-xs text-[#C6A878] hover:text-[#D6AD73] cursor-pointer"
            >
              <span>{t.myCollection}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="rounded-2xl border border-[#C6A878]/15 bg-[#181716] p-6 text-center space-y-3">
              <Disc3 className="w-8 h-8 text-[#C6A878] mx-auto opacity-80" />
              <p className="text-sm text-[#F1EDE6] font-medium">
                {t.myPlaylistsTitle}
              </p>
              <p className="text-xs text-[#A49C92]">
                {t.emptyPlaylistsPrompt}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('my-playlists')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#321B22] hover:bg-[#542C35] border border-[#C6A878]/35 text-xs font-medium text-[#F1EDE6] cursor-pointer"
              >
                <span>{t.newPlaylist}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {playlists.slice(0, 4).map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  onClick={() => handleOpenPlaylist(playlist.id)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-[#C6A878]/15 bg-[#181716] hover:bg-[#22201E] hover:border-[#C6A878]/35 text-left transition-colors cursor-pointer"
                >
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#C6A878]/25 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#F1EDE6] truncate">{playlist.name}</p>
                    <p className="text-xs text-[#A49C92] truncate">
                      {playlist.trackIds.length} {t.trackPlural}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C6A878] shrink-0" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Music Categories */}
      <section className="space-y-4">
        <h3
          className="text-2xl font-semibold text-[#F1EDE6]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {t.categoriesTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catTracks = cat.trackIds
              .map((id) => trackById.get(id))
              .filter((t): t is NonNullable<typeof t> => Boolean(t))

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => void playQueue(catTracks, 0)}
                className="rounded-2xl border border-[#C6A878]/20 bg-[#22201E]/75 hover:bg-[#321B22]/75 p-5 text-left transition-colors cursor-pointer group"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#C6A878] mb-1">
                  {catTracks.length} {t.trackPlural}
                </p>
                <h4 className="text-lg font-semibold text-[#F1EDE6] group-hover:text-[#D6AD73]">
                  {cat.name}
                </h4>
                <p className="text-xs text-[#A49C92] mt-1">{cat.subtitle}</p>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
