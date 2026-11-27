import React, { useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Disc3,
  FolderPlus,
  Heart,
  Home,
  ListMusic,
  Mic2,
  Music2,
  Settings,
  Sparkles,
  Upload,
} from 'lucide-react'
import { useMusicTheater } from '../hooks/useMusicTheater'
import type { MusicNavTab } from '../types/music'

interface NavItemConfig {
  id: MusicNavTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'all-songs', label: 'All Songs', icon: Music2 },
  { id: 'albums', label: 'Albums', icon: Disc3 },
  { id: 'artists', label: 'Artists', icon: Mic2 },
  { id: 'my-playlists', label: 'My Playlists', icon: ListMusic },
  { id: 'imported-music', label: 'Imported Music', icon: Upload },
  { id: 'recently-played', label: 'Recently Played', icon: Clock },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface MusicSidebarProps {
  onBackToPortfolio: () => void
  onOpenImportModal: () => void
}

export const MusicSidebar: React.FC<MusicSidebarProps> = ({
  onBackToPortfolio,
  onOpenImportModal,
}) => {
  const { activeTab, setActiveTab, setSelectedPlaylistId, importedTracks, playlists, favoriteIds } =
    useMusicTheater()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSelectTab = (tab: MusicNavTab) => {
    setActiveTab(tab)
    if (tab !== 'my-playlists') {
      setSelectedPlaylistId(null)
    }
    setMobileMenuOpen(false)
  }

  const getBadgeCount = (tab: MusicNavTab): number | null => {
    if (tab === 'imported-music') return importedTracks.length
    if (tab === 'my-playlists') return playlists.length
    if (tab === 'favorites') return favoriteIds.length
    return null
  }

  return (
    <>
      {/* Desktop Expandable Sidebar */}
      <aside
        aria-label="Private Music Theater Navigation"
        className={`hidden md:flex flex-col shrink-0 bg-[#181716] border-r border-[#C6A878]/15 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#C6A878]/10">
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#542C35] border border-[#C6A878]/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#C6A878]" />
              </div>
              <div className="truncate">
                <p
                  className="text-base font-semibold text-[#F1EDE6] leading-none truncate"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Music Theater
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#C6A878] mt-1">
                  Private Box
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-2 rounded-lg text-[#A49C92] hover:text-[#F1EDE6] hover:bg-[#22201E] transition-colors cursor-pointer mx-auto md:mx-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Collection Import Action */}
        <div className="p-3 border-b border-[#C6A878]/10">
          <button
            type="button"
            onClick={onOpenImportModal}
            className={`w-full flex items-center justify-center gap-2 rounded-xl border border-[#C6A878]/35 bg-[#321B22]/75 hover:bg-[#542C35] text-[#F1EDE6] py-2.5 px-3 text-xs font-medium tracking-wide transition-colors cursor-pointer ${
              collapsed ? 'px-0' : ''
            }`}
            title="Import Audio Files to My Music Collection"
          >
            <FolderPlus className="w-4 h-4 text-[#C6A878] shrink-0" />
            {!collapsed && <span>Import Audio</span>}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            const badge = getBadgeCount(item.id)

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#321B22] text-[#F1EDE6] border border-[#C6A878]/30'
                    : 'text-[#A49C92] hover:text-[#F1EDE6] hover:bg-[#22201E] border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${active ? 'text-[#C6A878]' : 'text-[#A49C92]'}`}
                  />
                  {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                </div>
                {!collapsed && badge !== null && badge > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#22201E] text-[#C6A878]">
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Back to Portfolio */}
        <div className="p-3 border-t border-[#C6A878]/10">
          <button
            type="button"
            onClick={onBackToPortfolio}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#A49C92] hover:text-[#F1EDE6] hover:bg-[#22201E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-[#C6A878]" />
            {!collapsed && <span>Back to Portfolio</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Secondary Drawer for All 10 Tabs */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 bottom-16 top-16 z-40 bg-[#101010]/95 backdrop-blur-md p-4 overflow-y-auto border-t border-[#C6A878]/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C6A878]">
              Concert Hall Sections
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#A49C92] hover:text-[#F1EDE6] px-2 py-1"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium ${
                    active
                      ? 'bg-[#321B22] border-[#C6A878]/40 text-[#F1EDE6]'
                      : 'bg-[#181716] border-[#C6A878]/10 text-[#A49C92]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#C6A878] shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={onBackToPortfolio}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#C6A878]/25 bg-[#181716] text-xs text-[#F1EDE6]"
          >
            <ArrowLeft className="w-4 h-4 text-[#C6A878]" />
            <span>Back to Portfolio</span>
          </button>
        </div>
      )}

      {/* Mobile Primary Bottom Navigation */}
      <nav
        aria-label="Mobile Music Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-[#181716] border-t border-[#C6A878]/20 grid grid-cols-5"
      >
        {[
          NAV_ITEMS[0],
          NAV_ITEMS[1],
          NAV_ITEMS[5],
          NAV_ITEMS[6],
        ].map((item) => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
                active ? 'text-[#C6A878]' : 'text-[#A49C92]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-full px-1">{item.label.split(' ')[0]}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${
            mobileMenuOpen ? 'text-[#C6A878]' : 'text-[#A49C92]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  )
}
