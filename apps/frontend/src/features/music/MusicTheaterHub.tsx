import React, { useState } from 'react'
import { Film, FolderPlus, Globe, Search } from 'lucide-react'
import { MusicTheaterProvider } from './context/MusicTheaterContext'
import { useMusicTheater } from './hooks/useMusicTheater'
import { useMusicI18n } from './hooks/useMusicI18n'
import { MusicDashboardView } from './components/MusicDashboardView'
import { MusicImportModal } from './components/MusicImportModal'
import {
  AlbumsView,
  AllSongsView,
  ArtistsView,
  DiscoverView,
  FavoritesView,
  MusicSettingsView,
  RecentlyPlayedView,
} from './components/MusicLibraryViews'
import { MusicPlayerBar } from './components/MusicPlayerBar'
import { MusicSidebar } from './components/MusicSidebar'
import { MusicTheaterIntro } from './components/MusicTheaterIntro'
import { ImportedMusicView, MyPlaylistsView } from './components/MyMusicCollectionView'

interface MusicTheaterHubProps {
  onBackToPortfolio: () => void
}

const MusicTheaterShell: React.FC<MusicTheaterHubProps> = ({ onBackToPortfolio }) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    introCompleted,
    completeIntro,
    settings,
    selectedPlaylistId,
  } = useMusicTheater()
  const { language, toggleLanguage, t } = useMusicI18n()

  const [importModalOpen, setImportModalOpen] = useState(false)

  const themeBackgroundStyle =
    settings.themePreset === 'deep-velvet'
      ? {
          backgroundImage:
            'radial-gradient(ellipse at 70% 0%, rgba(84,44,53,0.34) 0%, #101010 70%)',
        }
      : settings.themePreset === 'warm-amber'
        ? {
            backgroundImage:
              'radial-gradient(ellipse at 65% 0%, rgba(214,173,115,0.12) 0%, #101010 68%)',
          }
        : undefined

  const handleHeaderSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value.trim() && activeTab !== 'all-songs') {
      setActiveTab('all-songs')
    }
  }

  return (
    <div
      data-testid="music-theater-hub"
      className="min-h-screen bg-[#101010] text-[#F1EDE6] flex flex-col md:flex-row"
      style={themeBackgroundStyle}
    >
      {!introCompleted && (
        <MusicTheaterIntro
          reduceMotionOverride={settings.reduceMotionOverride}
          onComplete={completeIntro}
        />
      )}

      <MusicSidebar
        onBackToPortfolio={onBackToPortfolio}
        onOpenImportModal={() => setImportModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Concert Hall Bar */}
        <header className="sticky top-0 z-20 h-16 px-4 sm:px-8 bg-[#101010]/90 backdrop-blur-md border-b border-[#C6A878]/15 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A49C92] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleHeaderSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Header search music"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#181716] border border-[#C6A878]/20 text-xs sm:text-sm text-[#F1EDE6] placeholder:text-[#A49C92]/65 focus:outline-none focus:border-[#C6A878]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#C6A878]/30 bg-[#181716] hover:bg-[#22201E] text-xs font-mono text-[#C6A878] transition-colors cursor-pointer shrink-0"
              title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              aria-label={language === 'vi' ? 'Chuyển sang Tiếng Anh' : 'Switch to Vietnamese'}
            >
              <Globe className="w-3.5 h-3.5 text-[#C6A878]" />
              <span className="font-bold">{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.hash = 'cinema'
                window.dispatchEvent(
                  new CustomEvent('kietfolio:navigate-view', { detail: { view: 'cinema' } })
                )
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#a51d35]/60 bg-[#a51d35]/20 hover:bg-[#a51d35]/40 text-xs font-mono text-rose-200 transition-colors cursor-pointer shrink-0"
              title="Chuyển sang Rạp Phim 3D Cinema Stream"
            >
              <Film className="w-3.5 h-3.5 text-[#d4af70]" />
              <span className="font-bold">{t.cinemaBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C6A878]/35 bg-[#321B22]/85 hover:bg-[#542C35] text-xs font-medium text-[#F1EDE6] transition-colors cursor-pointer shrink-0"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#C6A878]" />
              <span className="hidden sm:inline">{t.myCollection}</span>
              <span className="sm:hidden">{t.importShort}</span>
            </button>
          </div>
        </header>

        {/* Active View Area (padded safely above fixed bottom player + mobile nav) */}
        <main className="flex-1 px-4 sm:px-8 py-6 pb-40 md:pb-28 max-w-6xl w-full mx-auto">
          {activeTab === 'home' && (
            <MusicDashboardView onOpenImportModal={() => setImportModalOpen(true)} />
          )}
          {activeTab === 'discover' && <DiscoverView />}
          {activeTab === 'all-songs' && <AllSongsView />}
          {activeTab === 'albums' && <AlbumsView />}
          {activeTab === 'artists' && <ArtistsView />}
          {activeTab === 'my-playlists' && (
            <MyPlaylistsView onOpenImportModal={() => setImportModalOpen(true)} />
          )}
          {activeTab === 'imported-music' && <ImportedMusicView />}
          {activeTab === 'recently-played' && <RecentlyPlayedView />}
          {activeTab === 'favorites' && <FavoritesView />}
          {activeTab === 'settings' && <MusicSettingsView />}
        </main>
      </div>

      <MusicPlayerBar />

      <MusicImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        defaultPlaylistId={selectedPlaylistId ?? ''}
      />
    </div>
  )
}

export const MusicTheaterHub: React.FC<MusicTheaterHubProps> = ({ onBackToPortfolio }) => {
  return (
    <MusicTheaterProvider>
      <MusicTheaterShell onBackToPortfolio={onBackToPortfolio} />
    </MusicTheaterProvider>
  )
}
