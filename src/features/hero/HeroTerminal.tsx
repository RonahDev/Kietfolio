import React, { useState } from 'react'
import { Terminal, CornerDownLeft, Sparkles } from 'lucide-react'
import { profileData } from '../../data/profile'
import { useLanguage } from '../../hooks/useLanguage'

export const HeroTerminal: React.FC = () => {
  const { language } = useLanguage()
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<Array<{ command: string; output: string | React.ReactNode }>>([
    {
      command: 'kiet.init()',
      output: language === 'vi'
        ? 'Hệ thống Kietfolio v2.4 trực tuyến. Sẵn sàng nhận lệnh điều khiển.'
        : 'Kietfolio System v2.4 initialized. Ready for operations.',
    },
    {
      command: 'kiet.status',
      output: language === 'vi'
        ? '✦ Sinh viên Kỹ thuật Phần mềm ĐH FPT\n✦ Trưởng Ca Điều Phối SPX Express Hub Cần Thơ\n✦ Trạng thái: Sẵn sàng hợp tác / Thực tập'
        : '✦ Software Engineering Student @ FPT University\n✦ Shift Dispatch Lead @ SPX Express Can Tho Hub\n✦ Status: Open for Software Engineering Opportunities',
    },
  ])

  const suggestedCommands = ['kiet.skills', 'kiet.experience', 'kiet.contact', 'clear']

  const handleCommand = (cmd: string) => {
    const clean = cmd.trim().toLowerCase()
    if (!clean) return

    if (clean === 'clear' || clean === 'cls') {
      setHistory([])
      setInputVal('')
      return
    }

    let out: string | React.ReactNode = ''
    if (clean === 'kiet.skills' || clean === 'skills') {
      out = 'Tech: TypeScript, React, Node.js, Three.js, GSAP, Docker, PostgreSQL\nOps: Điều phối kho bãi, xử lý xung đột hàng hóa, tối ưu thông lượng.'
    } else if (clean === 'kiet.experience' || clean === 'exp' || clean === 'experience') {
      out = 'SPX Express (Shopee Logistics) Hub Lead: Giám sát phân loại bưu kiện cao điểm, quản lý đội ngũ 30+ nhân sự điều phối.'
    } else if (clean === 'kiet.contact' || clean === 'contact' || clean === 'email') {
      out = `Email: ${profileData.contactLinks.email}\nGitHub: ${profileData.contactLinks.github}\nLocation: ${profileData.location.city}, ${profileData.location.country}`
    } else if (clean === 'help') {
      out = 'Lệnh khả dụng: kiet.skills, kiet.experience, kiet.contact, kiet.status, clear'
    } else {
      out = `Lệnh không xác định: "${clean}". Hãy thử: ${suggestedCommands.join(', ')}`
    }

    setHistory((prev) => [...prev, { command: cmd, output: out }])
    setInputVal('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCommand(inputVal)
  }

  return (
    <div className="w-full h-full min-h-[380px] md:min-h-[480px] flex flex-col rounded-sm bg-[#070d18] border border-[#172847] shadow-[0_0_40px_rgba(0,210,255,0.1)] overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#091122] border-b border-[#172847]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] text-[#94a3b8] font-bold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>kiet@hub-core: ~ (zsh)</span>
          </span>
        </div>
        <span className="text-[10px] text-[#64748b] tracking-wider uppercase">
          LIVE_SHELL
        </span>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[360px] text-[#cbd5e1]">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-[#00d2ff]">
              <span className="text-[#38bdf8]">❯</span>
              <span className="font-semibold">{item.command}</span>
            </div>
            <div className="pl-4 whitespace-pre-line text-[#94a3b8] leading-relaxed border-l border-[#172847]">
              {item.output}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Quick Commands */}
      <div className="px-3 py-2 bg-[#080e1c] border-t border-[#172847]/70 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="text-[#64748b] shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#00d2ff]" />
          <span>Gợi ý:</span>
        </span>
        {suggestedCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleCommand(cmd)}
            className="px-2 py-0.5 rounded-xs bg-[#0f1b33] border border-[#172847] hover:border-[#00d2ff] hover:text-[#00d2ff] text-[#94a3b8] transition-colors cursor-pointer shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Input Line */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-[#050a14] border-t border-[#172847]">
        <span className="text-[#00d2ff] font-bold">❯</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Nhập lệnh (vd: kiet.skills, help)..."
          className="flex-1 bg-transparent text-[#f1f5f9] placeholder-[#475569] text-xs outline-none"
        />
        <button
          type="submit"
          aria-label="Submit command"
          className="p-1 rounded-xs text-[#94a3b8] hover:text-[#00d2ff] transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}
