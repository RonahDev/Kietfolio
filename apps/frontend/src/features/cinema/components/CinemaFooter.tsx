import React from 'react'
import { Film, ShieldCheck, Sparkles } from 'lucide-react'

export const CinemaFooter: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#181b24] bg-[#050609] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#a51d35] to-[#5a0f1d] border border-[#d4af70]/40 flex items-center justify-center text-[#d4af70]">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-wider text-[#f5f5f5] font-mono">
                CINEMA<span className="text-[#a51d35]">STREAM</span>
              </span>
            </div>
            <p className="text-xs font-mono text-[#a1a1aa] max-w-md leading-relaxed">
              Trải nghiệm phát trực tuyến điện ảnh 4K HDR & âm thanh vòm Dolby Atmos với hiệu ứng mở màn rạp 3D WebGL thực tế.
            </p>
          </div>

          {/* Compliance & Audio/Video Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#11131a] border border-[#181b24] text-[#cbd5e1]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af70]" />
              <span>4K ULTRA HD / HDR10</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#11131a] border border-[#181b24] text-[#cbd5e1]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DOLBY ATMOS AUDIO</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#181b24]/60 text-xs font-mono text-[#a1a1aa]">
          <div className="space-y-2">
            <span className="text-white font-bold block uppercase tracking-wider text-[11px]">
              Khám Phá
            </span>
            <ul className="space-y-1.5">
              <li>• Phim bom tấn thịnh hành</li>
              <li>• Tuyển tập Cyberpunk & AI</li>
              <li>• Phim tài liệu Kỹ thuật & Logistics</li>
              <li>• Anime & Hoạt họa duy mỹ</li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-white font-bold block uppercase tracking-wider text-[11px]">
              Tài Khoản & Hội Viên
            </span>
            <ul className="space-y-1.5">
              <li>• Hội viên VIP 4K Streams</li>
              <li>• Danh sách xem riêng tư</li>
              <li>• Quản trị phân quyền Admin</li>
              <li>• Mã quà tặng & Voucher</li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-white font-bold block uppercase tracking-wider text-[11px]">
              Công Nghệ & Kỹ Thuật
            </span>
            <ul className="space-y-1.5">
              <li>• Three.js WebGL Velvet Simulation</li>
              <li>• GSAP Timeline Choreography</li>
              <li>• React 19 + TypeScript Monorepo</li>
              <li>• Edge Caching & Adaptive HLS</li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-white font-bold block uppercase tracking-wider text-[11px]">
              Tác Giả & Bản Quyền
            </span>
            <ul className="space-y-1.5">
              <li>• Mai Anh Kiệt (RonahDev)</li>
              <li>• ĐH FPT TP.HCM — Kỹ thuật Phần mềm</li>
              <li>• SPX Hub 63BDG02 Lead Dispatch</li>
              <li>• Giấy phép mã nguồn MIT 2026</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#181b24]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#a1a1aa]">
          <span>© 2026 CinemaStream. All streaming rights & demonstrations reserved.</span>
          <span>Designed & Engineered by Mai Anh Kiệt</span>
        </div>
      </div>
    </footer>
  )
}
