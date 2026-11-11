import type { QuickReplyOption, ChatActionLink } from '../types/chat'
import {
  KNOWLEDGE_TOPICS,
  DEFAULT_QUICK_REPLIES_VI,
  DEFAULT_QUICK_REPLIES_EN,
  FALLBACK_RESPONSE_VI,
  FALLBACK_RESPONSE_EN,
  SAFETY_FILTER,
  SAFETY_RESPONSE_VI,
  SAFETY_RESPONSE_EN,
} from '../data/knowledgeBase'
import { resolveCinemaQuery } from './cinemaKnowledgeResolver'
export { resolveCinemaQuery } from './cinemaKnowledgeResolver'

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
 * Multi-layer Safety Guardrail Validator
 * Detects and defuses toxicity, scams, NSFW, and prompt injection attacks
 */
export function checkSafetyGuardrails(query: string): { isSafe: boolean; category?: string } {
  const normalized = removeVietnameseAccents(query)

  // 1. Check prompt injection
  for (const pattern of SAFETY_FILTER.injectionKeywords) {
    if (normalized.includes(removeVietnameseAccents(pattern))) {
      return { isSafe: false, category: 'injection' }
    }
  }

  // 2. Check toxic & abusive language
  for (const toxic of SAFETY_FILTER.toxicKeywords) {
    const norm = removeVietnameseAccents(toxic)
    const regex = new RegExp(`(^|\\s)${norm}(\\s|$)`, 'i')
    if (regex.test(normalized)) {
      return { isSafe: false, category: 'toxic' }
    }
  }

  // 3. Check scams, fraud, gambling
  for (const scam of SAFETY_FILTER.scamKeywords) {
    if (normalized.includes(removeVietnameseAccents(scam))) {
      return { isSafe: false, category: 'scam' }
    }
  }

  // 4. Check adult / NSFW
  for (const nsfw of SAFETY_FILTER.nsfwKeywords) {
    const norm = removeVietnameseAccents(nsfw)
    const regex = new RegExp(`(^|\\s)${norm}(\\s|$)`, 'i')
    if (regex.test(normalized)) {
      return { isSafe: false, category: 'nsfw' }
    }
  }

  return { isSafe: true }
}

/**
 * Synthesize soft futuristic sound effects using Web Audio API (zero external assets)
 */
class SoundFxService {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
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
      // Suppressed
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
      // Suppressed
    }
  }
}

export const soundFx = new SoundFxService()

export interface ProcessedBotResponse {
  text: string
  quickReplies?: QuickReplyOption[]
  actionLink?: ChatActionLink
  isGuardrailed?: boolean
}

/**
 * Intelligent Local Pattern Matcher, Logical Reasoner & Intent Classifier
 */
export function processLocalQuery(query: string, language: 'vi' | 'en' = 'vi'): ProcessedBotResponse {
  const isEn = language === 'en'

  // Step 1: Safety & Guardrail Filter
  const safetyCheck = checkSafetyGuardrails(query)
  if (!safetyCheck.isSafe) {
    return {
      text: isEn ? SAFETY_RESPONSE_EN : SAFETY_RESPONSE_VI,
      quickReplies: isEn ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI,
      isGuardrailed: true,
    }
  }

  const normalized = removeVietnameseAccents(query)

  // Step 2: Specific Director or Title Entity Search (Live Catalog Resolver)
  const isDirectMovieSearch =
    normalized.includes('nolan') ||
    normalized.includes('villeneuve') ||
    normalized.includes('ghibli') ||
    normalized.includes('makoto shinkai') ||
    normalized.includes('exhuma') ||
    normalized.includes('quat mo trung ma')

  if (isDirectMovieSearch) {
    const catalogResult = resolveCinemaQuery(query)
    if (catalogResult) {
      return {
        text: isEn ? catalogResult.formattedResponseEn : catalogResult.formattedResponseVi,
        quickReplies: isEn ? catalogResult.quickRepliesEn : catalogResult.quickRepliesVi,
        actionLink: {
          label: isEn ? catalogResult.actionLink.labelEn : catalogResult.actionLink.labelVi,
          url: catalogResult.actionLink.url,
          isExternal: catalogResult.actionLink.isExternal,
        },
      }
    }
  }

  // Step 3: Logical Intent Scoring & Semantic Ranking
  let bestMatch: (typeof KNOWLEDGE_TOPICS)[0] | null = null
  let highestScore = 0

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0
    let matchedKeywordsCount = 0

    for (const kw of topic.keywords) {
      const normKw = removeVietnameseAccents(kw)
      if (normalized.includes(normKw)) {
        matchedKeywordsCount++
        // Longer matching phrases provide significantly higher confidence
        score += normKw.length > 8 ? 6 : normKw.length > 4 ? 3 : 1
      }
    }

    // Co-occurrence bonus (multiple matching keywords in the same query)
    if (matchedKeywordsCount > 1) {
      score += matchedKeywordsCount * 3
    }

    // Exact phrase match bonus
    if (topic.keywords.some((kw) => normalized === removeVietnameseAccents(kw))) {
      score += 10
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

  // Step 4: Smart Cinema Catalog Fallback Search
  const fallbackCinemaResult = resolveCinemaQuery(query)
  if (fallbackCinemaResult) {
    return {
      text: isEn ? fallbackCinemaResult.formattedResponseEn : fallbackCinemaResult.formattedResponseVi,
      quickReplies: isEn ? fallbackCinemaResult.quickRepliesEn : fallbackCinemaResult.quickRepliesVi,
      actionLink: {
        label: isEn ? fallbackCinemaResult.actionLink.labelEn : fallbackCinemaResult.actionLink.labelVi,
        url: fallbackCinemaResult.actionLink.url,
        isExternal: fallbackCinemaResult.actionLink.isExternal,
      },
    }
  }

  // Step 5: Graceful Fallback with Guidance
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
  // Always perform immediate local safety check to save network and prevent malicious payloads
  const safetyCheck = checkSafetyGuardrails(userQuery)
  if (!safetyCheck.isSafe) {
    return {
      text: language === 'en' ? SAFETY_RESPONSE_EN : SAFETY_RESPONSE_VI,
      quickReplies: language === 'en' ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI,
      isGuardrailed: true,
    }
  }

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
          quickReplies:
            data.quickReplies || (language === 'en' ? DEFAULT_QUICK_REPLIES_EN : DEFAULT_QUICK_REPLIES_VI),
          actionLink: data.actionLink,
        }
      }
    }
  } catch {
    // Backend unavailable or timed out; fall back gracefully to local engine
  } finally {
    clearTimeout(timeoutId)
  }

  // Guaranteed instant offline response with full logical intelligence
  return processLocalQuery(userQuery, language)
}
