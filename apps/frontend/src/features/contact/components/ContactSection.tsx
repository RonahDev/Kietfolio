import React from 'react'
import { useLanguage, useScrollReveal } from '@/hooks'
import { profileData } from '@/data'
import { SectionHeader, GithubIcon, LinkedinIcon } from '@/components/ui'
import { ContactForm } from './ContactForm'
import { Mail, MapPin, Terminal, Shield } from 'lucide-react'

export const ContactSection: React.FC = () => {
  const { t } = useLanguage()
  const sectionRef = useScrollReveal()

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#050a14] relative"
      aria-label="Contact Section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t.contact.badge}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Communication Channels & Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-sm bg-[#0a1224] border border-[#172847] space-y-5 card-reveal">
              <div className="flex items-center gap-2 pb-3 border-b border-[#172847]">
                <Terminal className="w-4 h-4 text-[#00d2ff]" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#f1f5f9] font-bold">
                  {t.contact.directChannels}
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Email Channel */}
                <a
                  href={`mailto:${profileData.contactLinks.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-sm bg-[#0f1b33]/70 border border-[#172847] hover:border-[#00d2ff] text-[#94a3b8] hover:text-[#f1f5f9] transition-all hover:shadow-[0_0_15px_rgba(0,210,255,0.12)]"
                >
                  <Mail className="w-4 h-4 text-[#00d2ff] shrink-0" />
                  <div className="truncate">
                    <span className="text-[#64748b] block text-[10px]">DIRECT TRANSMISSION</span>
                    <span className="text-[#f1f5f9] truncate font-semibold">{profileData.contactLinks.email}</span>
                  </div>
                </a>

                {/* GitHub Channel */}
                <a
                  href={profileData.contactLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-sm bg-[#0f1b33]/70 border border-[#172847] hover:border-[#00d2ff] text-[#94a3b8] hover:text-[#f1f5f9] transition-all hover:shadow-[0_0_15px_rgba(0,210,255,0.12)]"
                >
                  <GithubIcon className="w-4 h-4 text-[#00d2ff] shrink-0" />
                  <div>
                    <span className="text-[#64748b] block text-[10px]">SOURCE REPOSITORIES</span>
                    <span className="text-[#f1f5f9] font-semibold">github.com/RonahDev</span>
                  </div>
                </a>

                {/* LinkedIn Channel */}
                <a
                  href={profileData.contactLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-sm bg-[#0f1b33]/70 border border-[#172847] hover:border-[#38bdf8] text-[#94a3b8] hover:text-[#f1f5f9] transition-all hover:shadow-[0_0_15px_rgba(56,189,248,0.12)]"
                >
                  <LinkedinIcon className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <div>
                    <span className="text-[#64748b] block text-[10px]">PROFESSIONAL NETWORK</span>
                    <span className="text-[#f1f5f9] font-semibold">linkedin.com/in/maianhkiet</span>
                  </div>
                </a>

                {/* Physical Location */}
                <div className="flex items-center gap-3 p-3.5 rounded-sm bg-[#0f1b33]/70 border border-[#172847] text-[#94a3b8]">
                  <MapPin className="w-4 h-4 text-[#00d2ff] shrink-0" />
                  <div>
                    <span className="text-[#64748b] block text-[10px]">BASE COORDINATES</span>
                    <span className="text-[#f1f5f9] font-semibold">{profileData.contactLinks.locationLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engineering Discipline Assurance Notice */}
            <div className="p-4 rounded-sm bg-[#0a1224]/60 border border-[#172847] flex items-start gap-3 card-reveal">
              <Shield className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-[#94a3b8] leading-relaxed">
                {t.contact.responseGuarantee}
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form with Validation */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-sm bg-[#0a1224] border border-[#172847] card-reveal">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
