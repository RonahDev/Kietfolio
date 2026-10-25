import React, { useState, useMemo } from 'react'
import { useLanguage, useScrollReveal, useDebounce } from '@/hooks'
import { SectionHeader } from '@/components/ui'
import { useProjects } from '../hooks/useProjects'
import { ProjectCard } from './ProjectCard'
import { Info, Sparkles, Layers, Code2, Loader2, Search, X } from 'lucide-react'

export const ProjectsSection: React.FC = () => {
  const { t, language } = useLanguage()
  const sectionRef = useScrollReveal()
  const {
    projects,
    activeCategory,
    setActiveCategory,
    isLoading,
    error,
  } = useProjects('all')

  const [searchQuery, setSearchQuery] = useState('')
  // Debounce search query to reduce redundant filtering and re-rendering on rapid typing
  const debouncedSearch = useDebounce(searchQuery, 300)

  const filteredProjects = useMemo(() => {
    if (!debouncedSearch.trim()) return projects
    const q = debouncedSearch.toLowerCase().trim()
    return projects.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchSubtitle = p.subtitle[language]?.toLowerCase().includes(q)
      const matchTech = p.techStack.some((tech) => tech.toLowerCase().includes(q))
      return matchTitle || matchSubtitle || matchTech
    })
  }, [projects, debouncedSearch, language])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="Selected Projects"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.projects.badge}
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />

        {/* Top Controls: Filter Category Tabs & Debounced Search Input */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-sm bg-[#0a1224] border border-[#172847] font-mono text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Tất Cả Dự Án' : 'All Projects'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('fullstack')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'fullstack'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Full-Stack</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('creative')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeCategory === 'creative'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creative 3D</span>
            </button>
          </div>

          {/* Debounced Search Field */}
          <div className="relative min-w-[260px] sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm theo tên, công nghệ...' : 'Search by title, tech...'}
              className="w-full pl-9 pr-8 py-1.5 rounded-sm bg-[#0a1224] border border-[#172847] hover:border-[#00d2ff]/40 focus:border-[#00d2ff] text-xs font-mono text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f1f5f9] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Counter */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] mb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
            <span>TOTAL: {filteredProjects.length} SYSTEMS DOCUMENTED</span>
          </div>
          {debouncedSearch && (
            <span className="text-[#00d2ff]">
              FILTERED BY &quot;{debouncedSearch}&quot;
            </span>
          )}
        </div>

        {/* Prototype Transparency Notice */}
        <div className="mb-10 p-4 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center gap-3 text-xs font-mono text-[#94a3b8]">
          <Info className="w-4 h-4 text-[#00d2ff] shrink-0" />
          <span>{t.projects.prototypeNotice}</span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center text-xs font-mono text-[#00d2ff] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>[RETRIEVING_PROJECT_TOPOLOGY...]</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-sm bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200">
            {error}
          </div>
        )}

        {/* Project Cards Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
