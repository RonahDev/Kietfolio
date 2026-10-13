import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { projectsData } from '../../data/projects'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { ProjectCard } from './ProjectCard'
import { Info, Sparkles, Layers, Code2 } from 'lucide-react'

export const ProjectsSection: React.FC = () => {
  const { t, language } = useLanguage()
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredProjects =
    filterCategory === 'all'
      ? projectsData
      : projectsData.filter((p) => p.category === filterCategory)

  return (
    <section
      id="projects"
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="Selected Projects"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.projects.badge}
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />

        {/* Top Controls: Filter Category Tabs & Notice */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-sm bg-[#0a1224] border border-[#172847] font-mono text-xs">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'all'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Tất Cả Dự Án' : 'All Projects'}</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('fullstack')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'fullstack'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Full-Stack</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('creative')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'creative'
                  ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creative 3D</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#64748b] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
            <span>TOTAL: {projectsData.length} SYSTEMS DOCUMENTED</span>
          </div>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="mb-10 p-4 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center gap-3 text-xs font-mono text-[#94a3b8]">
          <Info className="w-4 h-4 text-[#00d2ff] shrink-0" />
          <span>
            {t.projects.prototypeNotice}
          </span>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
