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

// Server Safety Guardrails
const SAFETY_PATTERNS = {
  toxic: ['dm', 'dcm', 'vcl', 'cl', 'lon', 'cac', 'buoi', 'ngu', 'cho', 'suc vat', 'cut', 'fuck', 'bitch', 'asshole', 'idiot', 'toxic'],
  scam: ['lua dao', 'scam', 'tai xiu', 'danh bac', 'co bac', 'lo de', 'tien ao', 'crypto pump', 'da cap', 'ponzi', 'vay tien', 'vay nong'],
  nsfw: ['sex', 'khieu dam', 'doi truy', 'phim sex', 'phim 18', 'phim heo', 'gai goi', 'porn', 'nude', 'hentai', 'jav'],
  injection: ['ignore all previous instructions', 'ignore previous', 'jailbreak', 'system prompt', 'drop table', 'truncate table', 'bypass security'],
}

function checkServerSafety(text: string): boolean {
  const lower = text.toLowerCase()
  for (const list of Object.values(SAFETY_PATTERNS)) {
    for (const item of list) {
      if (lower.includes(item)) return false
    }
  }
  return true
}

// Structured Knowledge Topics with Empirical Metrics & Consulting Logic
const SERVER_KNOWLEDGE_TOPICS = [
  {
    keywords: ['so lieu', 'bang chung', 'xac thuc', 'uy tin', 'metrics', 'proof', 'hieu nang', 'performance', 'latency', 'chiu tai', 'ccu', 'testcase', 'fps'],
    replyVi:
      '📊 **Báo cáo số liệu thực chứng & hiệu năng hệ thống:**\n- ⚡ **Chịu tải 2,000 CCU**: Đã vượt qua stress test 2,000 người dùng đồng thời không downtime.\n- ⏱️ **Độ trễ P95 < 45ms**: Tối ưu với đệm phân tầng in-memory & PostgreSQL pool.\n- 📦 **Kho SPX Express**: Điều phối đỉnh điểm **100,000+ bưu kiện/ngày**, giảm 37.7% thời gian quay đầu xe, cam kết **SLA 99.9%**.\n- 🧪 **Kiểm thử phần mềm**: **198/198 testcases tự động đạt 100%**.\n- 🎮 **Đồ họa 3D**: Khung hình ổn định **60 FPS** với cơ chế tự hạ tải thông minh.',
    replyEn:
      '📊 **Empirical Evidence & Benchmark Report:**\n- ⚡ **2,000 CCU Stress Tested**: Zero downtime under heavy load.\n- ⏱️ **P95 Latency < 45ms**: Powered by multi-tier caching and PostgreSQL pool.\n- 📦 **SPX Hub 63BDG02**: Coordinated **100,000+ parcels/day**, 37.7% faster turnaround, **99.9% SLA**.\n- 🧪 **Testing**: **198/198 automated testcases passing (100%)**.\n- 🎮 **3D Web**: Locked **60 FPS** with adaptive level-of-detail.',
    actionLink: { labelVi: 'Xem Kiến Trúc & Bằng Chứng', labelEn: 'View Architecture & Proof', url: '#projects' },
    quickRepliesVi: [
      { label: '🛠️ Tech Stack chi tiết', query: 'Tech stack và kiến trúc của Kietfolio là gì?' },
      { label: '📦 Kinh nghiệm SPX Express', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
    ],
    quickRepliesEn: [
      { label: '🛠️ Detailed Tech Stack', query: 'What is Kiet tech stack and software skills?' },
      { label: '📦 SPX Experience', query: 'Tell me about Kiet operations experience at SPX Express' },
    ],
  },
  {
    keywords: ['tu van phim', 'xem gi', 'phim hay', 'goi y phim', 'recommend', 'toi nay xem gi', 'phim rap', 'phim viet', 'phim hoat hinh'],
    replyVi:
      '🍿 **Tư vấn phim hay trên CinemaStreamHub:**\n- 💥 **Hành động & Kịch tính**: *Sát Thủ John Wick: Phần 4, Lật Mặt 7, Hai Phượng, Vây Hãm: Kẻ Trừng Phạt (2024)*.\n- ⛩️ **Anime & Chữa lành**: *Doraemon: Nobita và Bản Giao Hưởng Địa Cầu (2024), Conan Ngôi Sao 1 Triệu Đô, One Piece Film Red*.\n- 🇻🇳 **Điện ảnh chiếu rạp Việt Nam**: *Mai, Nhà Bà Nữ, Đất Rừng Phương Nam, Quỷ Cẩu, Cám*.\n👉 Tất cả đều có sẵn trailer 4K và phim rạp bản quyền!',
    replyEn:
      '🍿 **Movie Recommendations on CinemaStreamHub:**\n- 💥 **Action**: *John Wick: Chapter 4, Face Off 7, Furie, The Roundup (2024)*.\n- ⛩️ **Anime**: *Doraemon: Nobita\'s Earth Symphony (2024), Detective Conan, One Piece Film Red*.\n- 🇻🇳 **Vietnamese Box Office**: *Mai, The House of No Man, Song of the South, Crimson Snout*.\n👉 Stream trailers and theatrical releases now!',
    actionLink: { labelVi: 'Vào Xem Phim Ngay', labelEn: 'Browse CinemaStreamHub', url: '#cinema' },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP Cinema', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '⛩️ Phim Doraemon có gì?', query: 'Phim Doraemon có những phần nào?' },
    ],
    quickRepliesEn: [
      { label: '👑 VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
    ],
  },
  {
    keywords: ['vip', 'mua vip', 'quyen loi vip', 'gia vip', 'dac quyen', 'nang cap vip', '4k', 'dolby atmos'],
    replyVi:
      '👑 **Đặc quyền gói hội viên VIP CinemaStream:**\n- 🎬 Mở khóa 100% phim chiếu rạp độc quyền không giới hạn.\n- 🌟 Trải nghiệm hình ảnh 4K Ultra HD & âm thanh vòm Dolby Atmos.\n- ⚡ Server VIP Fast HLS băng thông cao, không gián đoạn.\n- 🚫 100% không quảng cáo chen ngang.\n- 🏆 Vinh danh huy hiệu VIP Gold độc quyền trên trang cá nhân & bình luận.',
    replyEn:
      '👑 **VIP Membership Privileges:**\n- 🎬 Unlimited access to complete theatrical movie catalog.\n- 🌟 4K Ultra HD resolution & immersive Dolby Atmos audio.\n- ⚡ Isolated VIP Fast HLS high-speed streaming server.\n- 🚫 Completely ad-free viewing experience.\n- 🏆 Golden VIP badge on profile and discussions.',
    actionLink: { labelVi: 'Mở Cửa Sổ Nâng Cấp VIP', labelEn: 'Open VIP Upgrade Modal', url: '#vip' },
  },
  {
    keywords: ['tuyen dung', 'phong van', 'hire', 'recruitment', 'danh gia', 'co phu hop', 'cv', 'resume', 'hop tac'],
    replyVi:
      '💼 **Đánh giá năng lực ứng viên (Mai Anh Kiệt):**\n- 🎯 **Vị trí phù hợp**: Fullstack Software Engineer, Frontend 3D Web Developer, Backend Distributed Systems Engineer.\n- 🧠 **Thế mạnh nổi trội**: Tự chủ thiết kế & phát triển end-to-end, kinh nghiệm thực chiến xử lý 100k+ đơn/ngày tại sàn kho SPX, 100% test automated coverage.\n- 📬 **Kênh kết nối**: Email **kietteve22102005@gmail.com** (Phản hồi trong 24h) hoặc gửi tin nhắn qua Form Liên Hệ.',
    replyEn:
      '💼 **Candidate Competency Assessment (Mai Anh Kiet):**\n- 🎯 **Role Alignment**: Fullstack Engineer, Frontend 3D Web Developer, Backend Systems Engineer.\n- 🧠 **Key Strengths**: End-to-end delivery, proven resilience running 100k+ parcel operations at SPX Express, 100% test automation.\n- 📬 **Contact**: Email **kietteve22102005@gmail.com** or send a message via the Contact Form.',
    actionLink: { labelVi: 'Đi đến Form Liên Hệ Tuyển Dụng', labelEn: 'Go to Contact Form', url: '#contact' },
  },
  {
    keywords: ['kiet', 'la ai', 'gioi thieu', 'who is', 'about', 'ronah', 'sinh nam', 'tuoi', 'tac gia'],
    replyVi:
      '👨‍💻 **Mai Anh Kiệt (Ronah Mai)** là Kỹ Sư Phần Mềm & Chuyên Viên Vận Hành Hệ Thống Logistics (Hub SPX 63BDG02). Kiệt chuyên sâu về web thời gian thực chịu tải 2,000 CCU, đồ họa 3D Three.js và tối ưu hóa chuỗi cung ứng thực chiến.',
    replyEn:
      '👨‍💻 **Mai Anh Kiet (Ronah Mai)** is a Software Engineer and Logistics Operations Specialist, focusing on 2,000 CCU high-concurrency systems, 3D Three.js graphics, and industrial logistics optimization.',
    actionLink: { labelVi: 'Xem mục Giới Thiệu', labelEn: 'View About Section', url: '#about' },
  },
  {
    keywords: ['spx', 'express', 'shopee', 'kho bai', 'hub', '63bdg02', 'thu dau mot', 'dieu phoi', 'dispatcher', 'mega sale'],
    replyVi:
      '📦 **Kinh nghiệm thực chiến SPX Express (Hub 63BDG02 - Thủ Dầu Một):**\nKiệt đảm nhiệm vị trí Lead Dispatcher, trực tiếp điều phối luồng hàng vượt mốc **100,000+ bưu kiện/ngày** trong các đợt Mega Sale 11.11, giảm thời gian quay đầu xe tải xuống dưới **28 phút (-37.7%)** và duy trì SLA đạt **99.9%**.',
    replyEn:
      '📦 **SPX Express Operations Experience (Hub 63BDG02):**\nKiet coordinated fleet logistics handling **100,000+ parcels/day** during peak Mega Sales while slashing bay turnaround to under 28 mins and maintaining a **99.9% SLA**.',
    actionLink: { labelVi: 'Xem chi tiết Kinh Nghiệm', labelEn: 'View Experience', url: '#experience' },
  },
  {
    keywords: ['cinema', 'phim', 'cinemastream', 'movie', 'trailer', 'doraemon', 'conan', 'shin', 'dragon ball', 'one piece', 'rap'],
    replyVi:
      '🎬 **CinemaStreamHub (Nền tảng truyền phát rạp 4K):**\nTrải nghiệm mở màn nhung 3D Three.js chân thực, hệ thống chịu tải 2,000 CCU, tuyển tập phim chiếu rạp Việt Nam (Mai, Lật Mặt 7, Nhà Bà Nữ, Quỷ Cẩu...) và các vũ trụ Anime rạp đình đám (Doraemon, Conan, Shin-chan, Dragon Ball, One Piece).',
    replyEn:
      '🎬 **CinemaStreamHub (4K Cinema Platform):**\nFeatures photorealistic 3D velvet curtain opening, 2,000 CCU load-tested resilience, and curated collections: Vietnamese Theaters, Doraemon, Conan, Dragon Ball, One Piece, and Action blockbusters.',
    actionLink: { labelVi: 'Trải nghiệm CinemaStreamHub', labelEn: 'Explore CinemaStreamHub', url: '#cinema' },
  },
  {
    keywords: ['lien he', 'contact', 'email', 'sdt', 'zalo', 'tuyen dung', 'hire', 'cv', 'resume', 'hop tac'],
    replyVi:
      '📬 **Thông tin liên hệ & Tuyển dụng Mai Anh Kiệt:**\n- 📧 Email: kietteve22102005@gmail.com\n- 🐙 GitHub: https://github.com/RonahDev\n- 💼 LinkedIn: https://linkedin.com/in/maianhkiet\nBạn có thể gửi tin nhắn trực tiếp qua Form Liên Hệ để nhận phản hồi trong vòng 24 giờ!',
    replyEn:
      '📬 **Contact & Recruitment Channels:**\n- 📧 Email: kietteve22102005@gmail.com\n- 🐙 GitHub: https://github.com/RonahDev\n- 💼 LinkedIn: https://linkedin.com/in/maianhkiet\nFeel free to send a direct message via the Contact section!',
    actionLink: { labelVi: 'Đi đến Form Liên Hệ', labelEn: 'Go to Contact Form', url: '#contact' },
  },
  {
    keywords: ['chao', 'xin chao', 'hello', 'hi', 'hey', 'alo', 'good morning', 'test'],
    replyVi:
      '👋 **Xin chào bạn!** Tôi là Trợ Lý AI của Mai Anh Kiệt, được trang bị dữ liệu thực chứng và tư duy logic. Tôi có thể hỗ trợ bạn tìm hiểu về số liệu hiệu năng (2,000 CCU, SLA 99.9%), kinh nghiệm tại kho SPX Express, tư vấn xem phim CinemaStreamHub, hoặc kết nối hợp tác tuyển dụng.',
    replyEn:
      '👋 **Hello!** I am Mai Anh Kiet\'s AI Assistant, backed by empirical data and logical reasoning. I can help with benchmark metrics (2,000 CCU, 99.9% SLA), SPX Express logistics experience, movie recommendations, or recruitment inquiries.',
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

      const isEn = language === 'en'

      // 1. Safety Guardrail Evaluation
      if (!checkServerSafety(message)) {
        res.status(200).json({
          success: true,
          reply: isEn
            ? '🛡️ **Safety Notice**: I uphold constructive, professional, and safe discussions. Please avoid toxic language, adult themes, or financial schemes. How can I assist you with technology or cinema?'
            : '🛡️ **Thông báo an toàn**: Tôi cam kết duy trì môi trường trao đổi văn minh, tích cực và an toàn. Vui lòng không sử dụng từ ngữ nhạy cảm, khiêu dâm hoặc lừa đảo. Tôi có thể giúp gì cho bạn về công nghệ hoặc phim ảnh?',
          source: 'guardrail',
        })
        return
      }

      const queryText = message.trim().toLowerCase()

      // 2. Try Gemini API if configured
      const geminiApiKey = config.ai.geminiApiKey
      if (geminiApiKey && geminiApiKey.length > 5) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`
          const systemInstruction = `You are the official AI Assistant for Mai Anh Kiet (Ronah Mai), a Software Engineer and Logistics Operations Specialist based in Vietnam (SPX Express Hub 63BDG02).
Key facts & Empirical metrics to cite:
- High Concurrency: 2,000 CCU load-tested with zero downtime, P95 latency < 45ms.
- SPX Logistics: Coordinated 100,000+ parcels/day during Mega Sales, truck turnaround reduced by 37.7% (from 45 to 28 mins), 99.9% SLA.
- Testing: 198 automated testcases passing 100%.
- Graphics: 60 FPS Three.js 3D with adaptive quality.
- Cinema: CinemaStreamHub 4K Ultra HD & Dolby Atmos streaming, VIP perks, Doraemon/Conan/Vietnamese Box Office catalog.
- Contact: kietteve22102005@gmail.com, GitHub https://github.com/RonahDev.
Guidelines:
- Provide clear logical reasoning and empirical data to build authority.
- Offer proactive movie recommendations when asked.
- Refuse toxic, scam, gambling, or NSFW queries politely and firmly.
- Language: ${isEn ? 'English' : 'Vietnamese'}. Formatting: Markdown.`

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
                maxOutputTokens: 600,
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

      // 3. Intelligent Server-Side Rule Matcher
      let bestMatch: (typeof SERVER_KNOWLEDGE_TOPICS)[0] | null = null
      let highestScore = 0

      for (const topic of SERVER_KNOWLEDGE_TOPICS) {
        let score = 0
        for (const kw of topic.keywords) {
          if (queryText.includes(kw)) {
            score += kw.length > 5 ? 4 : 2
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
          quickReplies: bestMatch.quickRepliesVi,
          source: 'knowledge-engine',
        })
        return
      }

      // 4. Fallback Response with Empirical Highlights
      const fallbackReply = isEn
        ? "🤖 **I'm here to help!** Ask me about our 2,000 CCU load-tested architecture, 99.9% SPX logistics SLA, 4K Cinema movie advisory, VIP perks, or how to contact Mai Anh Kiet."
        : '🤖 **Tôi luôn sẵn sàng tư vấn cho bạn!** Bạn có thể hỏi về các số liệu thực chứng (2,000 CCU, SLA 99.9% kho SPX), tư vấn xem phim 4K CinemaStreamHub, đặc quyền VIP, hoặc kênh liên hệ tuyển dụng Mai Anh Kiệt.'

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
