import React from 'react'
import { useLanguage } from '@/hooks'
import { useWhaleCinematic } from '../hooks/useWhaleCinematic'
import { Sparkles, Compass } from 'lucide-react'

export const WhaleController: React.FC = React.memo(() => {
  const { language } = useLanguage()
  const { isCinematicActive, hasPlayed, triggerWhaleCinematic } = useWhaleCinematic()

  if (isCinematicActive || hasPlayed) {
    return null
  }

  const handleSummon = () => {
    triggerWhaleCinematic()
  }

  return (
    <div className="fixed bottom-14 left-4 z-30 flex items-center gap-2 font-mono text-xs pointer-events-auto">
      <button
        type="button"
        onClick={handleSummon}
        className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg bg-[#0a1224]/85 border-[#172847] hover:border-[#00d2ff]/60 text-[#94a3b8] hover:text-[#f1f5f9] shadow-black/40 hover:shadow-[0_0_15px_rgba(0,210,255,0.18)]"
        title={language === 'vi' ? 'Triệu hồi cá voi bay vào giữa màn hình' : 'Summon whale to center of screen'}
        aria-label="Summon Cyber Whale"
      >
        <span className="text-base select-none animate-bounce">🐋</span>
        <div className="flex flex-col text-left">
          <span className="font-bold text-[11px] tracking-wider text-[#00d2ff] uppercase flex items-center gap-1">
            {language === 'vi' ? 'Cá Voi Vũ Trụ' : 'Cyber Whale'}
            <Sparkles className="w-2.5 h-2.5" />
          </span>
          <span className="text-[10px] text-[#64748b] group-hover:text-[#94a3b8] transition-colors">
            {language === 'vi' ? 'Bấm để triệu hồi bay vào giữa' : 'Click to fly into center'}
          </span>
        </div>
      </button>

      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#050a14]/70 border border-[#172847]/70 text-[10px] text-[#64748b] backdrop-blur-sm">
        <Compass className="w-3 h-3 text-[#00d2ff] animate-spin" style={{ animationDuration: '10s' }} />
        <span>3D CYBER OCEAN</span>
      </div>
    </div>
  )
})
