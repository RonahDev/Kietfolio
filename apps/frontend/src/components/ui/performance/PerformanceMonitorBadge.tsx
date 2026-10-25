import React, { useState } from 'react'
import { usePerformance, useLanguage } from '@/hooks'
import { Activity, Cpu, Sparkles, ChevronUp, ChevronDown, Check } from 'lucide-react'
import type { QualityMode } from '@/context/performanceTypes'

export const PerformanceMonitorBadge: React.FC = () => {
  const { fps, tier, qualityMode, setQualityMode, device } = usePerformance()
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const getTierColor = () => {
    if (tier === 'high') return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
    if (tier === 'medium') return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40'
    return 'text-amber-400 border-amber-500/30 bg-amber-950/40'
  }

  const getTierBadgeText = () => {
    if (tier === 'high') return language === 'vi' ? 'SIÊU MƯỢT' : 'ULTRA'
    if (tier === 'medium') return language === 'vi' ? 'CÂN BẰNG' : 'BALANCED'
    return language === 'vi' ? 'TIẾT KIỆM' : 'BATTERY SAVER'
  }

  const qualityOptions: Array<{ mode: QualityMode; labelVi: string; labelEn: string; descVi: string; descEn: string }> = [
    {
      mode: 'auto',
      labelVi: 'Tự động (Thích ứng FPS)',
      labelEn: 'Auto (Adaptive FPS)',
      descVi: 'Tự tăng/giảm đồ họa theo độ mượt',
      descEn: 'Scales effects dynamically',
    },
    {
      mode: 'high',
      labelVi: 'Tối đa (Ultra Graphics)',
      labelEn: 'High (Ultra Graphics)',
      descVi: '3D sắc nét, đầy đủ hiệu ứng hạt',
      descEn: 'Full 3D visuals & high DPR',
    },
    {
      mode: 'medium',
      labelVi: 'Cân bằng (Balanced)',
      labelEn: 'Balanced',
      descVi: 'Tối ưu cho laptop & điện thoại',
      descEn: 'Optimized for mobile & laptops',
    },
    {
      mode: 'low',
      labelVi: 'Tiết kiệm pin (Eco Mode)',
      labelEn: 'Power Saver',
      descVi: 'Tối giản hiệu ứng, mát máy',
      descEn: 'Minimal GPU load, longer battery',
    },
  ]

  return (
    <div className="fixed bottom-4 left-4 z-40 font-mono text-xs select-none">
      {/* Pop-up Quality Selector Menu */}
      {isOpen && (
        <div className="mb-2 p-3.5 w-72 rounded-sm bg-[#0a1224]/95 border border-[#00d2ff]/40 shadow-[0_0_30px_rgba(0,210,255,0.2)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#172847]">
            <div className="flex items-center gap-1.5 text-[#00d2ff] font-bold text-[11px] tracking-wider uppercase">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{language === 'vi' ? 'ĐIỀU HÒA HIỆU NĂNG' : 'PERFORMANCE ENGINE'}</span>
            </div>
            <span className="text-[10px] text-[#64748b]">v2.5</span>
          </div>

          {/* Real-time Hardware Telemetry */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] text-[#94a3b8] bg-[#070d1a]/80 p-2 rounded-xs border border-[#172847]">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[#38bdf8]" />
              <span>{device.cores} Cores CPU</span>
            </div>
            <div className="text-right">
              <span>{device.isMobile ? 'Mobile' : 'Desktop'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#00d2ff]" />
              <span>DPR: {device.pixelRatio}x</span>
            </div>
            <div className="text-right font-bold text-[#00d2ff]">
              <span>{fps} FPS</span>
            </div>
          </div>

          {/* Quality Mode Radio Selection */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">
              {language === 'vi' ? 'Chế độ hiển thị:' : 'Quality Profile:'}
            </div>
            {qualityOptions.map((opt) => {
              const isSelected = qualityMode === opt.mode
              return (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => {
                    setQualityMode(opt.mode)
                  }}
                  className={`w-full text-left p-2 rounded-xs border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#00d2ff]/15 border-[#00d2ff]/60 text-[#f1f5f9]'
                      : 'bg-[#0f1b33]/40 border-transparent text-[#94a3b8] hover:bg-[#0f1b33] hover:text-[#f1f5f9]'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold flex items-center gap-1">
                      <span>{language === 'vi' ? opt.labelVi : opt.labelEn}</span>
                      {opt.mode === 'auto' && (
                        <span className="text-[9px] px-1 py-0.2 bg-[#00d2ff]/20 text-[#00d2ff] rounded-xs font-normal">
                          {getTierBadgeText()}
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-[#64748b]">
                      {language === 'vi' ? opt.descVi : opt.descEn}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#00d2ff]" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,210,255,0.25)] cursor-pointer ${getTierColor()}`}
        title={language === 'vi' ? 'Tốc độ khung hình & Tinh chỉnh cấu hình' : 'Live FPS & Performance tuning'}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              tier === 'high' ? 'bg-emerald-400' : tier === 'medium' ? 'bg-cyan-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              tier === 'high' ? 'bg-emerald-500' : tier === 'medium' ? 'bg-cyan-500' : 'bg-amber-500'
            }`}
          />
        </span>
        <span className="font-bold tracking-tight text-[11px]">{fps} FPS</span>
        <span className="text-[10px] opacity-75 hidden sm:inline">| {getTierBadgeText()}</span>
        {isOpen ? <ChevronDown className="w-3 h-3 opacity-60" /> : <ChevronUp className="w-3 h-3 opacity-60" />}
      </button>
    </div>
  )
}

