import { LanguageProvider } from './context/LanguageContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { LightningAtmosphere } from './components/ui/LightningAtmosphere'
import { HeroSection } from './features/hero/HeroSection'
import { AboutSection } from './features/about/AboutSection'
import { ExperienceSection } from './features/experience/ExperienceSection'
import { SkillsSection } from './features/skills/SkillsSection'
import { ProjectsSection } from './features/projects/ProjectsSection'
import { PrinciplesSection } from './features/principles/PrinciplesSection'
import { ContactSection } from './features/contact/ContactSection'

export function AppContent() {
  return (
    <div className="min-h-screen bg-[#050a14] text-[#f1f5f9] flex flex-col font-sans selection:bg-[#00d2ff] selection:text-[#050a14]">
      {/* Interactive Lightning Cursor Atmosphere & Scroll Bar */}
      <LightningAtmosphere />

      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00d2ff] focus:text-[#050a14] focus:font-mono focus:text-sm focus:font-bold focus:shadow-xl focus:rounded-sm focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header & Navigation */}
      <Navbar />

      {/* Main Experience Stream */}
      <main id="main-content" className="flex-1 relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <PrinciplesSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
