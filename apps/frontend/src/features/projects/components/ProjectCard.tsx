import React, { useState } from 'react'
import type { ProjectItem } from '@/types'
import { useLanguage, useAuth } from '@/hooks'
import { Card, Badge, Button, GithubIcon } from '@/components/ui'
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Crown,
  Lock,
  Terminal,
} from 'lucide-react'

interface ProjectCardProps {
  project: ProjectItem
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project }) => {
  const { t, language } = useLanguage()
  const { isVip, isAdmin, openVipModal } = useAuth()
  const [isExpanded, setIsExpanded] = useState(project.isFeatured)
  const [showVipBlueprint, setShowVipBlueprint] = useState(false)

  const isVipUnlocked = isVip || isAdmin

  return (
    <Card
      className={`relative flex flex-col justify-between transition-all duration-300 ${
        project.isFeatured
          ? 'border-[#00d2ff]/40 bg-[#0a1224] shadow-[0_0_35px_rgba(0,210,255,0.08)]'
          : 'bg-[#0a1224] hover:border-[#00d2ff]/40'
      }`}
    >
      <div>
        {/* Top Header: Category & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#172847]">
          <div className="flex items-center gap-2">
            <Badge
              variant={project.isFeatured ? 'accent' : 'default'}
              hasDot={project.isFeatured}
            >
              {project.statusBadge[language]}
            </Badge>
            {project.isFeatured && (
              <span className="text-[10px] font-mono text-[#00d2ff] uppercase tracking-wider font-bold">
                ★ FEATURED CASE STUDY
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#64748b] uppercase">
            ID: {project.id}
          </span>
        </div>

        {/* Project Title & Short Subtitle */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
            {project.title}
          </h3>
          <p className="text-sm text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
            {project.subtitle[language]}
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="mb-6">
          <div className="text-[10px] font-mono uppercase text-[#64748b] tracking-wider mb-2">
            {t.projects.stackLabel}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-mono bg-[#0f1b33] border border-[#172847] text-[#f1f5f9] rounded-sm hover:border-[#00d2ff]/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable Engineering Case Study Details */}
        {isExpanded && (
          <div className="space-y-6 pt-6 border-t border-[#172847] animate-in fade-in duration-300">
            {/* Problem Statement */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00d2ff] uppercase font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.projects.problemLabel}</span>
              </div>
              <p className="text-sm text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed p-3.5 rounded-sm bg-[#0f1b33]/60 border border-[#172847]">
                {project.problemStatement[language]}
              </p>
            </div>

            {/* Architecture Overview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>{t.projects.architectureLabel}</span>
              </div>
              <p className="text-sm text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed p-3.5 rounded-sm bg-[#0f1b33]/60 border border-[#172847]">
                {project.solutionArchitecture[language]}
              </p>
            </div>

            {/* Key Engineering Decisions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#f1f5f9] uppercase font-semibold">
                <Cpu className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>{t.projects.decisionsLabel}</span>
              </div>
              <div className="space-y-2">
                {project.keyEngineeringDecisions[language].map((decision, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-[#94a3b8] p-3 rounded-sm bg-[#0f1b33]/40 border border-[#172847] font-['Be_Vietnam_Pro',sans-serif]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2ff] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{decision}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIP Exclusive Architecture Blueprint */}
        <div className="mt-5 pt-4 border-t border-[#172847]/70">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (isVipUnlocked) {
                  setShowVipBlueprint((prev) => !prev)
                } else {
                  openVipModal()
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>
                {language === 'vi'
                  ? 'Bản Vẽ Kiến Trúc VIP (System Blueprint)'
                  : 'VIP System Architecture Blueprint'}
              </span>
              {isVipUnlocked ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-amber-400/20 text-amber-300">
                  {showVipBlueprint ? 'ĐÓNG' : 'MỞ KHÓA'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-xs bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  <Lock className="w-2.5 h-2.5" />
                  NÂNG CẤP
                </span>
              )}
            </button>
          </div>

          {isVipUnlocked && showVipBlueprint && (
            <div className="mt-3 p-3.5 rounded-sm bg-[#081020] border border-amber-500/30 text-xs font-mono space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>[VIP_SPEC_UNLOCKED] // {project.id.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#cbd5e1]">
                <div className="p-2 rounded-xs bg-[#0f1b33] border border-[#172847]">
                  <span className="text-amber-400 block mb-0.5 font-semibold">Tải trọng & Benchmark:</span>
                  <span>10,000 req/s, P99 Latency &lt; 45ms, Caching Redis L1/L2</span>
                </div>
                <div className="p-2 rounded-xs bg-[#0f1b33] border border-[#172847]">
                  <span className="text-amber-400 block mb-0.5 font-semibold">Khả năng mở rộng (HA):</span>
                  <span>Cluster đa vùng, Auto-scaling HPA, Rate limiting phân tầng</span>
                </div>
              </div>
              <p className="text-[11px] text-[#94a3b8] italic">
                * Tài liệu kiến trúc chuyên sâu chỉ hiển thị riêng cho Hội Viên VIP và Admin Kietfolio.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls & Repository Links */}
      <div className="mt-8 pt-6 border-t border-[#172847] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Toggle Details Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-[#94a3b8] hover:text-[#00d2ff] transition-colors focus-visible:outline-none cursor-pointer"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Hide Architecture' : 'Inspect Case Study'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#00d2ff]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Action Link Buttons */}
        <div className="flex items-center gap-2">
          <Button
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            <GithubIcon className="w-3.5 h-3.5 mr-1" />
            <span>GitHub</span>
          </Button>

          {project.liveUrl && (
            <Button
              href={project.liveUrl}
              target={project.liveUrl.startsWith('#') ? undefined : '_blank'}
              rel={project.liveUrl.startsWith('#') ? undefined : 'noopener noreferrer'}
              onClick={
                project.liveUrl === '#cinema'
                  ? (e: React.MouseEvent) => {
                      e.preventDefault()
                      window.location.hash = 'cinema'
                      window.dispatchEvent(
                        new CustomEvent('kietfolio:navigate-view', { detail: { view: 'cinema' } })
                      )
                    }
                  : undefined
              }
              variant="accent-outline"
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              <span>{t.projects.liveDemo}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
})
