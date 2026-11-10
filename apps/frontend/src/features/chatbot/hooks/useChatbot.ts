import { useState, useEffect, useCallback } from 'react'
import type { ChatMessage } from '../types/chat'
import {
  DEFAULT_INITIAL_MESSAGE_VI,
  DEFAULT_INITIAL_MESSAGE_EN,
  DEFAULT_QUICK_REPLIES_VI,
  DEFAULT_QUICK_REPLIES_EN,
} from '../data/knowledgeBase'
import { queryChatbotEngine, soundFx } from '../services/chatbotEngine'
import { useLanguage } from '@/hooks'
import { SITE_CONFIG } from '@/config'

const STORAGE_KEY_MESSAGES = 'kietfolio_chatbot_messages_v1'
const STORAGE_KEY_PREFS = 'kietfolio_chatbot_prefs_v1'

export function useChatbot() {
  const { language } = useLanguage()
  const isEn = language === 'en'

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFS)
      return stored ? JSON.parse(stored).soundEnabled !== false : true
    } catch {
      return true
    }
  })

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') {
      return [
        {
          id: 'welcome-0',
          sender: 'bot',
          text: isEn ? DEFAULT_INITIAL_MESSAGE_EN : DEFAULT_INITIAL_MESSAGE_VI,
          timestamp: Date.now(),
          quickReplies: isEn ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI,
        },
      ]
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Ignore parse error
    }
    return [
      {
        id: 'welcome-0',
        sender: 'bot',
        text: isEn ? DEFAULT_INITIAL_MESSAGE_EN : DEFAULT_INITIAL_MESSAGE_VI,
        timestamp: Date.now(),
        quickReplies: isEn ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI,
      },
    ]
  })

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages))
    } catch {
      // Storage write suppressed
    }
  }, [messages])

  // Persist sound prefs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify({ soundEnabled }))
    } catch {
      // Storage write suppressed
    }
  }, [soundEnabled])

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev
      if (next) {
        setHasUnread(false)
        setIsMinimized(false)
      }
      return next
    })
  }, [])

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev)
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  const clearMessages = useCallback(() => {
    const freshWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'bot',
      text: isEn ? DEFAULT_INITIAL_MESSAGE_EN : DEFAULT_INITIAL_MESSAGE_VI,
      timestamp: Date.now(),
      quickReplies: isEn ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI,
    }
    setMessages([freshWelcome])
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES)
    } catch {}
  }, [isEn])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'user',
        text: trimmed,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg])
      if (soundEnabled) {
        soundFx.playSendSound()
      }

      setIsTyping(true)

      // Slight human-like response delay (between 350ms - 600ms)
      const artificialDelay = Math.floor(Math.random() * 250) + 350
      await new Promise((r) => setTimeout(r, artificialDelay))

      try {
        const response = await queryChatbotEngine(trimmed, isEn ? 'en' : 'vi', SITE_CONFIG.apiBaseUrl)

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: 'bot',
          text: response.text,
          timestamp: Date.now(),
          quickReplies: response.quickReplies,
          actionLink: response.actionLink,
        }

        setMessages((prev) => [...prev, botMsg])
        if (soundEnabled) {
          soundFx.playReceiveSound()
        }

        if (!isOpen) {
          setHasUnread(true)
        }
      } catch (err) {
        console.error('[Chatbot Error]:', err)
      } finally {
        setIsTyping(false)
      }
    },
    [isTyping, isEn, soundEnabled, isOpen]
  )

  return {
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
    setIsOpen,
  }
}
