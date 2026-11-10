import type { QuickReplyOption } from '../types/chat'

export interface KnowledgeTopic {
  id: string
  keywords: string[]
  responseVi: string
  responseEn: string
  quickRepliesVi?: QuickReplyOption[]
  quickRepliesEn?: QuickReplyOption[]
  actionLink?: {
    labelVi: string
    labelEn: string
    url: string
    isExternal?: boolean
  }
}

export const DEFAULT_INITIAL_MESSAGE_VI = `👋 **Xin chào! Tôi là Trợ Lý AI của Mai Anh Kiệt.**

Tôi có thể giúp bạn tìm hiểu thông tin về:
- 👨‍💻 **Mai Anh Kiệt**: Hồ sơ, kinh nghiệm điều phối tại SPX Express (Hub 63BDG02).
- 🚀 **Dự Án Kỹ Thuật**: Nền tảng CinemaStreamHub, đồ họa 3D Three.js, kiến trúc phân tán.
- 🎬 **CinemaStreamHub**: Kho phim rạp 4K, bản quyền chính hãng (Doraemon, Conan, Phim Việt...).
- 💼 **Cơ Hội Hợp Tác & Tuyển Dụng**: Kết nối làm việc, liên hệ trực tiếp.

*Bạn muốn tìm hiểu thông tin nào trước? Hãy chọn câu hỏi nhanh bên dưới hoặc gõ trực tiếp nhé!*`

export const DEFAULT_INITIAL_MESSAGE_EN = `👋 **Hello! I am Mai Anh Kiet's AI Assistant.**

I can instantly provide you with details on:
- 👨‍💻 **Mai Anh Kiet**: Profile, experience as a Dispatcher at SPX Express (Hub 63BDG02).
- 🚀 **Engineering Projects**: CinemaStreamHub, 3D Three.js visuals, high-concurrency architecture.
- 🎬 **CinemaStreamHub**: 4K theatrical trailers, official licensed collections (Doraemon, Conan, VN Theaters...).
- 💼 **Recruitment & Collaboration**: Contact channels, hiring opportunities, and consultation.

*What would you like to explore? Feel free to pick a prompt below or type your message!*`

export const DEFAULT_QUICK_REPLIES_VI: QuickReplyOption[] = [
  { label: '👨‍💻 Mai Anh Kiệt là ai?', query: 'Giới thiệu về Mai Anh Kiệt' },
  { label: '📦 Kinh nghiệm SPX Express', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
  { label: '🎬 Trải nghiệm CinemaStreamHub', query: 'Giới thiệu về nền tảng phim CinemaStreamHub' },
  { label: '🛠️ Kỹ năng công nghệ & Tech Stack', query: 'Tech stack và kỹ năng chuyên môn của Kiệt là gì?' },
  { label: '📬 Cách liên hệ / Tuyển dụng', query: 'Làm sao để liên hệ tuyển dụng hoặc hợp tác với Kiệt?' },
]

export const DEFAULT_QUICK_REPLIES_EN: QuickReplyOption[] = [
  { label: '👨‍💻 Who is Mai Anh Kiet?', query: 'Tell me about Mai Anh Kiet' },
  { label: '📦 SPX Express Experience', query: 'Tell me about Kiet operations experience at SPX Express' },
  { label: '🎬 Explore CinemaStreamHub', query: 'What is CinemaStreamHub platform?' },
  { label: '🛠️ Tech Stack & Skills', query: 'What is Kiet tech stack and software skills?' },
  { label: '📬 Contact / Hiring', query: 'How can I contact Kiet for recruitment or collaboration?' },
]

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  // 1. Giới thiệu tổng quan về Mai Anh Kiệt
  {
    id: 'about_kiet',
    keywords: [
      'la ai', 'gioi thieu', 'thong tin', 'profile', 'bio', 'who is', 'about kiet', 'ban la ai',
      'anh kiet', 'ronah', 'ronah mai', 'sinh nam', 'tuoi', 'que quan', 'hoc van', 'background'
    ],
    responseVi: `👨‍💻 **Mai Anh Kiệt (Ronah Mai)** là Kỹ Sư Phần Mềm (Software Engineer) kết hợp Chuyên Viên Vận Hành Hệ Thống Logistics (Logistics Operations Specialist).

- **Chuyên môn cốt lõi**: Thiết kế hệ thống web chịu tải cao, đồ họa không gian 3D tương tác (Three.js/WebGL), và tối ưu hóa chuỗi cung ứng thực chiến.
- **Tư duy kỹ thuật**: Kết hợp giữa **áp lực thực tế tại sàn vận hành kho bãi** với **kỹ thuật phần mềm hiện đại** (React, TypeScript, Node.js, PostgreSQL, Docker, Redis).
- **Trụ sở / Địa bàn hoạt động**: TP. Hồ Chí Minh & Bình Dương (Việt Nam).
- **Mục tiêu**: Xây dựng những sản phẩm số mượt mà, tối ưu hiệu năng cao và có khả năng phục vụ hàng ngàn người dùng đồng thời.`,
    responseEn: `👨‍💻 **Mai Anh Kiet (Ronah Mai)** is a Software Engineer and Logistics Operations Systems Specialist.

- **Core Competencies**: High-concurrency web architecture, interactive 3D graphics (Three.js/WebGL), and industrial operations optimization.
- **Engineering Mindset**: Bridging the gap between real-world frontline warehouse pressures and modern software engineering (React, TypeScript, Node.js, PostgreSQL, Docker, Redis).
- **Location**: Ho Chi Minh City & Binh Duong, Vietnam.
- **Objective**: Crafting resilient, ultra-responsive digital systems capable of handling thousands of concurrent users.`,
    actionLink: {
      labelVi: 'Xem chi tiết mục Giới Thiệu',
      labelEn: 'View About Section',
      url: '#about',
    },
    quickRepliesVi: [
      { label: '📦 Kinh nghiệm SPX Express', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
      { label: '🚀 Các dự án nổi bật', query: 'Các dự án nổi bật của Kiệt?' },
      { label: '📬 Liên hệ Kiệt', query: 'Làm sao để liên hệ Kiệt?' },
    ],
    quickRepliesEn: [
      { label: '📦 SPX Experience', query: 'SPX Express operations experience' },
      { label: '🚀 Key Projects', query: 'What are Kiet key projects?' },
      { label: '📬 Contact Info', query: 'How to contact Kiet?' },
    ],
  },

  // 2. Kinh nghiệm thực chiến tại SPX Express
  {
    id: 'experience_spx',
    keywords: [
      'spx', 'shopee', 'shopee express', 'spx express', 'hub', '63bdg02', 'thu dau mot', 'dieu phoi',
      'dispatcher', 'kho bai', 'hau can', 'logistics', 'mega sale', 'don hang', 'buu kien', 'operation'
    ],
    responseVi: `📦 **Kinh nghiệm thực chiến tại SPX Express (Trạm Hub 63BDG02 - Thủ Dầu Một):**

Mai Anh Kiệt từng đảm nhiệm vai trò **Lead Dispatcher / Điều Phối Viên Vận Hành Kho Bãi** với những dấu ấn cụ thể:
1. **Xử lý tải trọng cực lớn**: Điều phối luồng hàng vượt mốc **100,000+ bưu kiện/ngày** trong các đợt Siêu Sale cao điểm (Mega Sale 11.11, 12.12).
2. **Tối ưu hóa luồng giao vận**: Tái cấu trúc quy trình phân luồng bốc dỡ xe tải (Inbound/Outbound), giảm thời gian quay đầu xe từ 45 phút xuống dưới 28 phút.
3. **Ứng phó khủng hoảng**: Thiết kế giao thức giải cứu sự cố đứt gãy băng chuyền phân loại trong đêm Sale, đảm bảo cam kết chất lượng dịch vụ (SLA) đạt **99.9%**.
4. **Chuyển giao số hóa**: Áp dụng công cụ theo dõi dữ liệu luồng hàng giúp giảm 35% tỷ lệ chậm trễ đơn hàng.`,
    responseEn: `📦 **Frontline Operational Track Record at SPX Express (Hub 63BDG02 - Thu Dau Mot):**

Kiet served as a **Ground Operations Dispatcher & Fleet Coordinator** with notable milestones:
1. **High Volume Routing**: Orchestrated dispatching for **100,000+ parcels/day** during peak eCommerce campaigns (Mega Sale 11.11, 12.12).
2. **Turnaround Optimization**: Restructured truck bay loading/unloading logistics, cutting fleet turnaround from 45 mins to under 28 mins.
3. **Incident Remediation**: Authored emergency manual failover protocols when automated sorting lines experienced bottlenecks, maintaining **99.9% SLA**.
4. **Data-Driven Efficiency**: Built real-time monitoring workflows that reduced cross-dock delivery delays by 35%.`,
    actionLink: {
      labelVi: 'Xem dòng thời gian Kinh Nghiệm',
      labelEn: 'View Experience Timeline',
      url: '#experience',
    },
    quickRepliesVi: [
      { label: '🛠️ Tech Stack & Kỹ năng', query: 'Tech stack và kỹ năng chuyên môn của Kiệt là gì?' },
      { label: '🎬 Xem phim tài liệu SPX', query: 'Phim tài liệu kỹ thuật logistics trên CinemaStream' },
    ],
    quickRepliesEn: [
      { label: '🛠️ Tech Stack & Skills', query: 'What is Kiet tech stack and software skills?' },
      { label: '🎬 Logistics Doc on Cinema', query: 'Logistics documentary on CinemaStream' },
    ],
  },

  // 3. Dự án CinemaStreamHub
  {
    id: 'cinema_stream_hub',
    keywords: [
      'cinema', 'phim', 'cinemastream', 'movie', 'xem phim', 'trailer', 'man nhung', 'rap chieu phim',
      'doraemon', 'conan', 'shin', 'dragon ball', 'naruto', 'one piece', 'theatrical', 'curtain'
    ],
    responseVi: `🎬 **Nền Tảng CinemaStreamHub — Trải Nghiệm Điện Ảnh Rạp 4K:**

Đây là hệ thống truyền phát đa phương tiện cao cấp được Kiệt phát triển với các tính năng vượt trội:
- **Hiệu ứng Mở Màn Rạp 3D (3D Realistic Theater Curtain)**: Mô phỏng không gian mở rạp chân thực bằng Three.js shaders với cơ chế vật lý mượt mà.
- **Phim Rạp & Trailer 4K Bản Quyền**: Tích hợp các bộ sưu tập đặc sắc:
  1. *Phim Chiếu Rạp Việt Nam*: Mai, Lật Mặt 7, Nhà Bà Nữ, Đất Rừng Phương Nam, Quỷ Cẩu, Cám...
  2. *Vũ Trụ Anime Rạp*: Trọn bộ Doraemon The Movie, Conan 1 Triệu Đô, Shin-chan Sushi Bay, Dragon Ball Super, Naruto, One Piece Film Red...
  3. *Bom Tấn Hành Động*: Hai Phượng, John Wick 4, Top Gun Maverick, Vây Hãm 3...
- **Kiến trúc Chịu Tải 2,000 CCU**: Bộ đệm Redis phân tầng, Circuit Breaker, tự động đồng bộ hóa kho phim.`,
    responseEn: `🎬 **CinemaStreamHub — High-Fidelity 4K Theatrical Experience:**

A cutting-edge streaming platform engineered by Kiet featuring:
- **3D Velvet Curtain Opening Sequence**: Photorealistic theatrical curtain opening simulated with Three.js custom shaders.
- **Curated 4K Theatrical Movies & Trailers**:
  1. *Vietnamese Box Office Hits*: Mai, Face Off 7, The House of No Man, Song of the South, Crimson Snout, Furie...
  2. *Theatrical Anime Universes*: Doraemon Movies, Detective Conan (Million-dollar Pentagram), Shin-chan, Dragon Ball, One Piece: Red...
  3. *Action Blockbusters*: John Wick 4, Top Gun Maverick, The Roundup 3...
- **High Concurrency Resilient Backend**: Redis multi-tier caching, Circuit Breakers, and automated cron ingestion.`,
    actionLink: {
      labelVi: 'Trải nghiệm CinemaStreamHub ngay',
      labelEn: 'Open CinemaStreamHub Now',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '⛩️ Phim Doraemon có gì?', query: 'Phim Doraemon có những phần nào?' },
      { label: '🇻🇳 Phim chiếu rạp Việt Nam', query: 'Phim chiếu rạp Việt Nam gồm những phim nào?' },
      { label: '👑 Quyền lợi VIP Cinema', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
    ],
    quickRepliesEn: [
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
      { label: '🇻🇳 VN Theatrical Movies', query: 'What Vietnamese theatrical movies are included?' },
      { label: '👑 VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
    ],
  },

  // 4. Kỹ năng công nghệ & Tech Stack
  {
    id: 'skills_tech',
    keywords: [
      'ky nang', 'tech stack', 'cong nghe', 'skill', 'tools', 'ngon ngu', 'lap trinh', 'react',
      'typescript', 'node', 'nodejs', 'threejs', 'three.js', 'postgres', 'docker', 'redis', 'vitest'
    ],
    responseVi: `🛠️ **Bộ Kỹ Năng & Tech Stack Chuyên Sâu của Mai Anh Kiệt:**

- **Frontend & 3D Interactive**: React 19, TypeScript, Three.js, WebGL, TailwindCSS v4, Vite, Rolldown, GSAP, Framer Motion.
- **Backend & Distributed Systems**: Node.js, Express, NestJS, RESTful APIs, WebSockets, Circuit Breakers, Idempotency keys, TaskQueue / Dead-Letter Queue.
- **Database & Caching**: PostgreSQL, Prisma ORM, Redis (In-Memory Cache), Connection Pooling, Query Plan Indexing.
- **DevOps, Cloud & Testing**: Docker, Docker Compose, CI/CD GitHub Actions, Nginx, Vitest (100% test coverage trên 24 test suites), Zero-Downtime deployment.`,
    responseEn: `🛠️ **Mai Anh Kiet's Core Tech Stack & Engineering Skills:**

- **Frontend & 3D Web**: React 19, TypeScript, Three.js, WebGL, TailwindCSS v4, Vite, Rolldown, GSAP.
- **Backend & Resilient Systems**: Node.js, Express, NestJS, RESTful APIs, WebSockets, Circuit Breakers, Idempotency patterns, Task Queues with DLQ.
- **Databases & High-Speed Cache**: PostgreSQL, Prisma ORM, Redis Multi-tier caching, Connection Pooling, Index Optimization.
- **DevOps, Cloud & Automated Testing**: Docker, Docker Compose, CI/CD GitHub Actions, Nginx, Vitest (100% pass across 24 suites), Zero-downtime workflows.`,
    actionLink: {
      labelVi: 'Xem toàn bộ Kỹ Năng & Chứng Chỉ',
      labelEn: 'View All Skills & Certifications',
      url: '#skills',
    },
    quickRepliesVi: [
      { label: '🚀 Xem các dự án thực tế', query: 'Các dự án nổi bật của Kiệt?' },
      { label: '📬 Đề xuất phỏng vấn kỹ thuật', query: 'Liên hệ phỏng vấn tuyển dụng' },
    ],
    quickRepliesEn: [
      { label: '🚀 Explore Projects', query: 'What are Kiet key projects?' },
      { label: '📬 Schedule Tech Interview', query: 'How to contact Kiet for recruitment or collaboration?' },
    ],
  },

  // 5. Dự án khác & 3D Ocean Whale
  {
    id: 'projects_list',
    keywords: [
      'du an', 'project', 'san pham', 'portfolio', 'ca voi', 'ocean whale', 'whale', 'cyber core',
      'lightning', 'terminal', 'guestbook', 'admin dashboard'
    ],
    responseVi: `🚀 **Hệ Thống Các Dự Án Nổi Bật Trên Kietfolio:**

1. **CinemaStreamHub (Cinema 4K Hub)**: Nền tảng xem phim & trailer 4K với màn mở màn 3D, kiến trúc chịu tải 2,000 CCU, tự động đồng bộ API KKPhim & TMDb.
2. **Ocean Whale Cinematic**: Mô hình cá voi 3D Three.js bơi lượn trên đại dương hạt số thời gian thực (nhấn phím ESC để kích hoạt hoặc bỏ qua).
3. **Cyber Core Hero Terminal**: Mô phỏng giao diện Terminal dòng lệnh cyberpunk tương tác thời gian thực tại trang chủ.
4. **Admin Command Center**: Dashboard điều hành cao cấp với biểu đồ phân tích người dùng, giám sát bảo mật phân quyền RBAC và kiểm duyệt bình luận.
5. **Smart Donation & Payment Gateway**: Cổng thanh toán quét mã VNPay QR, tích hợp MoMo và xác nhận giao dịch tự động.`,
    responseEn: `🚀 **Key Projects Featured on Kietfolio:**

1. **CinemaStreamHub (Cinema 4K Hub)**: Advanced streaming platform with 3D curtain opening, 2,000 CCU load-tested backend, and dynamic KKPhim/TMDb ingestion.
2. **Ocean Whale Cinematic**: Interactive 3D Three.js digital oceanic whale swimming through dynamic particle fields.
3. **Cyber Core Hero Terminal**: Real-time cyberpunk command-line simulator on the hero homepage.
4. **Admin Command Center**: Enterprise dashboard with live metrics, RBAC security, audit logging, and catalog management.
5. **Smart Payment Gateway**: VNPay QR checkout integration with instant digital receipts and VIP membership codes.`,
    actionLink: {
      labelVi: 'Khám phá mục Dự Án',
      labelEn: 'Explore Projects Section',
      url: '#projects',
    },
    quickRepliesVi: [
      { label: '🎬 Vào xem CinemaStreamHub', query: 'Giới thiệu về nền tảng phim CinemaStreamHub' },
      { label: '📬 Liên hệ hợp tác dự án', query: 'Làm sao để liên hệ Kiệt?' },
    ],
    quickRepliesEn: [
      { label: '🎬 Open CinemaStreamHub', query: 'What is CinemaStreamHub platform?' },
      { label: '📬 Partner on a Project', query: 'How to contact Kiet?' },
    ],
  },

  // 6. Liên hệ & Tuyển dụng (Hiring & Contact)
  {
    id: 'contact_hire',
    keywords: [
      'lien he', 'contact', 'email', 'sdt', 'dien thoai', 'zalo', 'github', 'linkedin', 'tuyen dung',
      'hire', 'phong van', 'cv', 'resume', 'hop tac', 'gui loi nhan', 'tim viec', 'job'
    ],
    responseVi: `📬 **Thông Tin Liên Hệ & Cơ Hội Hợp Tác với Mai Anh Kiệt:**

- 📧 **Email chính thức**: [kietteve22102005@gmail.com](mailto:kietteve22102005@gmail.com)
- 🐙 **GitHub Profile**: [github.com/RonahDev](https://github.com/RonahDev)
- 💼 **LinkedIn Profile**: [linkedin.com/in/maianhkiet](https://linkedin.com/in/maianhkiet)
- 📍 **Địa bàn**: TP. Hồ Chí Minh & Bình Dương (Sẵn sàng làm việc On-site hoặc Remote)
- 📝 **Form Liên Hệ Trực Tiếp**: Bạn có thể gửi tin nhắn ngay tại mục Liên Hệ cuối trang web để Kiệt phản hồi trong vòng 24 giờ!`,
    responseEn: `📬 **Contact Channels & Collaboration Opportunities:**

- 📧 **Official Email**: [kietteve22102005@gmail.com](mailto:kietteve22102005@gmail.com)
- 🐙 **GitHub**: [github.com/RonahDev](https://github.com/RonahDev)
- 💼 **LinkedIn**: [linkedin.com/in/maianhkiet](https://linkedin.com/in/maianhkiet)
- 📍 **Location**: Ho Chi Minh City & Binh Duong (Available for On-site & Remote roles)
- 📝 **Direct Contact Form**: Leave a message in the Contact section at the bottom of the page and Kiet will reply within 24 hours!`,
    actionLink: {
      labelVi: 'Đi đến Form Liên Hệ',
      labelEn: 'Go to Contact Form',
      url: '#contact',
    },
    quickRepliesVi: [
      { label: '📄 Tải thông tin tóm tắt', query: 'Giới thiệu về Mai Anh Kiệt' },
      { label: '✍️ Để lại lời nhắn Guestbook', query: 'Để lại lời nhắn tại Lưu Bút' },
    ],
    quickRepliesEn: [
      { label: '📄 Read Bio Summary', query: 'Tell me about Mai Anh Kiet' },
      { label: '✍️ Leave a Guestbook Note', query: 'How to sign guestbook?' },
    ],
  },

  // 7. Quyên góp & VIP (Donate / VIP)
  {
    id: 'donate_vip',
    keywords: [
      'donate', 'quyen gop', 'vip', 'mua vip', 'vnpay', 'momo', 'vietcombank', 'ung ho',
      'nang cap', 'ma giam gia', 'code', 'founder', 'kietvip'
    ],
    responseVi: `☕ **Chương Trình Quyên Góp & Nâng Cấp Tài Khoản VIP:**

- **Ủng hộ dự án**: Bạn có thể mời Kiệt một ly cà phê qua cổng thanh toán VNPay QR hoặc chuyển khoản ngân hàng tự động.
- **Quyền lợi tài khoản VIP**:
  - Huy hiệu **👑 VIP Member** vàng kim độc quyền trên toàn trang web.
  - Xem không giới hạn toàn bộ kho phim chiếu rạp và trailer 4K sắc nét nhất.
  - Hỗ trợ ưu tiên và truy cập sớm vào các tính năng kỹ thuật mới.
- **Mã ưu đãi**: Bạn có thể sử dụng các mã như \`KIETVIP2025\`, \`CYBERVIP\`, hoặc \`FOUNDER\` tại cửa sổ Nâng cấp VIP!`,
    responseEn: `☕ **Donation & VIP Membership Privileges:**

- **Support the Project**: Buy Kiet a coffee via automated VNPay QR checkout or direct bank transfer.
- **VIP Perks**:
  - Exclusive golden **👑 VIP Member** badge displayed throughout the platform.
  - Unlimited, uninterrupted streaming of all 4K theatrical titles.
  - Priority engineering support and early access to upcoming features.
- **Promo Codes**: Enter codes such as \`KIETVIP2025\`, \`CYBERVIP\`, or \`FOUNDER\` in the VIP Upgrade modal!`,
    actionLink: {
      labelVi: 'Mở cửa sổ Nâng Cấp VIP',
      labelEn: 'Open VIP Upgrade Modal',
      url: '#vip',
    },
    quickRepliesVi: [
      { label: '🎬 Xem kho phim rạp', query: 'Giới thiệu về nền tảng phim CinemaStreamHub' },
      { label: '📬 Liên hệ trực tiếp', query: 'Làm sao để liên hệ Kiệt?' },
    ],
    quickRepliesEn: [
      { label: '🎬 Browse Theatrical Movies', query: 'What is CinemaStreamHub platform?' },
      { label: '📬 Contact Directly', query: 'How to contact Kiet?' },
    ],
  },

  // 8. Chào hỏi thân thiện (Greetings)
  {
    id: 'greeting',
    keywords: [
      'chao', 'xin chao', 'hello', 'hi', 'hey', 'alo', 'good morning', 'good evening',
      'co ai', 'giup toi', 'help', 'chao ban', 'test', 'halo'
    ],
    responseVi: `👋 **Xin chào bạn!** Tôi là trợ lý AI tự động của Mai Anh Kiệt. 

Tôi có thể giải đáp mọi thông tin về hồ sơ năng lực của Kiệt, kinh nghiệm điều phối kho bãi tại SPX Express (Hub 63BDG02), nền tảng CinemaStreamHub, hoặc hướng dẫn bạn liên hệ công việc.

Bạn muốn tìm hiểu thông tin nào? Hãy chọn một trong các gợi ý bên dưới nhé!`,
    responseEn: `👋 **Hello there!** I am Mai Anh Kiet's automatic AI assistant.

I can answer any questions about Kiet's software profile, logistics dispatch experience at SPX Express (Hub 63BDG02), CinemaStreamHub platform, or help you connect for career opportunities.

How can I help you today? Feel free to pick a prompt below!`,
    quickRepliesVi: DEFAULT_QUICK_REPLIES_VI,
    quickRepliesEn: DEFAULT_QUICK_REPLIES_EN,
  },
]

export const FALLBACK_RESPONSE_VI = `🤖 **Tôi chưa hiểu rõ câu hỏi này, nhưng tôi luôn sẵn sàng hỗ trợ bạn!**

Bạn có thể thử hỏi tôi về:
1. **Mai Anh Kiệt là ai?** (Hồ sơ, học vấn, định hướng)
2. **Kinh nghiệm SPX Express?** (Điều phối kho bãi, xử lý đơn hàng ngày Mega Sale)
3. **Nền tảng CinemaStreamHub?** (Xem trailer 4K, các phim Doraemon, Conan, phim rạp Việt)
4. **Tech stack & kỹ năng?** (React, Three.js, Node.js, PostgreSQL, Docker)
5. **Cách liên hệ tuyển dụng / hợp tác?**

*Hoặc bạn có thể bấm chọn một trong các câu hỏi gợi ý nhanh bên dưới nhé:*`

export const FALLBACK_RESPONSE_EN = `🤖 **I didn't quite catch that, but I'm ready to assist you!**

You can ask me about:
1. **Who is Mai Anh Kiet?** (Bio, education, engineering philosophy)
2. **SPX Express experience?** (Warehouse dispatching, Mega Sale surge operations)
3. **CinemaStreamHub?** (4K theatrical streaming, Doraemon, Conan, Vietnamese cinema)
4. **Tech stack & skills?** (React, Three.js, Node.js, PostgreSQL, Docker)
5. **Recruitment & contact channels?**

*Feel free to select one of the quick suggestion chips below:*`
