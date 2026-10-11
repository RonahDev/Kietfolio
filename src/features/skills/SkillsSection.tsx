import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { skillCategories } from '../../data/skills'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import {
  Code,
  Server,
  Terminal,
  Database,
  Cpu,
  Sparkles,
  ShieldAlert,
} from 'lucide-react'

export const SkillsSection: React.FC = () => {
  const { t, language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categoryIcons = {
    frontend: Code,
    backend: Server,
    languages: Terminal,
    database: Database,
    tools: Cpu,
    creative: Sparkles,
  }

  const filteredCategories =
    selectedCategory === 'all'
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === selectedCategory)

  return (
    <section
      id="skills"
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="Technical Skills"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.skills.badge}
          title={t.skills.title}
          subtitle={t.skills.subtitle}
        />

        {/* Honest Representation Disclaimer Notice */}
        <div className="mb-10 p-4 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center gap-3 text-xs font-mono text-[#94a3b8]">
          <ShieldAlert className="w-4 h-4 text-[#00d2ff] shrink-0" />
          <span>{t.skills.noArbitraryBarNotice}</span>
        </div>

        {/* Category Filter Pills with interactive feedback */}
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
                className="flex flex-col justify-between hover:border-[#00d2ff]/40 transition-colors"
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

                  {/* Skills List */}
                  <div className="space-y-2">
                    {cat.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-sm bg-[#0f1b33]/60 border border-[#172847] hover:border-[#00d2ff]/30 transition-colors"
                      >
                        <span className="font-mono text-xs font-medium text-[#f1f5f9]">
                          {skill.name}
                        </span>
                        {skill.badge && (
                          <Badge
                            variant={
                              skill.badge === 'Primary' || skill.badge === 'Core'
                                ? 'accent'
                                : skill.badge === '3D Graphics' || skill.badge === 'Motion'
                                ? 'cyan'
                                : 'default'
                            }
                            className="text-[10px] py-0.5 px-2"
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
    </section>
  )
}
