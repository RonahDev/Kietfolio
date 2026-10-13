import { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { LightningAtmosphere } from './components/ui/LightningAtmosphere'
import { PageIntroLoader } from './components/ui/PageIntroLoader'
import { isReducedMotion } from './animations/gsapUtils'
import { GlobalParticleField } from './three/GlobalParticleField'
import { HeroSection } from './features/hero/HeroSection'
import { AboutSection } from './features/about/AboutSection'
import { ProjectsSection } from './features/projects/ProjectsSection'
import { ExperienceSection } from './features/experience/ExperienceSection'
import { SkillsSection } from './features/skills/SkillsSection'
import { PrinciplesSection } from './features/principles/PrinciplesSection'
import { GuestbookSection } from './features/guestbook/GuestbookSection'
import { ContactSection } from './features/contact/ContactSection'
import { AuthModal } from './components/auth/AuthModal'
import { AdminDashboardModal } from './components/admin/AdminDashboardModal'

export function AppContent() {
  const [isIntroReady, setIsIntroReady] = useState(() => {
    if (typeof window === 'undefined') return true
    return isReducedMotion()
  })

  return (
    <div className="min-h-screen bg-[#050a14] text-[#f1f5f9] flex flex-col font-sans selection:bg-[#00d2ff] selection:text-[#050a14] relative">
      {/* Cinematic GSAP Page Entrance Boot Loader */}
      <PageIntroLoader onComplete={() => setIsIntroReady(true)} />

      {/* Ambient 3D Three.js Global Particle Field */}
      <GlobalParticleField />

      {/* Interactive Cyber Cursor Atmosphere & Scroll Bar */}
      <LightningAtmosphere />

      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00d2ff] focus:text-[#050a14] focus:font-mono focus:text-sm focus:font-bold focus:shadow-xl focus:rounded-sm focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header & Navigation with Google Auth Status */}
      <Navbar />

      {/* Main Experience Stream */}
      <main id="main-content" className="flex-1 relative z-10">
        <HeroSection isIntroReady={isIntroReady} />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsSection />
        <PrinciplesSection />
        <GuestbookSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Google Authentication Gateway Modal */}
      <AuthModal />

      {/* Exclusive Admin Command Center Modal for Mai Anh Kiệt */}
      <AdminDashboardModal />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}
