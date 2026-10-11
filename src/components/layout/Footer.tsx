import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { profileData } from '../../data/profile'
import { ArrowUp, Mail, Cpu, Terminal } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../ui/SocialIcons'

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  const { t, language } = useLanguage()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-[#03070e] border-t border-[#172847] pt-16 pb-12 overflow-hidden text-[#94a3b8]">
      {/* Background technical grid accent */}
      <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#172847]">
          {/* Identity & Mission */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center justify-center text-[#00d2ff] shadow-[0_0_8px_rgba(0,210,255,0.2)]">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-base font-bold text-[#f1f5f9] tracking-tight">
                {profileData.fullName}
              </span>
            </div>

            <p className="text-sm text-[#94a3b8] max-w-md leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
              {profileData.tagline[language]}
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono bg-[#0a1224]/80 border border-[#172847] text-[#64748b] rounded-sm">
              <Cpu className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span>{t.footer.builtWith}</span>
            </div>
          </div>

          {/* Quick Jump Links */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="text-[#f1f5f9] font-semibold uppercase tracking-wider mb-2">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-[#00d2ff] transition-colors">
                  // {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#00d2ff] transition-colors">
                  // {t.nav.experience}
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-[#00d2ff] transition-colors">
                  // {t.nav.skills}
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#00d2ff] transition-colors">
                  // {t.nav.projects}
                </a>
              </li>
              <li>
                <a href="#principles" className="hover:text-[#00d2ff] transition-colors">
                  // {t.nav.principles}
                </a>
              </li>
            </ul>
          </div>

          {/* Verified Channels */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="text-[#f1f5f9] font-semibold uppercase tracking-wider mb-2">
              Channels
            </h4>
            <div className="flex flex-col space-y-2">
              <a
                href={profileData.contactLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#00d2ff] transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-[#00d2ff]" />
                <span>github.com/RonahDev</span>
              </a>
              <a
                href={profileData.contactLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#00d2ff] transition-colors"
              >
                <LinkedinIcon className="w-4 h-4 text-[#38bdf8]" />
                <span>linkedin.com/in/maianhkiet</span>
              </a>
              <a
                href={`mailto:${profileData.contactLinks.email}`}
                className="inline-flex items-center gap-2 hover:text-[#00d2ff] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#94a3b8]" />
                <span>{profileData.contactLinks.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <p className="text-[#64748b]">
            © {CURRENT_YEAR} {profileData.fullName}. {t.footer.rights}
          </p>

          <button
            onClick={scrollToTop}
            type="button"
            className="group inline-flex items-center gap-2 px-3 py-1.5 border border-[#172847] bg-[#0a1224] hover:border-[#00d2ff] hover:text-[#00d2ff] rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer"
            aria-label="Back to top of page"
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-[#00d2ff]" />
          </button>
        </div>
      </div>
    </footer>
  )
}
