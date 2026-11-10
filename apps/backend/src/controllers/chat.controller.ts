import { Request, Response, NextFunction } from 'express'
import { config } from '../config/env'

interface ChatRequestBody {
  message?: string
  language?: 'vi' | 'en'
}

interface QuickReplyOption {
  label: string
  query: string
  actionUrl?: string
}

interface ChatActionLink {
  label: string
  url: string
  isExternal?: boolean
}

// Structured Knowledge Rules for Server-side fallback or standalone mode
const SERVER_KNOWLEDGE_TOPICS = [
  {
    keywords: ['kiet', 'la ai', 'gioi thieu', 'who is', 'about', 'ronah', 'sinh nam', 'tuoi', 'tac gia'],
    replyVi:
      '👨‍💻 **Mai Anh Kiệt (Ronah Mai)** là Kỹ Sư Phần Mềm & Chuyên Viên Vận Hành Hệ Thống Hậu Cần (Logistics Operations Specialist). Kiệt chuyên sâu về kiến trúc web chịu tải cao, đồ họa 3D Three.js và tối ưu hóa quy trình chuỗi cung ứng thực chiến (SPX Express Hub 63BDG02).',
    replyEn:
      '👨‍💻 **Mai Anh Kiet (Ronah Mai)** is a Software Engineer and Logistics Operations Systems Specialist, focusing on high-concurrency web architecture, 3D Three.js interactive graphics, and industrial logistics optimization.',
    actionLink: { labelVi: 'Xem mục Giới Thiệu', labelEn: 'View About Section', url: '#about' },
    quickRepliesVi: [
      { label: '📦 Kinh nghiệm SPX', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
      { label: '🚀 Các dự án nổi bật', query: 'Các dự án nổi bật của Kiệt?' },
    ],
    quickRepliesEn: [
      { label: '📦 SPX Experience', query: 'SPX Express operations experience' },
      { label: '🚀 Key Projects', query: 'What are Kiet key projects?' },
    ],
  },
  {
    keywords: ['spx', 'express', 'shopee', 'kho bai', 'hub', '63bdg02', 'thu dau mot', 'dieu phoi', 'dispatcher', 'mega sale'],
    replyVi:
      '📦 **Kinh nghiệm thực chiến SPX Express (Hub 63BDG02 - Thủ Dầu Một):**\nKiệt đảm nhiệm vị trí Lead Dispatcher, trực tiếp điều phối luồng hàng vượt mốc **100,000+ bưu kiện/ngày** trong các đợt Mega Sale 11.11, giảm thời gian quay đầu xe tải xuống dưới 28 phút và duy trì SLA đạt **99.9%**.',
    replyEn:
      '📦 **SPX Express Operations Experience (Hub 63BDG02):**\nKiet served as a Ground Dispatcher & Fleet Coordinator, managing parcel dispatching surpassing **100,000+ packages/day** during peak Mega Sale 11.11 while maintaining a **99.9% SLA**.',
    actionLink: { labelVi: 'Xem chi tiết Kinh Nghiệm', labelEn: 'View Experience', url: '#experience' },
    quickRepliesVi: [
      { label: '🛠️ Kỹ năng công nghệ', query: 'Tech stack của Kiệt là gì?' },
      { label: '🎬 Phim tài liệu SPX', query: 'Giới thiệu về nền tảng phim CinemaStreamHub' },
    ],
    quickRepliesEn: [
      { label: '🛠️ Tech Stack', query: 'What is Kiet tech stack and software skills?' },
      { label: '🎬 CinemaStreamHub', query: 'What is CinemaStreamHub platform?' },
    ],
  },
  {
    keywords: ['cinema', 'phim', 'cinemastream', 'movie', 'trailer', 'doraemon', 'conan', 'shin', 'dragon ball', 'one piece', 'rap'],
    replyVi:
      '🎬 **CinemaStreamHub (Nền tảng truyền phát rạp 4K):**\nTrải nghiệm mở màn nhung 3D Three.js chân thực, hệ thống chịu tải 2,000 CCU, tuyển tập phim chiếu rạp Việt Nam (Mai, Lật Mặt 7, Nhà Bà Nữ, Quỷ Cẩu...) và các vũ trụ Anime rạp đình đám (Doraemon, Conan, Shin-chan, Dragon Ball, One Piece).',
    replyEn:
      '🎬 **CinemaStreamHub (4K Cinema Platform):**\nFeatures photorealistic 3D velvet curtain opening, 2,000 CCU load-tested resilience, and curated collections: Vietnamese Theaters, Doraemon, Conan, Dragon Ball, One Piece, and Action blockbusters.',
    actionLink: { labelVi: 'Trải nghiệm CinemaStreamHub', labelEn: 'Explore CinemaStreamHub', url: '#cinema' },
    quickRepliesVi: [
      { label: '⛩️ Phim Doraemon rạp', query: 'Phim Doraemon có những phần nào?' },
      { label: '🇻🇳 Phim chiếu rạp Việt', query: 'Phim chiếu rạp Việt Nam gồm những phim nào?' },
    ],
    quickRepliesEn: [
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
      { label: '🇻🇳 VN Theatrical Movies', query: 'What Vietnamese theatrical movies are included?' },
    ],
  },
  {
    keywords: ['lien he', 'contact', 'email', 'sdt', 'zalo', 'tuyen dung', 'hire', 'cv', 'resume', 'hop tac'],
    replyVi:
      '📬 **Thông tin liên hệ & Tuyển dụng Mai Anh Kiệt:**\n- 📧 Email: kietteve22102005@gmail.com\n- 🐙 GitHub: https://github.com/RonahDev\n- 💼 LinkedIn: https://linkedin.com/in/maianhkiet\nBạn có thể gửi tin nhắn trực tiếp qua Form Liên Hệ để nhận phản hồi sớm nhất!',
    replyEn:
      '📬 **Contact & Recruitment Channels:**\n- 📧 Email: kietteve22102005@gmail.com\n- 🐙 GitHub: https://github.com/RonahDev\n- 💼 LinkedIn: https://linkedin.com/in/maianhkiet\nFeel free to send a direct message via the Contact section!',
    actionLink: { labelVi: 'Đi đến Form Liên Hệ', labelEn: 'Go to Contact Form', url: '#contact' },
  },
  {
    keywords: ['chao', 'xin chao', 'hello', 'hi', 'hey', 'alo', 'good morning', 'test'],
    replyVi:
      '👋 **Xin chào bạn!** Tôi là Trợ Lý AI của Mai Anh Kiệt. Tôi có thể hỗ trợ bạn tìm hiểu về hồ sơ năng lực, kinh nghiệm tại SPX Express (Hub 63BDG02), nền tảng phim CinemaStreamHub, hoặc kết nối hợp tác tuyển dụng.',
    replyEn:
      '👋 **Hello!** I am Mai Anh Kiet\'s AI Assistant. I can help you explore Kiet\'s engineering background, SPX Express operations, CinemaStreamHub, or help you connect for recruitment.',
  },
]

export class ChatController {
  public static async query(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, language = 'vi' } = req.body as ChatRequestBody

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ success: false, error: 'Message text is required' })
        return
      }

      const queryText = message.trim().toLowerCase()
      const isEn = language === 'en'

      // 1. Try Gemini API if configured
      const geminiApiKey = config.ai.geminiApiKey
      if (geminiApiKey && geminiApiKey.length > 5) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`
          const systemInstruction = `You are the official AI Assistant for Mai Anh Kiet (Ronah Mai), a Software Engineer and Logistics Operations Specialist based in Vietnam (SPX Express Hub 63BDG02). Answer questions accurately and courteously about Kiet's portfolio, SPX Express warehouse dispatching experience, CinemaStreamHub 4K movie platform, tech stack (React 19, TypeScript, Node.js, Three.js, PostgreSQL, Docker), and contact info (kietteve22102005@gmail.com). Keep responses concise, friendly, and formatted in clean Markdown. Language: ${isEn ? 'English' : 'Vietnamese'}.`

          const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }],
                },
              ],
              generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.6,
              },
            }),
          })

          if (geminiRes.ok) {
            const data = await geminiRes.json()
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (text && text.trim().length > 0) {
              res.status(200).json({
                success: true,
                reply: text,
                source: 'gemini-ai',
              })
              return
            }
          }
        } catch {
          // Fall through to server knowledge engine
        }
      }

      // 2. Intelligent Server-Side Rule Matcher
      let bestMatch: (typeof SERVER_KNOWLEDGE_TOPICS)[0] | null = null
      let highestScore = 0

      for (const topic of SERVER_KNOWLEDGE_TOPICS) {
        let score = 0
        for (const kw of topic.keywords) {
          if (queryText.includes(kw)) {
            score += kw.length > 4 ? 3 : 1
          }
        }
        if (score > highestScore) {
          highestScore = score
          bestMatch = topic
        }
      }

      if (bestMatch && highestScore > 0) {
        res.status(200).json({
          success: true,
          reply: isEn ? bestMatch.replyEn : bestMatch.replyVi,
          actionLink: bestMatch.actionLink
            ? {
                label: isEn ? bestMatch.actionLink.labelEn : bestMatch.actionLink.labelVi,
                url: bestMatch.actionLink.url,
              }
            : undefined,
          quickReplies: isEn ? bestMatch.quickRepliesEn : bestMatch.quickRepliesVi,
          source: 'knowledge-engine',
        })
        return
      }

      // 3. Fallback Response
      const fallbackReply = isEn
        ? "🤖 **I'm here to help!** You can ask about Mai Anh Kiet's background, SPX Express operations (Hub 63BDG02), CinemaStreamHub 4K movies, or how to contact Kiet for collaboration."
        : '🤖 **Tôi luôn sẵn sàng hỗ trợ bạn!** Bạn có thể hỏi về Mai Anh Kiệt, kinh nghiệm điều phối tại SPX Express (Hub 63BDG02), nền tảng phim CinemaStreamHub, hoặc thông tin liên hệ hợp tác.'

      res.status(200).json({
        success: true,
        reply: fallbackReply,
        source: 'fallback',
      })
    } catch (error) {
      next(error)
    }
  }
}
