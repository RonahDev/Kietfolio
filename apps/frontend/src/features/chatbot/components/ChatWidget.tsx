import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  Bot,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'
import { useChatbot } from '../hooks/useChatbot'
import { useLanguage } from '@/hooks'
import type { QuickReplyOption } from '../types/chat'

export const ChatWidget: React.FC = () => {
  const { language } = useLanguage()
  const isEn = language === 'en'

  const {
    isOpen,
    isMinimized,
    isTyping,
    hasUnread,
    soundEnabled,
    messages,
    toggleOpen,
    toggleMinimize,
    toggleSound,
    clearMessages,
    sendMessage,
  } = useChatbot()

  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on message updates or typing state
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen, isMinimized])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isTyping) return
    const text = input
    setInput('')
    sendMessage(text)
  }

  const handleQuickReply = (chip: QuickReplyOption) => {
    if (isTyping) return
    sendMessage(chip.query)
  }

  const handleCopy = (id: string, text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      })
    }
  }

  const handleActionClick = (url: string) => {
    if (url.startsWith('#')) {
      if (url === '#cinema') {
        window.location.hash = '#cinema'
      } else if (url === '#vip') {
        window.dispatchEvent(new CustomEvent('kietfolio:open-vip-modal'))
      } else {
        // If in cinema, switch back to portfolio first
        if (window.location.hash === '#cinema') {
          window.location.hash = url
        } else {
          const el = document.querySelector(url)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          } else {
            window.location.hash = url
          }
        }
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  /**
   * Render simple Markdown: bold, italic, links, lists
   */
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n')
    return lines.map((line, idx) => {
      // Check for bullet list item
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ')
      const content = isBullet ? line.trim().substring(2) : line

      // Replace bold **text**
      const parts = content.split(/(\*\*[^*]+\*\*)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          )
        }
        // Replace italic *text*
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <em key={pIdx} className="text-[#94a3b8] italic">
              {part.slice(1, -1)}
            </em>
          )
        }
        return part
      })

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 pl-1">
            <span className="text-[#00d2ff] select-none text-xs leading-5">•</span>
            <span className="flex-1 leading-relaxed">{parts}</span>
          </div>
        )
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />
      }

      return (
        <p key={idx} className="leading-relaxed my-0.5">
          {parts}
        </p>
      )
    })
  }

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* Floating Launcher Action Button (FAB)                             */}
      {/* ----------------------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Subtle breathing greeting pill on desktop when closed */}
        {!isOpen && (
          <button
            type="button"
            onClick={toggleOpen}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1224]/90 border border-[#00d2ff]/30 text-xs font-mono text-[#00d2ff] backdrop-blur-md shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:border-[#00d2ff] transition-all cursor-pointer hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
            <span>{isEn ? 'Ask AI Assistant' : 'Hỏi đáp AI Kiệt Bot'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={toggleOpen}
          className="relative p-3.5 rounded-full bg-gradient-to-tr from-[#080d1a] to-[#121c38] border border-[#00d2ff]/50 hover:border-[#00d2ff] text-white shadow-[0_0_25px_rgba(0,210,255,0.35)] hover:shadow-[0_0_35px_rgba(0,210,255,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group"
          aria-label={isEn ? 'Open AI Chatbot' : 'Mở hộp thoại AI'}
          title={isEn ? 'AI Assistant (Mai Anh Kiet)' : 'Trợ lý ảo AI Mai Anh Kiệt'}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[#00d2ff]" />
          ) : (
            <>
              <Bot className="w-5 h-5 text-[#00d2ff] group-hover:rotate-12 transition-transform" />
              {/* Unread indicator */}
              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d2ff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00d2ff] border-2 border-[#050a14]" />
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Floating Chatbox Window                                           */}
      {/* ----------------------------------------------------------------- */}
      {isOpen && (
        <div
          className={`fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] rounded-2xl bg-[#080d19]/98 backdrop-blur-2xl border border-[#1e293b] shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden transition-all duration-300 font-sans ${
            isMinimized ? 'h-16' : 'h-[540px] max-h-[82vh]'
          }`}
          role="dialog"
          aria-label="AI Chatbot Assistant"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0c1324] via-[#0f172a] to-[#0c1324] border-b border-[#1e293b] flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0066cc] p-[1.5px] flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.4)]">
                  <div className="w-full h-full bg-[#080d19] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#00d2ff]" />
                  </div>
                </div>
                {/* Active pulse */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080d19]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white font-mono tracking-wide">
                    {isEn ? 'Kiet Bot AI' : 'Kiệt Bot AI'}
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-xs bg-[#00d2ff]/15 text-[#00d2ff] text-[9px] font-mono font-bold tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#94a3b8] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isEn ? 'Online 24/7 • Instant answers' : 'Trực tuyến 24/7 • Phản hồi tức thì'}</span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1 text-[#94a3b8]">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="p-1.5 rounded-md hover:bg-[#1e293b] hover:text-white transition-colors cursor-pointer"
                title={soundEnabled ? (isEn ? 'Mute sound' : 'Tắt âm thanh') : (isEn ? 'Unmute sound' : 'Bật âm thanh')}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00d2ff]" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Clear History */}
              <button
                type="button"
                onClick={clearMessages}
                className="p-1.5 rounded-md hover:bg-[#1e293b] hover:text-white transition-colors cursor-pointer"
                title={isEn ? 'Clear conversation' : 'Xóa lịch sử đoạn chat'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Minimize / Maximize */}
              <button
                type="button"
                onClick={toggleMinimize}
                className="p-1.5 rounded-md hover:bg-[#1e293b] hover:text-white transition-colors cursor-pointer"
                title={isMinimized ? (isEn ? 'Expand' : 'Mở rộng') : (isEn ? 'Minimize' : 'Thu nhỏ')}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={toggleOpen}
                className="p-1.5 rounded-md hover:bg-[#a51d35]/30 hover:text-rose-400 transition-colors cursor-pointer"
                title={isEn ? 'Close' : 'Đóng'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body & Messages (Hidden when minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-[#1e293b] text-xs">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user'
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
                    >
                      <div
                        className={`relative max-w-[85%] rounded-2xl p-3 shadow-md ${
                          isUser
                            ? 'bg-gradient-to-r from-[#00d2ff]/20 to-[#0077b6]/25 border border-[#00d2ff]/40 text-white rounded-br-xs'
                            : 'bg-[#0f172a]/90 border border-[#1e293b] text-[#cbd5e1] rounded-bl-xs'
                        }`}
                      >
                        {/* Text Message Content */}
                        <div className="text-[12.5px] leading-relaxed select-text">
                          {renderFormattedText(msg.text)}
                        </div>

                        {/* Action Link Button if provided */}
                        {msg.actionLink && (
                          <div className="mt-2.5 pt-2 border-t border-[#1e293b]">
                            <button
                              type="button"
                              onClick={() => handleActionClick(msg.actionLink!.url)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40 text-[#00d2ff] font-mono text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <span>{msg.actionLink.label}</span>
                              {msg.actionLink.isExternal ? (
                                <ExternalLink className="w-3 h-3" />
                              ) : (
                                <ArrowRight className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Message Footer: Timestamp & Copy Button */}
                        <div
                          className={`mt-1.5 flex items-center gap-2 text-[9.5px] font-mono text-[#64748b] ${
                            isUser ? 'justify-end' : 'justify-between'
                          }`}
                        >
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="hover:text-white transition-colors cursor-pointer p-0.5"
                              title={isEn ? 'Copy message' : 'Sao chép nội dung'}
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick Replies Carousel attached to latest message */}
                      {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-2 scrollbar-none">
                          {msg.quickReplies.map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => handleQuickReply(chip)}
                              className="px-2.5 py-1 rounded-full bg-[#111c33] hover:bg-[#192b4f] border border-[#00d2ff]/30 hover:border-[#00d2ff] text-[#00d2ff] text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#0f172a]/90 border border-[#1e293b] w-20 rounded-bl-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-bounce" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="p-3 bg-[#0a0f1d] border-t border-[#1e293b]">
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Ask about Kiet, SPX, CinemaStream...'
                        : 'Hỏi về Kiệt, SPX Express, CinemaStream...'
                    }
                    disabled={isTyping}
                    className="flex-1 bg-[#111728] border border-[#1e293b] focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:ring-1 focus:ring-[#00d2ff] transition-all font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                      input.trim() && !isTyping
                        ? 'bg-gradient-to-r from-[#00d2ff] to-[#0077b6] text-black shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:scale-105 active:scale-95'
                        : 'bg-[#1e293b] text-[#64748b] cursor-not-allowed opacity-50'
                    }`}
                    title={isEn ? 'Send query' : 'Gửi câu hỏi'}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[9px] font-mono text-[#64748b] px-1 mt-1.5">
                  <span>
                    {isEn ? 'Powered by Kietfolio AI Engine' : 'Vận hành bởi AI Engine của Kiệt'}
                  </span>
                  <span>{input.length}/300</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
