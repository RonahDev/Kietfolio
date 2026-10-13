import { useState, useCallback } from 'react'
import { profileData } from '../data/profile'
import { SITE_CONFIG } from '../config/site'

export interface TerminalEntry {
  command: string
  output: string
}

export const SUGGESTED_COMMANDS: readonly string[] = [
  'kiet.skills',
  'kiet.experience',
  'kiet.contact',
  'kiet.status',
  'clear',
] as const

export function useTerminal(language: 'en' | 'vi') {
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<TerminalEntry[]>(() => [
    {
      command: 'kiet.init()',
      output:
        language === 'vi'
          ? `Hệ thống Kietfolio v${SITE_CONFIG.version} trực tuyến. Sẵn sàng nhận lệnh điều khiển.`
          : `Kietfolio System v${SITE_CONFIG.version} initialized. Ready for operations.`,
    },
    {
      command: 'kiet.status',
      output:
        language === 'vi'
          ? '✦ Sinh viên Kỹ thuật Phần mềm ĐH FPT (TP.HCM)\n✦ Trưởng Ca Điều Phối SPX Express Hub Thủ Dầu Một\n✦ Trạng thái: Sẵn sàng hợp tác / Thực tập kỹ thuật'
          : '✦ Software Engineering Student @ FPT University (HCMC)\n✦ Shift Dispatch Lead @ SPX Express Thu Dau Mot Hub\n✦ Status: Open for Software Engineering Opportunities',
    },
  ])

  const executeCommand = useCallback(
    (rawCmd: string) => {
      const clean = rawCmd.trim().toLowerCase()
      if (!clean) return

      if (clean === 'clear' || clean === 'cls') {
        setHistory([])
        setInputVal('')
        return
      }

      let out = ''
      switch (clean) {
        case 'kiet.skills':
        case 'skills':
          out =
            language === 'vi'
              ? '✦ Tech: TypeScript, React 19, Node.js, Three.js, Docker, PostgreSQL\n✦ Ops: Phân loại bưu kiện, xử lý xung đột hàng, tối ưu thông lượng.'
              : '✦ Tech: TypeScript, React 19, Node.js, Three.js, Docker, PostgreSQL\n✦ Ops: Parcel sortation, dispute mitigation, throughput optimization.'
          break

        case 'kiet.experience':
        case 'exp':
        case 'experience':
          out =
            language === 'vi'
              ? 'SPX Express Hub Lead (2 năm): Điều phối xuất nhập kho áp lực cao, quản lý thông lượng và hơn 30 nhân sự.'
              : 'SPX Express Hub Lead (2 years): High-throughput sorting & dispatch supervision, coordinating 30+ team members.'
          break

        case 'kiet.contact':
        case 'contact':
        case 'email':
          out = `Email: ${profileData.contactLinks.email}\nGitHub: ${profileData.contactLinks.github}\nLinkedIn: ${profileData.contactLinks.linkedin}`
          break

        case 'kiet.status':
        case 'status':
          out =
            language === 'vi'
              ? 'Tình trạng: Sẵn sàng đón nhận cơ hội Software Engineer / Full-Stack Developer.'
              : 'Status: Actively available for Software Engineering / Full-Stack opportunities.'
          break

        case 'help':
          out =
            language === 'vi'
              ? `Các lệnh hỗ trợ: ${SUGGESTED_COMMANDS.join(', ')}`
              : `Supported commands: ${SUGGESTED_COMMANDS.join(', ')}`
          break

        default:
          out =
            language === 'vi'
              ? `Lệnh không xác định: "${clean}". Hãy gõ: ${SUGGESTED_COMMANDS.join(', ')}`
              : `Unknown command: "${clean}". Try: ${SUGGESTED_COMMANDS.join(', ')}`
          break
      }

      setHistory((prev) => [...prev, { command: rawCmd, output: out }])
      setInputVal('')
    },
    [language]
  )

  return {
    inputVal,
    setInputVal,
    history,
    suggestedCommands: SUGGESTED_COMMANDS,
    executeCommand,
  }
}
