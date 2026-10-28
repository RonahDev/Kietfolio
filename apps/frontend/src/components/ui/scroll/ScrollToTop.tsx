import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '@/hooks'

export const ScrollToTop: React.FC = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    if (typeof window === 'undefined') return

    let animId = 0
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        animId = window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 400)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-[#0a1224]/90 border border-[#172847] hover:border-[#00d2ff] text-[#94a3b8] hover:text-[#00d2ff] backdrop-blur-md shadow-lg shadow-black/40 hover:shadow-[0_0_15px_rgba(0,210,255,0.25)] transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00d2ff]"
      aria-label={language === 'vi' ? 'Cuộn lên đầu trang' : 'Scroll to top'}
      title={language === 'vi' ? 'Lên đầu trang' : 'Back to top'}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  )
})
