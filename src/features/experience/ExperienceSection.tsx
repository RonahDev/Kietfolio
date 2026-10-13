import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { experienceData, LOGISTICS_SOFTWARE_CORRELATIONS } from '../../data/experience'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import {
  Building2,
  TrendingUp,
  GitBranch,
  ArrowRight,
  Workflow,
  Cpu,
  Layers,
} from 'lucide-react'

export const ExperienceSection: React.FC = () => {
  const { t, language } = useLanguage()

  const correlationIcons = {
    queues: Layers,
    validation: Cpu,
    throughput: Workflow,
  }

  return (
    <section
      id="experience"
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="Professional Experience"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.experience.badge}
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />

        {/* Experience Timeline Item */}
        <div className="space-y-12">
          {experienceData.map((exp) => (
            <div key={exp.id} className="relative">
              {/* Main Timeline Card */}
              <Card className="border-l-4 border-l-[#00d2ff] bg-[#0a1224]">
                {/* Header: Roles & Hub Telemetry */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#172847]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="accent" hasDot>
                        {t.experience.currentRoleBadge}
                      </Badge>
                      <span className="text-xs font-mono text-[#64748b]">
                        {exp.period[language]}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
                      {exp.role[language]}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-sm font-mono text-[#94a3b8]">
                      <Building2 className="w-4 h-4 text-[#00d2ff]" />
                      <span className="font-semibold text-[#f1f5f9]">{exp.company}</span>
                      <span className="text-[#64748b]">—</span>
                      <span>{exp.hub}</span>
                      <span className="text-[#64748b]">({exp.location})</span>
                    </div>
                  </div>

                  {/* Operational Career Progression Pill */}
                  <div className="bg-[#0f1b33] border border-[#172847] p-3 rounded-sm font-mono text-xs max-w-sm">
                    <div className="text-[10px] uppercase text-[#64748b] mb-1 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Career Progression at Facility</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8]">
                      <span className="line-through text-[#64748b]">Staff (2 Yrs)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00d2ff]" />
                      <span className="font-bold text-[#00d2ff]">Senior Analyst</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="py-6 space-y-4">
                  <p className="text-base text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                    {exp.summary[language]}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-mono uppercase text-[#64748b] tracking-wider">
                      Key Operational Highlights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-['Be_Vietnam_Pro',sans-serif]">
                      {exp.highlights[language].map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-sm bg-[#0f1b33]/60 border border-[#172847] text-sm text-[#f1f5f9] hover:border-[#00d2ff]/30 transition-colors"
                        >
                          <span className="text-xs font-mono font-bold text-[#00d2ff] mt-0.5">
                            0{idx + 1}.
                          </span>
                          <span className="leading-relaxed">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Applied Skills Tags */}
                <div className="pt-6 border-t border-[#172847] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-[#64748b] mr-2">
                    {t.experience.appliedDisciplines}:
                  </span>
                  {exp.skillsApplied.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-mono bg-[#0f1b33] border border-[#172847] text-[#94a3b8] rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Correlation Blueprint: Operational Reality -> Software Engineering */}
              <div className="mt-8 p-6 sm:p-8 rounded-sm bg-[#0a1224] border border-[#172847] relative">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
                  <h4 className="font-mono text-sm uppercase text-[#f1f5f9] font-semibold tracking-wider">
                    {t.experience.operationalConnectionTitle}
                  </h4>
                </div>

                <p className="text-sm text-[#94a3b8] leading-relaxed mb-6 font-['Be_Vietnam_Pro',sans-serif]">
                  {exp.operationalInsights[language]}
                </p>

                {/* Conceptual Translation Diagram */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {LOGISTICS_SOFTWARE_CORRELATIONS.map((point) => {
                    const IconComp = correlationIcons[point.iconType]
                    return (
                      <div
                        key={point.id}
                        className="p-4 rounded-sm bg-[#0f1b33] border border-[#172847] space-y-2 font-mono text-xs transition-all hover:border-[#00d2ff]/40"
                      >
                        <div className="flex items-center gap-2 text-[#64748b]">
                          <IconComp className="w-3.5 h-3.5 text-[#00d2ff]" />
                          <span className="uppercase text-[10px]">Logistics Domain</span>
                        </div>
                        <div className="text-[#f1f5f9] font-medium font-sans">
                          {point.logistics[language]}
                        </div>
                        <div className="pt-2 border-t border-[#172847] text-[#38bdf8] font-sans">
                          ↳ {point.software[language]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
