import { describe, it, expect } from 'vitest'
import { processLocalQuery, removeVietnameseAccents } from '../services/chatbotEngine'
import { DEFAULT_QUICK_REPLIES_VI, DEFAULT_QUICK_REPLIES_EN } from '../data/knowledgeBase'

describe('Pillar 2: AI Chatbot & Knowledge Engine — 10 Comprehensive Testcases', () => {
  // TC-BOT-01: Intent classification: Cinema & Trailer guidance
  it('TC-BOT-01: detects cinema queries and provides in-web trailer guidance', () => {
    const res = processLocalQuery('CinemaStreamHub xem phim gì và có trailer không?', 'vi')
    expect(res.text).toContain('CinemaStreamHub')
    expect(res.actionLink?.url).toBe('#cinema')
  })

  // TC-BOT-02: Intent classification: Portfolio tech stack & architecture
  it('TC-BOT-02: detects engineering stack queries and answers with accurate technologies', () => {
    const res = processLocalQuery('Tech stack của dự án này gồm những gì?', 'vi')
    expect(res.text).toContain('React')
    expect(res.text).toContain('TypeScript')
    expect(res.actionLink?.url).toBe('#skills')
  })

  // TC-BOT-03: Intent classification: SPX Express logistics experience
  it('TC-BOT-03: handles SPX Express logistics operational experience questions', () => {
    const res = processLocalQuery('Kinh nghiệm làm việc tại SPX Express như thế nào?', 'vi')
    expect(res.text).toContain('SPX Express')
    expect(res.text).toContain('63BDG02')
    expect(res.actionLink?.url).toBe('#experience')
  })

  // TC-BOT-04: Intent classification: Contact & Recruitment
  it('TC-BOT-04: provides direct contact info for hiring and collaboration inquiries', () => {
    const res = processLocalQuery('Tôi muốn liên hệ tuyển dụng hoặc hợp tác với Kiệt', 'vi')
    expect(res.text).toContain('kietteve22102005@gmail.com')
    expect(res.actionLink?.url).toBe('#contact')
  })

  // TC-BOT-05: Bilingual auto-detection: English query
  it('TC-BOT-05: provides English responses for English inquiries', () => {
    const res = processLocalQuery('Who is Mai Anh Kiet?', 'en')
    expect(res.text).toContain('Mai Anh Kiet')
    expect(res.actionLink?.url).toBe('#about')
  })

  // TC-BOT-06: Bilingual auto-detection: Vietnamese query
  it('TC-BOT-06: provides Vietnamese responses for Vietnamese inquiries', () => {
    const res = processLocalQuery('Mai Anh Kiệt là ai?', 'vi')
    expect(res.text).toContain('Mai Anh Kiệt')
    expect(res.actionLink?.url).toBe('#about')
  })

  // TC-BOT-07: Unrecognized query fallback with helpful topic hints
  it('TC-BOT-07: triggers graceful fallback with topic suggestions on unknown questions', () => {
    const res = processLocalQuery('xyzabc12345randomquery999', 'vi')
    expect(res.text).toContain('Tôi chưa hiểu rõ câu hỏi này')
    expect(res.quickReplies?.length).toBeGreaterThan(0)
  })

  // TC-BOT-08: Quick prompts validity and structure
  it('TC-BOT-08: provides valid, structured quick action prompt chips', () => {
    expect(DEFAULT_QUICK_REPLIES_VI.length).toBeGreaterThanOrEqual(4)
    expect(DEFAULT_QUICK_REPLIES_EN.length).toBeGreaterThanOrEqual(4)
    DEFAULT_QUICK_REPLIES_VI.forEach((prompt) => {
      expect(prompt.label).toBeDefined()
      expect(prompt.query).toBeDefined()
    })
  })

  // TC-BOT-09: Vietnamese accent normalization
  it('TC-BOT-09: normalizes Vietnamese accents and casing seamlessly', () => {
    expect(removeVietnameseAccents('Phim Chiếu Rạp 4K')).toBe('phim chieu rap 4k')
    expect(removeVietnameseAccents('THỬ THÁCH LOGISTICS')).toBe('thu thach logistics')
  })

  // TC-BOT-10: Response latency performance (< 50ms in local rule engine mode)
  it('TC-BOT-10: delivers sub-50ms instantaneous response in local rule engine mode', () => {
    const startTime = performance.now()
    processLocalQuery('Kỹ năng lập trình', 'vi')
    const elapsed = performance.now() - startTime
    expect(elapsed).toBeLessThan(50)
  })
})
