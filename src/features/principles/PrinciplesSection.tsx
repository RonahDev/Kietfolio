import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { engineeringPrinciples } from '../../data/principles'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Card } from '../../components/ui/Card'
import { Terminal, Shield, Check, GitCommit, Box, Cpu } from 'lucide-react'

export const PrinciplesSection: React.FC = () => {
  const { t, language } = useLanguage()

  const systemBadges = [
    { icon: Terminal, label: 'Strict TypeScript' },
    { icon: Shield, label: 'Schema Validation' },
    { icon: Box, label: 'Docker Environments' },
    { icon: GitCommit, label: 'Git Hygiene' },
    { icon: Cpu, label: 'WCAG & Reduced-Motion' },
  ]

  return (
    <section
      id="principles"
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="Engineering Principles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.principles.badge}
          title={t.principles.title}
          subtitle={t.principles.subtitle}
        />

        {/* Architecture Data Flow Schematic Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-sm bg-[#0a1224] border border-[#172847] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00d2ff] font-bold">
                ARCHITECTURAL PATTERN // STANDARD DATA FLOW
              </span>
              <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
                {language === 'en'
                  ? 'Boundary-Guarded Full-Stack Pipeline'
                  : 'Đường Ống Dữ Liệu Full-Stack Có Rào Chắn Ranh Giới'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {systemBadges.map((badge, idx) => {
                const IconComp = badge.icon
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono bg-[#0f1b33] border border-[#172847] text-[#94a3b8] rounded-sm"
                  >
                    <IconComp className="w-3 h-3 text-[#00d2ff]" />
                    <span>{badge.label}</span>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Interactive Flow Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-sm bg-[#0f1b33]/80 border border-[#172847] space-y-1.5 hover:border-[#00d2ff]/40 transition-colors">
              <div className="text-[10px] text-[#00d2ff] font-bold">01. PRESENTATION</div>
              <div className="font-semibold text-[#f1f5f9]">React & Tailwind</div>
              <div className="text-[11px] text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif]">
                Accessible UI, state separation, immediate client feedback.
              </div>
            </div>

            <div className="p-3.5 rounded-sm bg-[#0f1b33]/80 border border-[#172847] space-y-1.5 hover:border-[#38bdf8]/40 transition-colors">
              <div className="text-[10px] text-[#38bdf8] font-bold">02. VALIDATION GATEWAY</div>
              <div className="font-semibold text-[#f1f5f9]">Schema Contracts</div>
              <div className="text-[11px] text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif]">
                Input sanitization, anti-bot honeypots, typed request payloads.
              </div>
            </div>

            <div className="p-3.5 rounded-sm bg-[#0f1b33]/80 border border-[#172847] space-y-1.5 hover:border-[#00d2ff]/40 transition-colors">
              <div className="text-[10px] text-[#00d2ff] font-bold">03. SERVICE LAYER</div>
              <div className="font-semibold text-[#f1f5f9]">Node.js / Express</div>
              <div className="text-[11px] text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif]">
                Business domain logic, transaction isolation, error middleware.
              </div>
            </div>

            <div className="p-3.5 rounded-sm bg-[#0f1b33]/80 border border-[#172847] space-y-1.5 hover:border-[#38bdf8]/40 transition-colors">
              <div className="text-[10px] text-[#38bdf8] font-bold">04. STORAGE & INFRA</div>
              <div className="font-semibold text-[#f1f5f9]">PostgreSQL & Docker</div>
              <div className="text-[11px] text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif]">
                Foreign key constraints, ACID compliance, reproducible containers.
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Engineering Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engineeringPrinciples.map((principle) => (
            <Card
              key={principle.id}
              className="flex flex-col justify-between group hover:border-[#00d2ff]/40"
            >
              <div className="space-y-4">
                {/* Index & Category Tag */}
                <div className="flex items-center justify-between pb-3 border-b border-[#172847]">
                  <span className="font-mono text-2xl font-extrabold text-[#00d2ff]">
                    {principle.index}
                  </span>
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-sm bg-[#0f1b33] border border-[#172847] text-[#64748b]">
                    {principle.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
                  {principle.title[language]}
                </h3>

                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
                  {principle.description[language]}
                </p>
              </div>

              {/* Concrete Practical Implementation */}
              <div className="mt-6 pt-4 border-t border-[#172847] space-y-1.5 bg-[#0f1b33]/50 p-3 rounded-sm border border-[#172847]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#38bdf8] font-bold">
                  <Check className="w-3 h-3 text-[#00d2ff]" />
                  <span>{t.principles.practicalLabel}</span>
                </div>
                <p className="text-xs text-[#94a3b8] font-mono leading-relaxed">
                  {principle.practicalApplication[language]}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
