import { useState, useEffect, lazy, Suspense } from 'react'
import { LanguageProvider, AuthProvider, WhaleCinematicProvider, PerformanceProvider } from '@/context'
import { useWhaleCinematic, useLanguage, useAuth } from '@/hooks'
import { isReducedMotion } from '@/animations'
import { Navbar, Footer } from '@/components/layout'
import {
  LightningAtmosphere,
  PageIntroLoader,
  WhaleController,
  ScrollToTop,
  PerformanceMonitorBadge,
} from '@/components/ui'
import { AuthModal } from '@/components/auth'
import { OceanWhaleScene, GlobalParticleField } from '@/three'
import { HeroSection } from '@/features/hero'
import { AboutSection } from '@/features/about'
import { ProjectsSection } from '@/features/projects'
import { ExperienceSection } from '@/features/experience'
import { SkillsSection } from '@/features/skills'
import { PrinciplesSection } from '@/features/principles'
import { GuestbookSection } from '@/features/guestbook'
import { ContactSection } from '@/features/contact'
import { usePayment } from '@/features/payment/hooks/usePayment'

// Code splitting & dynamic lazy loading for heavy on-demand modal features
const AdminDashboardModal = lazy(() =>
  import('@/features/admin/components/AdminDashboardModal').then((m) => ({
    default: m.AdminDashboardModal,
  }))
)
const DonateModal = lazy(() =>
  import('@/features/payment/components/DonateModal').then((m) => ({
    default: m.DonateModal,
  }))
)
const PaymentResultModal = lazy(() =>
  import('@/features/payment/components/PaymentResultModal').then((m) => ({
    default: m.PaymentResultModal,
  }))
)

export function AppContent() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const { isCinematicActive, triggerWhaleCinematic, skipWhaleCinematic } = useWhaleCinematic()
  const [isIntroReady, setIsIntroReady] = useState(() => {
    if (typeof window === 'undefined') return true
    return isReducedMotion()
  })

  // VNPay QR Donation & Mentorship Checkout State
  const {
    isOpen: isDonateOpen,
    openModal: openDonateModal,
    closeModal: closeDonateModal,
    selectedTier,
    customAmount,
    setCustomAmount,
    handleSelectTier,
    orderType,
    setOrderType,
    donorName,
    setDonorName,
    donorMessage,
    setDonorMessage,
    isLoading: isPaymentLoading,
    errorMessage: paymentError,
    calculateAmount,
    handlePayWithVnpay,
  } = usePayment(user?.displayName || '')

  useEffect(() => {
    const handleOpenDonate = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: 'coffee' | 'mentorship' | 'custom' }>
      openDonateModal(customEvent.detail?.type || 'coffee')
    }
    window.addEventListener('kietfolio:open-donate-modal', handleOpenDonate)
    return () => window.removeEventListener('kietfolio:open-donate-modal', handleOpenDonate)
  }, [openDonateModal])

  // Dedicated global keydown capture to guarantee ESC skips whale cinematic instantly under any focus state
  useEffect(() => {
    if (!isCinematicActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' ||
        e.key === 'Esc' ||
        e.code === 'Escape' ||
        e.keyCode === 27
      ) {
        e.preventDefault()
        e.stopPropagation()
        skipWhaleCinematic()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isCinematicActive, skipWhaleCinematic])

  const handleIntroComplete = (skipped = false) => {
    setIsIntroReady(true)
    if (!skipped && !isReducedMotion()) {
      triggerWhaleCinematic()
    }
  }

  return (
    <div className="min-h-screen bg-[#050a14] text-[#f1f5f9] flex flex-col font-sans selection:bg-[#00d2ff] selection:text-[#050a14] relative">
      {/* Cinematic GSAP Page Entrance Boot Loader */}
      <PageIntroLoader onComplete={handleIntroComplete} />

      {/* 3D Undulating Ocean Waves & Flying Cyber Whale */}
      <OceanWhaleScene />

      {/* Ambient 3D Three.js Global Particle Field */}
      <GlobalParticleField />

      {/* Interactive Cyber Cursor Atmosphere & Scroll Bar */}
      <LightningAtmosphere />

      {/* Floating Whale Controller HUD */}
      <WhaleController />

      {/* Floating Smooth Scroll to Top Button */}
      <ScrollToTop />
      <PerformanceMonitorBadge />

      {/* Oceanic Whale Cinematic Status & Skip HUD */}
      {isCinematicActive && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0a1224]/90 border border-[#00d2ff]/40 text-xs font-mono text-[#f1f5f9] backdrop-blur-md shadow-[0_0_30px_rgba(0,210,255,0.35)] animate-fade-in pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#00d2ff] animate-ping" />
          <span className="text-[#00d2ff] uppercase tracking-widest font-bold flex items-center gap-1.5">
            <span>🐋</span>
            <span>{language === 'vi' ? 'VŨ ĐIỆU CÁ VOI ĐẠI DƯƠNG' : 'OCEAN WHALE CINEMATIC'}</span>
          </span>
          <span className="text-[#334155]">|</span>
          <button
            type="button"
            onClick={skipWhaleCinematic}
            className="text-[#94a3b8] hover:text-[#00d2ff] font-semibold underline underline-offset-4 cursor-pointer transition-colors"
            title={language === 'vi' ? 'Bỏ qua hiệu ứng (phím ESC)' : 'Skip animation (ESC key)'}
          >
            {language === 'vi' ? 'BỎ QUA [ESC]' : 'SKIP [ESC]'}
          </button>
        </div>
      )}

      {/* All Website Information & UI Stream (Smoothly hidden when whale animation is playing) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-700 ease-out ${
          isCinematicActive
            ? 'opacity-0 pointer-events-none select-none invisible translate-y-3'
            : 'opacity-100 pointer-events-auto visible translate-y-0'
        }`}
        aria-hidden={isCinematicActive}
      >
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
          <HeroSection isIntroReady={isIntroReady && !isCinematicActive} />
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
      </div>

      {/* Google Authentication Gateway Modal */}
      <AuthModal />

      {/* On-demand lazy-loaded modals wrapped with lightweight Suspense fallback */}
      <Suspense fallback={null}>
        {/* Exclusive Admin Command Center Modal for Mai Anh Kiệt */}
        <AdminDashboardModal />

        {/* VNPay QR Donation & Mentorship Checkout Modal */}
        <DonateModal
          isOpen={isDonateOpen}
          onClose={closeDonateModal}
          selectedTier={selectedTier}
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
          handleSelectTier={handleSelectTier}
          orderType={orderType}
          setOrderType={setOrderType}
          donorName={donorName}
          setDonorName={setDonorName}
          donorMessage={donorMessage}
          setDonorMessage={setDonorMessage}
          isLoading={isPaymentLoading}
          errorMessage={paymentError}
          calculateAmount={calculateAmount}
          onPayWithVnpay={handlePayWithVnpay}
        />

        {/* VNPay Payment Return & Receipt Modal */}
        <PaymentResultModal />
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WhaleCinematicProvider>
          <PerformanceProvider>
            <AppContent />
          </PerformanceProvider>
        </WhaleCinematicProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
