import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { projectsData } from '../../data/projects'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { ProjectCard } from './ProjectCard'
import { Info } from 'lucide-react'

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage()

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

        {/* Prototype Transparency Notice */}
        <div className="mb-12 p-4 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center gap-3 text-xs font-mono text-[#94a3b8]">
          <Info className="w-4 h-4 text-[#00d2ff] shrink-0" />
          <span>
            {t.projects.prototypeNotice} All projects are documented with honest architectural scope and clear repository targets.
          </span>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
