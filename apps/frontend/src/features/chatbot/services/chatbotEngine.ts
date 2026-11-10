import type { QuickReplyOption, ChatActionLink } from '../types/chat'
import {
  KNOWLEDGE_TOPICS,
  DEFAULT_QUICK_REPLIES_VI,
  DEFAULT_QUICK_REPLIES_EN,
  FALLBACK_RESPONSE_VI,
  FALLBACK_RESPONSE_EN,
} from '../data/knowledgeBase'

/**
 * Remove Vietnamese diacritics / accents for robust fuzzy matching
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/**
 * Synthesize soft futuristic sound effects using Web Audio API (zero external assets)
 */
class SoundFxService {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  playSendSound() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(580, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {
      // Audio playback silently suppressed if blocked by browser policy
    }
  }

  playReceiveSound() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(840, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.12)

      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch {
      // Audio playback silently suppressed
    }
  }
}

export const soundFx = new SoundFxService()

export interface ProcessedBotResponse {
  text: string
  quickReplies?: QuickReplyOption[]
  actionLink?: ChatActionLink
}

/**
 * Intelligent Local Pattern Matcher & Intent Classifier
 */
export function processLocalQuery(query: string, language: 'vi' | 'en' = 'vi'): ProcessedBotResponse {
  const normalized = removeVietnameseAccents(query)
  const isEn = language === 'en'

  let bestMatch: (typeof KNOWLEDGE_TOPICS)[0] | null = null
  let highestScore = 0

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0
    for (const kw of topic.keywords) {
      const normKw = removeVietnameseAccents(kw)
      if (normalized.includes(normKw)) {
        score += normKw.length > 5 ? 3 : 1
      }
    }
    if (score > highestScore) {
      highestScore = score
      bestMatch = topic
    }
  }

  if (bestMatch && highestScore > 0) {
    const text = isEn ? bestMatch.responseEn : bestMatch.responseVi
    const quickReplies = isEn ? bestMatch.quickRepliesEn : bestMatch.quickRepliesVi
    const actionLink = bestMatch.actionLink
      ? {
          label: isEn ? bestMatch.actionLink.labelEn : bestMatch.actionLink.labelVi,
          url: bestMatch.actionLink.url,
          isExternal: bestMatch.actionLink.isExternal,
        }
      : undefined

    return { text, quickReplies, actionLink }
  }

  // Fallback if no matching topic is found
  return {
    text: isEn ? FALLBACK_RESPONSE_EN : FALLBACK_RESPONSE_VI,
    quickReplies: isEn ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI,
  }
}

/**
 * Hybrid Chatbot Engine:
 * Attempts backend API call for dynamic AI responses with instant client-side fallback
 */
export async function queryChatbotEngine(
  userQuery: string,
  language: 'vi' | 'en' = 'vi',
  apiBaseUrl: string = '/api'
): Promise<ProcessedBotResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3500)

  try {
    const res = await fetch(`${apiBaseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userQuery, language }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.reply === 'string' && data.reply.trim().length > 0) {
        return {
          text: data.reply,
          quickReplies: data.quickReplies || (language === 'en' ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI),
          actionLink: data.actionLink,
        }
      }
    }
  } catch {
    // Backend unavailable or timed out; fall back gracefully to local engine
  } finally {
    clearTimeout(timeoutId)
  }

  // Guaranteed instant offline response
  return processLocalQuery(userQuery, language)
}
