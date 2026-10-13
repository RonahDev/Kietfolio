import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { profileData } from '../../data/profile'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import {
  Code2,
  Sparkles,
  Boxes,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Calendar,
  Building2,
  Compass,
} from 'lucide-react'

export const AboutSection: React.FC = () => {
  const { t, language } = useLanguage()
  const [showTelemetryDetails, setShowTelemetryDetails] = useState(false)

  return (
    <section
      id="about"
      className="py-24 sm:py-32 border-b border-[#172847] bg-[#050a14] relative"
      aria-label="About Mai Anh Kiệt"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.about.badge}
          title={t.about.title}
          subtitle={t.about.lead}
        />

        {/* 3 Pillars / Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Dimension 1: Engineering */}
          <Card tilt className="flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[#0f1b33] border border-[#172847] flex items-center justify-center text-[#00d2ff] group-hover:border-[#00d2ff] group-hover:shadow-[0_0_12px_rgba(0,210,255,0.25)] transition-all">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
                {t.about.dimensionEngineeringTitle}
              </h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
                {t.about.dimensionEngineeringDesc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#172847] flex items-center gap-2 font-mono text-xs text-[#64748b]">
              <span className="text-[#00d2ff]">SYS:</span>
              <span>Full-Stack Architecture & Types</span>
            </div>
          </Card>

          {/* Dimension 2: Creativity */}
          <Card tilt className="flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[#0f1b33] border border-[#172847] flex items-center justify-center text-[#38bdf8] group-hover:border-[#38bdf8] group-hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
                {t.about.dimensionCreativityTitle}
              </h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
                {t.about.dimensionCreativityDesc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#172847] flex items-center gap-2 font-mono text-xs text-[#64748b]">
              <span className="text-[#38bdf8]">SYS:</span>
              <span>Three.js WebGL & GSAP Orchestration</span>
            </div>
          </Card>

          {/* Dimension 3: Operations */}
          <Card tilt className="flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[#0f1b33] border border-[#172847] flex items-center justify-center text-[#00d2ff] group-hover:border-[#00d2ff] group-hover:shadow-[0_0_12px_rgba(0,210,255,0.25)] transition-all">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
                {t.about.dimensionOperationsTitle}
              </h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
                {t.about.dimensionOperationsDesc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#172847] flex items-center gap-2 font-mono text-xs text-[#64748b]">
              <span className="text-[#00d2ff]">SYS:</span>
              <span>SPX Express Hub & Analytical Logic</span>
            </div>
          </Card>
        </div>

        {/* Narrative Split: Academic & Operational Synergy */}
        <div className="p-8 sm:p-10 rounded-sm bg-[#0a1224] border border-[#172847] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="accent" hasDot>
                  Verified Trajectory
                </Badge>
                <span className="text-xs font-mono text-[#64748b]">
                  // FPT University × SPX Express Hub
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
                {language === 'en'
                  ? 'The Intersection of Code and Physical Logistics'
                  : 'Giao Điểm Giữa Mã Nguồn Và Vận Hành Thực Tế'}
              </h3>
              <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
                {language === 'en'
                  ? 'Unlike developers who operate strictly within theoretical sandboxes, two continuous years inside the high-stress environment of Thủ Dầu Một 01 Hub revealed how real operations behave. When thousands of packages move across sorting belts every hour, software isn’t a decorative interface—it is the operational nervous system. This direct exposure inspires an obsession with clean architecture, fault tolerance, and zero-confusion UX.'
                  : 'Khác với cách tiếp cận lý thuyết thuần túy, 2 năm làm việc liên tục trong môi trường kho vận áp lực cao tại Thủ Dầu Một 01 Hub cho tôi thấy cách vận hành đời thực diễn ra. Khi hàng nghìn bưu kiện luân chuyển mỗi giờ, phần mềm không đơn thuần là giao diện trang trí mà là hệ thần kinh vận hành. Trải nghiệm này tạo nên sự chú trọng đặc biệt vào kiến trúc sạch, khả năng chịu lỗi và trải nghiệm người dùng không gây nhầm lẫn.'}
              </p>

              {/* Verified Professional Interests Tags */}
              <div className="pt-4 flex flex-wrap gap-2">
                {profileData.interests[language].map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono bg-[#0f1b33] border border-[#172847] text-[#f1f5f9] rounded-sm hover:border-[#00d2ff]/40 transition-colors"
                  >
                    <Compass className="w-3 h-3 text-[#00d2ff]" />
                    <span>{interest}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Optional Verified Profile Telemetry Toggle */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#172847] pt-6 lg:pt-0 lg:pl-8 space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-[#64748b] tracking-wider">
                  Verification State
                </div>
                <div className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
                  <span>Truthful & Verified Records</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTelemetryDetails(!showTelemetryDetails)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono border border-[#172847] hover:border-[#00d2ff] bg-[#0f1b33] text-[#94a3b8] hover:text-[#00d2ff] rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer"
                aria-expanded={showTelemetryDetails}
              >
                <span>
                  {showTelemetryDetails
                    ? t.about.hideProfileDetails
                    : t.about.toggleProfileDetails}
                </span>
                {showTelemetryDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showTelemetryDetails && (
                <div className="space-y-3 pt-2 text-xs font-mono border-t border-[#172847]/80 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#00d2ff] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[#64748b] block">
                        {t.about.personalInfoDobLabel}:
                      </span>
                      <span className="text-[#f1f5f9]">
                        {profileData.dateOfBirth} (2005)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#38bdf8] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[#64748b] block">
                        {t.about.personalInfoEduLabel}:
                      </span>
                      <span className="text-[#f1f5f9]">
                        {profileData.education.institution} (HCMC) ·{' '}
                        {profileData.education.major[language]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#00d2ff] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[#646c7f] block">
                        {t.about.personalInfoHubLabel}:
                      </span>
                      <span className="text-[#f1f5f9]">
                        SPX Express · Thủ Dầu Một 01 Hub
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
