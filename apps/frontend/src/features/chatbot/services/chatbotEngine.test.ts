import { describe, it, expect } from 'vitest'
import {
  removeVietnameseAccents,
  processLocalQuery,
} from './chatbotEngine'

describe('Chatbot NLU & Local Knowledge Engine Suite', () => {
  it('correctly normalizes Vietnamese diacritics and casing', () => {
    expect(removeVietnameseAccents('Mai Anh Kiệt')).toBe('mai anh kiet')
    expect(removeVietnameseAccents('ĐIỀU PHỐI KHO BÃI')).toBe('dieu phoi kho bai')
    expect(removeVietnameseAccents('Thủ Dầu Một - 63BDG02')).toBe('thu dau mot - 63bdg02')
    expect(removeVietnameseAccents('')).toBe('')
  })

  it('accurately identifies intent and answers questions about Mai Anh Kiet', () => {
    const resVi = processLocalQuery('Mai Anh Kiệt là ai?', 'vi')
    expect(resVi.text).toContain('Mai Anh Kiệt (Ronah Mai)')
    expect(resVi.actionLink?.url).toBe('#about')

    const resEn = processLocalQuery('Who is Mai Anh Kiet?', 'en')
    expect(resEn.text).toContain('Mai Anh Kiet (Ronah Mai)')
    expect(resEn.actionLink?.url).toBe('#about')
  })

  it('accurately answers questions about SPX Express logistics experience', () => {
    const res = processLocalQuery('Kinh nghiệm làm việc tại SPX Express như thế nào?', 'vi')
    expect(res.text).toContain('SPX Express')
    expect(res.text).toContain('63BDG02')
    expect(res.text).toContain('100,000+')
    expect(res.actionLink?.url).toBe('#experience')
  })

  it('accurately answers questions about CinemaStreamHub platform', () => {
    const res = processLocalQuery('CinemaStreamHub xem phim gì và có tính năng gì?', 'vi')
    expect(res.text).toContain('CinemaStreamHub')
    expect(res.text).toContain('Three.js')
    expect(res.actionLink?.url).toBe('#cinema')
  })

  it('accurately answers questions regarding tech stack and engineering skills', () => {
    const res = processLocalQuery('Tech stack của Kiệt gồm những công nghệ gì?', 'vi')
    expect(res.text).toContain('React')
    expect(res.text).toContain('TypeScript')
    expect(res.text).toContain('Three.js')
    expect(res.actionLink?.url).toBe('#skills')
  })

  it('accurately provides contact and hiring channels', () => {
    const res = processLocalQuery('Làm sao để liên hệ tuyển dụng hoặc gửi email cho Kiệt?', 'vi')
    expect(res.text).toContain('kietteve22102005@gmail.com')
    expect(res.text).toContain('github.com/RonahDev')
    expect(res.actionLink?.url).toBe('#contact')
  })

  it('provides a polite fallback with quick replies for unrecognized queries', () => {
    const res = processLocalQuery('xyz123abc456qwe', 'vi')
    expect(res.text).toContain('Tôi chưa hiểu rõ câu hỏi này')
    expect(res.quickReplies?.length).toBeGreaterThan(0)
  })
})
