import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { skillCategories, softSkillsData } from '../../data/skills'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { TechIcon } from '../../components/ui/TechIcons'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { cn } from '../../utils/cn'
import {
  Code,
  Server,
  Terminal,
  Database,
  Cpu,
  Sparkles,
  ShieldAlert,
  Users,
  Flame,
  BrainCircuit,
  GraduationCap,
  Layers,
  Truck,
  Compass,
  ArrowRight,
} from 'lucide-react'

export const SkillsSection: React.FC = () => {
  const { t, language } = useLanguage()
  const sectionRef = useScrollReveal()
  const [activeTab, setActiveTab] = useState<'technical' | 'operational'>('technical')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categoryIcons = {
    frontend: Code,
    backend: Server,
    languages: Terminal,
    database: Database,
    tools: Cpu,
    creative: Sparkles,
  }

  const softSkillIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'driver-coordination': Users,
    'peak-sale-crisis': Flame,
    'critical-thinking-pressure': BrainCircuit,
    'learning-dedication': GraduationCap,
  }

  const filteredCategories =
    selectedCategory === 'all'
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === selectedCategory)

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="Skills & Capabilities"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.skills.badge}
          title={t.skills.title}
          subtitle={t.skills.subtitle}
        />

        {/* Top-Level Mode Switcher: Kỹ Năng Chuyên Ngành vs Kỹ Năng Mềm & Vận Hành Thực Chiến */}
        <div className="mb-10 p-1.5 rounded-sm bg-[#0a1224] border border-[#172847] inline-flex flex-col sm:flex-row gap-2 w-full sm:w-auto shadow-lg shadow-black/40">
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={cn(
              'flex items-center justify-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]',
              activeTab === 'technical'
                ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_20px_rgba(0,210,255,0.4)]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f1b33]'
            )}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>{t.skills.techTab}</span>
            <span
              className={cn(
                'ml-1 px-1.5 py-0.5 text-[10px] rounded-xs font-mono',
                activeTab === 'technical'
                  ? 'bg-[#050a14]/20 text-[#050a14]'
                  : 'bg-[#172847] text-[#94a3b8]'
              )}
            >
              TECH
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('operational')}
            className={cn(
              'flex items-center justify-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]',
              activeTab === 'operational'
                ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_20px_rgba(0,210,255,0.4)]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f1b33]'
            )}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>{t.skills.softTab}</span>
            <span
              className={cn(
                'ml-1 px-1.5 py-0.5 text-[10px] rounded-xs font-mono',
                activeTab === 'operational'
                  ? 'bg-[#050a14] text-[#00d2ff]'
                  : 'bg-[#172847] text-[#00d2ff]'
              )}
            >
              HUB 63BDG02
            </span>
          </button>
        </div>

        {/* Tab 1: Kỹ Năng Chuyên Ngành (Technical Stack) */}
        {activeTab === 'technical' && (
          <div>
            {/* Honest Representation Disclaimer Notice */}
            <div className="mb-8 p-4 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center gap-3 text-xs font-mono text-[#94a3b8]">
              <ShieldAlert className="w-4 h-4 text-[#00d2ff] shrink-0" />
              <span>{t.skills.noArbitraryBarNotice}</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-xs font-mono rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_15px_rgba(0,210,255,0.35)]'
                    : 'bg-[#0a1224] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#172847] hover:border-[#00d2ff]/40'
                }`}
              >
                [ALL_DISCIPLINES]
              </button>

              {skillCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 text-xs font-mono rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer ${
                      isSelected
                        ? 'bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_15px_rgba(0,210,255,0.35)]'
                        : 'bg-[#0a1224] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#172847] hover:border-[#00d2ff]/40'
                    }`}
                  >
                    {cat.title[language]}
                  </button>
                )
              })}
            </div>

            {/* Skill Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((cat) => {
                const IconComp = categoryIcons[cat.id] || Terminal
                return (
                  <Card
                    key={cat.id}
                    className={cn(
                      'flex flex-col justify-between hover:border-[#00d2ff]/40 transition-colors',
                      cat.id === 'languages' &&
                        'border-[#00d2ff]/45 bg-[#0b1528] shadow-[0_0_25px_rgba(0,210,255,0.08)]'
                    )}
                  >
                    <div>
                      {/* Category Header */}
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#172847]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-sm bg-[#0f1b33] border border-[#172847] flex items-center justify-center text-[#00d2ff] shadow-[0_0_8px_rgba(0,210,255,0.15)]">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#f1f5f9]">
                            {cat.title[language]}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#64748b]">
                          {cat.skills.length} TECH
                        </span>
                      </div>

                      <p className="text-xs text-[#94a3b8] mb-6 font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                        {cat.subtitle[language]}
                      </p>

                      {/* Skills List with Logos */}
                      <div className="space-y-2">
                        {cat.skills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="group/skill flex items-center justify-between p-2.5 rounded-sm bg-[#0f1b33]/60 border border-[#172847] hover:border-[#00d2ff]/40 hover:bg-[#101e38] transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center justify-center shrink-0 shadow-sm group-hover/skill:border-[#00d2ff]/50 transition-colors">
                                <TechIcon name={skill.name} className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-mono text-xs font-medium text-[#f1f5f9] group-hover/skill:text-[#00d2ff] transition-colors truncate">
                                {skill.name}
                              </span>
                            </div>
                            {skill.badge && (
                              <Badge
                                variant={
                                  skill.badge === 'Primary' ||
                                  skill.badge === 'Core' ||
                                  skill.badge === 'Active'
                                    ? 'accent'
                                    : skill.badge === '3D Graphics' ||
                                        skill.badge === 'Motion'
                                    ? 'cyan'
                                    : 'default'
                                }
                                className="text-[10px] py-0.5 px-2 shrink-0 ml-2"
                              >
                                {skill.badge}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#172847] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                      <span>VERIFIED // TRUE_STACK</span>
                      <span className="text-[#00d2ff]">ACTIVE</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Kỹ Năng Mềm & Vận Hành Thực Chiến (Soft & Operational Skills) */}
        {activeTab === 'operational' && (
          <div className="space-y-8">
            {/* Operational Context Header Card */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#0a1224] border border-[#00d2ff]/30 shadow-[0_0_30px_rgba(0,210,255,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#00d2ff]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#0f1b33] border border-[#00d2ff]/40 text-[#00d2ff] font-mono text-[11px] mb-3">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t.skills.hubTelemetryBadge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-mono text-[#f1f5f9] mb-2 tracking-tight">
                    {t.skills.hubTelemetryTitle}
                  </h3>
                  <p className="text-sm text-[#94a3b8] max-w-3xl font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                    {t.skills.hubTelemetryDesc}
                  </p>
                </div>

                {/* Quick Telemetry Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                  <div className="p-3 rounded-sm bg-[#0f1b33] border border-[#172847] text-center">
                    <div className="font-mono text-base font-bold text-[#00d2ff]">~50</div>
                    <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Tài Xế Giao Nhận</div>
                  </div>
                  <div className="p-3 rounded-sm bg-[#0f1b33] border border-[#172847] text-center">
                    <div className="font-mono text-base font-bold text-[#00d2ff]">63BDG02</div>
                    <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Mã Trạm SPX</div>
                  </div>
                  <div className="p-3 rounded-sm bg-[#0f1b33] border border-[#172847] text-center">
                    <div className="font-mono text-base font-bold text-[#00d2ff]">SALE PEAK</div>
                    <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Xử Lý Quá Tải</div>
                  </div>
                  <div className="p-3 rounded-sm bg-[#0f1b33] border border-[#172847] text-center">
                    <div className="font-mono text-base font-bold text-[#00d2ff]">ROOT-CAUSE</div>
                    <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Tư Duy Phản Biện</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Soft / Operational Competencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {softSkillsData.map((item) => {
                const IconComp = softSkillIcons[item.id] || Compass
                return (
                  <Card
                    key={item.id}
                    className="flex flex-col justify-between hover:border-[#00d2ff]/45 hover:shadow-[0_0_25px_rgba(0,210,255,0.08)] transition-all bg-[#0a1224]"
                  >
                    <div>
                      {/* Header with Tag & Metric */}
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#172847]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-sm bg-[#0f1b33] border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.15)]">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-[#00d2ff] tracking-wider block">
                              {item.tag[language]}
                            </span>
                            <span className="text-[11px] font-mono text-[#64748b] block">
                              {item.contextRole[language]}
                            </span>
                          </div>
                        </div>

                        {item.metric && (
                          <Badge variant="cyan" className="text-[10px] py-0.5 px-2 font-mono">
                            {item.metric}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-base sm:text-lg font-bold font-mono text-[#f1f5f9] mb-3 leading-snug">
                        {item.title[language]}
                      </h4>

                      {/* Main Operational Description */}
                      <p className="text-xs sm:text-sm text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed mb-6">
                        {item.description[language]}
                      </p>

                      {/* Engineering Translation / Practical Impact */}
                      <div className="p-3.5 rounded-sm bg-[#0f1b33]/70 border border-[#172847]">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#00d2ff] mb-1.5 uppercase font-semibold">
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.skills.softImpactLabel}</span>
                        </div>
                        <p className="text-xs text-[#cbd5e1] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                          {item.practicalImpact[language]}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 pt-4 border-t border-[#172847] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                      <span>FACILITY // SPX_63BDG02</span>
                      <span className="text-[#00d2ff]">VERIFIED_GROUND_EXP</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
