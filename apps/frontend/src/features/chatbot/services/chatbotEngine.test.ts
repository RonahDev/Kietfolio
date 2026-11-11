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

  it('accurately resolves specific director queries with live catalog cards (Christopher Nolan)', () => {
    const res = processLocalQuery('Có phim nào của Christopher Nolan không?', 'vi')
    expect(res.text).toContain('Christopher Nolan')
    expect(res.text).toContain('Oppenheimer')
    expect(res.text).toContain('Interstellar')
    expect(res.actionLink?.url).toBe('#cinema')
  })

  it('accurately cites official Box Office Vietnam all-time movie revenues', () => {
    const res = processLocalQuery('Doanh thu các phim chiếu rạp Việt Nam là bao nhiêu?', 'vi')
    expect(res.text).toContain('Mai (2024')
    expect(res.text).toContain('551 tỷ VNĐ')
    expect(res.text).toContain('Lật Mặt 7')
    expect(res.text).toContain('482 tỷ VNĐ')
    expect(res.text).toContain('Nhà Bà Nữ')
    expect(res.text).toContain('475 tỷ VNĐ')
    expect(res.actionLink?.url).toBe('#cinema')
  })

  it('accurately lists the complete Doraemon The Movie franchise on the platform', () => {
    const res = processLocalQuery('Phim Doraemon có những phần nào?', 'vi')
    expect(res.text).toContain('Bản Giao Hưởng Địa Cầu')
    expect(res.text).toContain('Vùng Đất Lý Tưởng Trên Bầu Trời')
    expect(res.text).toContain('Stand by Me Doraemon')
    expect(res.actionLink?.url).toBe('#cinema')
  })

  it('accurately explains PostgreSQL 3-tier RBAC security and authentication', () => {
    const res = processLocalQuery('Kiến trúc bảo mật và phân quyền PostgreSQL như thế nào?', 'vi')
    expect(res.text).toContain('3 Cấp Độ')
    expect(res.text).toContain('Bcrypt')
    expect(res.text).toContain('HttpOnly')
    expect(res.text).toContain('CSRF')
  })

  it('accurately explains video player shortcuts and 4K Dolby Atmos audio guide', () => {
    const res = processLocalQuery('Hướng dẫn cách xem phim 4K không bị giật lag và bật Dolby Atmos?', 'vi')
    expect(res.text).toContain('Dolby Atmos')
    expect(res.text).toContain('Phím Cách')
    expect(res.text).toContain('Toàn Màn Hình')
    expect(res.actionLink?.url).toBe('#cinema')
  })

  it('provides a polite fallback with quick replies for unrecognized queries', () => {
    const res = processLocalQuery('xyz123abc456qwe', 'vi')
    expect(res.text).toContain('Tôi chưa hiểu rõ câu hỏi này')
    expect(res.quickReplies?.length).toBeGreaterThan(0)
  })
})
