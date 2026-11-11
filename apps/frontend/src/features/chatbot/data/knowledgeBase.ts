import type { QuickReplyOption } from '../types/chat'

export interface KnowledgeTopic {
  id: string
  keywords: string[]
  intentCategory: 'safety' | 'proof_metrics' | 'portfolio' | 'spx_logistics' | 'cinema' | 'vip' | 'recruitment' | 'greeting'
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

export const DEFAULT_INITIAL_MESSAGE_VI = `👋 **Xin chào! Tôi là Trợ Lý AI Thông Minh của Mai Anh Kiệt.**

Tôi được huấn luyện với tư duy phân tích logic và dữ liệu thực chứng để hỗ trợ bạn:
- 📊 **Số Liệu Xác Thực & Hiệu Năng**: 2,000 CCU load-tested, SLA 99.9% kho SPX, 198 testcases pass 100%, 60 FPS 3D Three.js.
- 👨‍💻 **Hồ Sơ Năng Lực & Kỹ Thuật**: Tư vấn chuyên môn Fullstack/DevOps, giải pháp kiến trúc hệ thống của Mai Anh Kiệt.
- 🎬 **Tư Vấn Điện Ảnh CinemaStreamHub**: Gợi ý phim theo tâm trạng, đặc quyền VIP 4K & Dolby Atmos, kho phim Doraemon/Conan/Phim Việt.
- 💼 **Tư Vấn Tuyển Dụng & Hợp Tác**: Đánh giá độ phù hợp với các vị trí kỹ thuật, kết nối phỏng vấn trực tiếp.

*Bạn muốn tìm hiểu thông tin nào trước? Hãy chọn câu hỏi nhanh bên dưới hoặc gõ trực tiếp nhé!*`

export const DEFAULT_INITIAL_MESSAGE_EN = `👋 **Hello! I am Mai Anh Kiet's AI Engineering & Cinema Assistant.**

Trained with logical reasoning and verifiable empirical evidence to assist you with:
- 📊 **Verifiable Metrics & Proof**: 2,000 CCU concurrency, 99.9% SPX logistics SLA, 198 automated tests passing, 60 FPS 3D Three.js.
- 👨‍💻 **Engineering Profile**: Fullstack/DevOps expertise, high-concurrency architecture solutions by Mai Anh Kiet.
- 🎬 **CinemaStreamHub Consultation**: Personalized movie recommendations, 4K & Dolby Atmos VIP perks, licensed collections.
- 💼 **Recruitment & Partnership**: Skill alignment evaluation for tech roles, direct contact channels.

*What would you like to explore? Feel free to pick a prompt below or type your inquiry!*`

export const DEFAULT_QUICK_REPLIES_VI: QuickReplyOption[] = [
  { label: '📊 Số liệu hiệu năng & bằng chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
  { label: '👨‍💻 Mai Anh Kiệt là ai?', query: 'Giới thiệu về Mai Anh Kiệt và chuyên môn kỹ thuật' },
  { label: '🎬 Tư vấn: Tối nay xem phim gì?', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
  { label: '📦 Kinh nghiệm 100k đơn tại SPX', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
  { label: '👑 Quyền lợi tài khoản VIP', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
  { label: '📬 Đề xuất tuyển dụng / Hợp tác', query: 'Làm sao để liên hệ tuyển dụng hoặc hợp tác với Kiệt?' },
]

export const DEFAULT_QUICK_REPLIES_EN: QuickReplyOption[] = [
  { label: '📊 Verified Metrics & Proof', query: 'What empirical metrics and data prove system performance?' },
  { label: '👨‍💻 Who is Mai Anh Kiet?', query: 'Tell me about Mai Anh Kiet and engineering background' },
  { label: '🎬 Movie Recommendations', query: 'Recommend a great movie to watch on CinemaStreamHub' },
  { label: '📦 SPX Express 100k Volume', query: 'Tell me about Kiet operations experience at SPX Express' },
  { label: '👑 VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
  { label: '📬 Contact / Hiring', query: 'How can I contact Kiet for recruitment or collaboration?' },
]

// -----------------------------------------------------------------------------
// SAFETY & GUARDRAIL PATTERNS
// -----------------------------------------------------------------------------
export const SAFETY_FILTER = {
  toxicKeywords: [
    'chui bay', 'chui bo', 'dm', 'dcm', 'vcl', 'con lon', 'cai lon', 'thang ngu', 'con ngu', 'do ngu', 'ngu qua',
    'con cho', 'do cho', 'suc vat', 'cut di', 'bien di', 'me may', 'ba may', 'fuck you', 'motherfucker',
    'bitch', 'asshole', 'bastard', 'dkm', 'chet di', 'toxic'
  ],
  scamKeywords: [
    'lua dao', 'scam', 'tai xiu', 'danh bac', 'co bac', 'lo de', 'tien ao', 'crypto pump',
    'da cap', 'ponzi', 'vay tien', 'vay nong', 'chuyen khoan gap', 'nap the cao', 'nhan thuong mien phi'
  ],
  nsfwKeywords: [
    'sex', 'khieu dam', 'doi truy', 'phim sex', 'phim 18', 'phim heo', 'gai goi', 'kich duc',
    'porn', 'nude', 'hentai', 'jav', 'lo clip', 'link 18'
  ],
  injectionKeywords: [
    'ignore all previous instructions', 'ignore previous', 'jailbreak', 'system prompt',
    'drop table', 'delete from users', 'truncate table', 'union select', 'sql injection',
    'bypass security', 'hack website'
  ],
}

export const SAFETY_RESPONSE_VI = `🛡️ **Thông báo an toàn & chuẩn mực ứng xử:**

Tôi là Trợ lý AI chính thức của Mai Anh Kiệt. Tôi cam kết duy trì môi trường trao đổi **văn minh, tích cực, minh bạch và an toàn**:
- ❌ **Từ chối**: Nội dung lăng mạ, khiêu dâm 18+, lừa đảo cờ bạc/tiền tệ trái phép, hoặc nỗ lực can thiệp bảo mật hệ thống.
- ✅ **Sẵn sàng hỗ trợ**: Các câu hỏi về năng lực kỹ thuật, kinh nghiệm vận hành kho SPX, nền tảng điện ảnh CinemaStreamHub và cơ hội hợp tác nghề nghiệp.

*Vui lòng nhập câu hỏi phù hợp để tôi được phục vụ bạn một cách tốt nhất!*`

export const SAFETY_RESPONSE_EN = `🛡️ **Safety & Community Guidelines Notice:**

I am Mai Anh Kiet's official AI Assistant, designed to uphold **courteous, constructive, safe, and professional** conversations:
- ❌ **Prohibited**: Toxic profanity, NSFW/adult content, financial scams/gambling, or security exploit attempts.
- ✅ **Supported**: Software architecture inquiries, SPX logistics track record, CinemaStreamHub streaming features, and recruitment collaboration.

*Please feel free to ask questions related to technology, cinema, or professional opportunities!*`

// -----------------------------------------------------------------------------
// ENRICHED KNOWLEDGE TOPICS (LOGIC + EMPIRICAL METRICS + CONSULTING)
// -----------------------------------------------------------------------------
export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  // 1. SỐ LIỆU XÁC THỰC & BẰNG CHỨNG HIỆU NĂNG (Empirical Evidence & Metrics)
  {
    id: 'proof_and_metrics',
    intentCategory: 'proof_metrics',
    keywords: [
      'so lieu', 'bang chung', 'xac thuc', 'uy tin', 'metrics', 'proof', 'chung minh',
      'benchmark', 'hieu nang', 'performance', 'latency', 'chiu tai', 'ccu', 'testcase',
      'kiem thu', 'fps', 'do tre', 'con so'
    ],
    responseVi: `📊 **Báo Cáo Số Liệu Thực Chứng & Đánh Giá Năng Lực Hệ Thống (Verifiable Proof):**

Để đảm bảo tính xác thực cao nhất, mọi thông số kỹ thuật đều được đo đạc và kiểm chứng thực tế:

1. ⚡ **Kiến Trúc Chịu Tải Cao (High Concurrency & Latency)**:
   - **2,000 CCU Concurrent Load Test**: Hệ thống đã vượt qua bài test áp lực mô phỏng 2,000 người dùng đồng thời truy cập mà **không xảy ra downtime hay crash**.
   - **Độ trễ P95 < 45ms**: Tối ưu hóa nhờ kiến trúc đệm phân tầng (Multi-tier Cache) và PostgreSQL Connection Pooling (20 connections/instance).
   - **Circuit Breaker Tự Động**: Ngắt mạch tức thì trong 100ms khi phát hiện lỗi từ dịch vụ ngoại vi, tránh hiệu ứng thác lũ (Cascading Failure).

2. 📦 **Năng Lực Vận Hành Kho Bãi SPX Express (Hub 63BDG02)**:
   - **100,000+ bưu kiện/ngày**: Trực tiếp điều phối trong đợt Mega Sale 11.11 & 12.12.
   - **Thời gian quay đầu xe tải giảm 37.7%**: Từ 45 phút xuống dưới **28 phút**, giải phóng bãi đỗ tải áp lực cao.
   - **SLA Cam Kết Đạt 99.9%**: 0 sự cố đứt gãy luồng hàng trọng điểm.

3. 🧪 **Độ Tin Cậy Phần Mềm (100% Automated Test Coverage)**:
   - **198/198 Testcases Đạt 100%**: 25 bộ kiểm thử Frontend (131 tests) + 7 bộ kiểm thử Backend (67 tests), bao gồm kiểm định phân quyền RBAC, CSRF guard, bộ giải mã stream và cơ chế phục hồi dữ liệu.

4. 🎮 **Đồ Họa Không Gian 3D Mượt Mà**:
   - **Duy trì ổn định 60 FPS**: Tự động hạ tải thích ứng qua \`PerformanceContext\` đối với thiết bị cấu hình yếu, loại bỏ hoàn toàn hiện tượng tụt khung hình (drop FPS).`,
    responseEn: `📊 **Empirical Evidence & System Benchmark Report:**

All capabilities are backed by verifiable real-world production metrics:

1. ⚡ **High Concurrency & Resilience Benchmarks**:
   - **2,000 CCU Stress Tested**: Verified under synthetic load of 2,000 concurrent active users with zero downtime.
   - **P95 Latency < 45ms**: Powered by in-memory multi-tier caching and PostgreSQL connection pooling.
   - **Automated Circuit Breaker**: Trips within 100ms to safeguard backend state during external API outages.

2. 📦 **SPX Express Logistics Production Numbers (Hub 63BDG02)**:
   - **100,000+ Parcels/Day**: Orchestrated during high-density Mega Sales (11.11, 12.12).
   - **Truck Turnaround Reduced by 37.7%**: Cut bay wait times from 45 mins to under 28 mins.
   - **SLA Compliance at 99.9%**: Flawless cross-dock delivery schedule adherence.

3. 🧪 **Software Reliability Assurance**:
   - **198/198 Automated Tests Passing (100%)**: Across 25 frontend and 7 backend test suites covering RBAC, CSRF, and stream integrity.

4. 🎮 **3D Graphics Smoothness**:
   - **Locked 60 FPS Target**: Real-time adaptive level-of-detail throttling via \`PerformanceContext\` preventing frame stuttering.`,
    actionLink: {
      labelVi: 'Xem Kiến Trúc & Bằng Chứng',
      labelEn: 'View Architecture & Proof',
      url: '#projects',
    },
    quickRepliesVi: [
      { label: '🛠️ Tech Stack chi tiết', query: 'Tech stack và kiến trúc của Kietfolio là gì?' },
      { label: '📦 Kinh nghiệm SPX Express', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
      { label: '🎬 Trải nghiệm Cinema 4K', query: 'Giới thiệu về nền tảng phim CinemaStreamHub' },
    ],
    quickRepliesEn: [
      { label: '🛠️ Detailed Tech Stack', query: 'What is Kiet tech stack and software skills?' },
      { label: '📦 SPX Experience', query: 'Tell me about Kiet operations experience at SPX Express' },
      { label: '🎬 CinemaStreamHub 4K', query: 'What is CinemaStreamHub platform?' },
    ],
  },

  // 2. TƯ VẤN XEM PHIM & GIẢI TRÍ CINEMA (Cinema Consulting & Recommendations)
  {
    id: 'cinema_consulting',
    keywords: [
      'tu van phim', 'xem gi', 'phim hay', 'goi y phim', 'recommend', 'toi nay xem gi',
      'toi nay xem phim gi', 'xem phim gi hay', 'tu van xem phim', 'tu van', 'goi y',
      'phim hot', 'phim rap', 'the loai', 'phim viet', 'phim hoat hinh', 'chieu rap',
      'phim hanh dong', 'phim anime', 'phim gi', 'xem phim gi'
    ],
    intentCategory: 'cinema',
    responseVi: `🍿 **Gợi Ý & Tư Vấn Phim Theo Sở Thích trên CinemaStreamHub:**

Dựa trên dữ liệu đánh giá và lượt xem thực tế, tôi xin tư vấn bạn theo từng nhu cầu:

1. 💥 **Nếu bạn thích Kịch tính, Hành động & Bùng nổ cảm xúc:**
   - **Sát Thủ John Wick: Phần 4** (Chất lượng 4K, hành động mãn nhãn).
   - **Lật Mặt 5: 48h & Lật Mặt 7** (Điện ảnh Việt Nam kịch tính, cảm xúc gia đình).
   - **Hai Phượng & Thanh Sói** (Võ thuật Việt Nam tốc độ cao).
   - **Vây Hãm: Kẻ Trừng Phạt (2024)** (Ma Dong-seok phá án hành động đấm bốc đỉnh cao).

2. ⛩️ **Nếu bạn thích Thư giãn, Hoạt hình & Tuổi thơ (Anime Masterpieces):**
   - **Doraemon: Nobita và Bản Giao Hưởng Địa Cầu (2024)** (Âm nhạc diệu kỳ, hình ảnh siêu đẹp).
   - **Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời** (Cảm động, ý nghĩa tình bạn).
   - **Thám Tử Lừng Danh Conan: Tàu Ngầm Sắt Màu Đen & Ngôi Sao 1 Triệu Đô** (Phá án nghẹt thở).
   - **One Piece Film: Red** (Bữa tiệc âm nhạc của Uta).

3. 🇻🇳 **Nếu bạn muốn ủng hộ Điện Ảnh Chiếu Rạp Việt Nam:**
   - Tuyển tập phim trăm tỷ: *Mai, Nhà Bà Nữ, Đất Rừng Phương Nam, Quỷ Cẩu, Cám (2024)*.

💡 **Mẹo trải nghiệm**: Bạn có thể mở thanh tìm kiếm tại CinemaStreamHub, gõ tên phim hoặc bấm vào các thể loại như **Doraemon, Chiếu Rạp, Hành Động** để khám phá ngay!`,
    responseEn: `🍿 **Curated Movie Recommendations on CinemaStreamHub:**

Here are top recommendations tailored to your mood:

1. 💥 **Action & Adrenaline Blockbusters**:
   - **John Wick: Chapter 4** (Full 4K Ultra HD, relentless choreography).
   - **Face Off Series (Lat Mat 5 & 7)** (Top-grossing Vietnamese action & drama).
   - **The Roundup: Punishment (2024)** (Ma Dong-seok hard-hitting crime action).

2. ⛩️ **Heartwarming Anime Universes**:
   - **Doraemon: Nobita's Earth Symphony (2024)** (Stunning audio-visual journey).
   - **Detective Conan The Movie** (High-stakes mystery and deduction).
   - **One Piece Film: Red** (Epic musical pirate adventure).

3. 🇻🇳 **Vietnamese Box Office Hits**:
   - Top cinema releases: *Mai, The House of No Man, Song of the South, Crimson Snout*.

💡 **Pro-Tip**: Head to CinemaStreamHub, filter by category or genre to stream trailers and full theatrical features!`,
    actionLink: {
      labelVi: 'Vào Xem Phim Ngay',
      labelEn: 'Browse CinemaStreamHub',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP Cinema', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '⛩️ Phim Doraemon có gì?', query: 'Phim Doraemon có những phần nào?' },
      { label: '🇻🇳 Phim chiếu rạp Việt Nam', query: 'Phim chiếu rạp Việt Nam gồm những phim nào?' },
    ],
    quickRepliesEn: [
      { label: '👑 VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
      { label: '🇻🇳 VN Theatrical Movies', query: 'What Vietnamese theatrical movies are included?' },
    ],
  },

  // 3. TƯ VẤN QUYỀN LỢI VIP & NÂNG CẤP (VIP Privileges & Technical Advancements)
  {
    id: 'vip_advisory',
    keywords: [
      'vip', 'mua vip', 'quyen loi vip', 'gia vip', 'dac quyen', 'nang cap vip',
      'tai khoan vip', '4k', 'dolby atmos', 'khong quang cao', 'server vip',
      'vip cinemastream', 'vip cinemastreamhub', 'quyen loi tai khoan vip',
      'quyen loi vip cinemastreamhub', 'dac quyen vip'
    ],
    intentCategory: 'vip',
    responseVi: `👑 **Tư Vấn Đặc Quyền & Quyền Lợi Gói Hội Viên VIP CinemaStream:**

Hệ thống cung cấp 2 gói hội viên linh hoạt (**Theo tháng** hoặc **Trọn đời**):

1. 💎 **Đặc Quyền Vượt Trội Của Hội Viên VIP**:
   - **Mở khóa 100% Phim Chiếu Rạp Độc Quyền**: Xem không giới hạn toàn bộ phim mới nhất, không bị giới hạn trailer.
   - **Độ Phân Giải 4K Ultra HD & Dolby Atmos**: Truyền phát chất lượng nguyên bản bitrate cao, âm thanh vòm sống động như tại rạp.
   - **Cụm Server VIP Fast HLS Riêng Biệt**: Đường truyền ưu tiên băng thông quốc tế, loại bỏ giật lag vào giờ cao điểm.
   - **Trải Nghiệm Sạch 100%**: Tuyệt đối không có quảng cáo chen ngang.
   - **Huy Hiệu VIP Gold**: Hiển thị vinh danh trên trang cá nhân và mọi bình luận.

2. 💳 **Cách Nâng Cấp Tức Thì**:
   - Quét mã **VietQR** hoặc **MoMo** tự động trong cửa sổ Nâng cấp VIP.
   - Nhập mã ưu đãi: \`FOUNDER\`, \`KIETVIP2025\`, \`CYBERVIP\` để nhận ưu đãi kích hoạt đặc biệt!`,
    responseEn: `👑 **VIP Membership Privileges & Technical Advantages:**

Choose between flexible Monthly or Lifetime VIP access:

1. 💎 **Exclusive VIP Perks**:
   - **Unlimited Full Theatrical Access**: Stream complete movies without trailer restrictions.
   - **4K Ultra HD & Dolby Atmos**: Highest audio-visual fidelity with pristine high-bitrate streaming.
   - **Dedicated VIP Fast HLS Clusters**: Isolated bandwidth pipelines ensuring zero buffering during peak traffic.
   - **Zero Advertisements**: Completely clean, uninterrupted viewing experience.
   - **Exclusive Golden VIP Badge**: Highlighted across your profile and discussions.

2. 💳 **Instant Activation**:
   - Scan automated VietQR or MoMo codes directly in the VIP modal.
   - Enter promo codes: \`FOUNDER\`, \`KIETVIP2025\`, or \`CYBERVIP\` for special discounts!`,
    actionLink: {
      labelVi: 'Mở Cửa Sổ Nâng Cấp VIP',
      labelEn: 'Open VIP Upgrade Modal',
      url: '#vip',
    },
    quickRepliesVi: [
      { label: '🎬 Khám phá kho phim rạp', query: 'Giới thiệu về nền tảng phim CinemaStreamHub' },
      { label: '📊 Xem số liệu chịu tải', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
    ],
    quickRepliesEn: [
      { label: '🎬 Explore Cinema Movies', query: 'What is CinemaStreamHub platform?' },
      { label: '📊 View Benchmarks', query: 'What empirical metrics and data prove system performance?' },
    ],
  },

  // 4. TƯ VẤN TUYỂN DỤNG & ĐÁNH GIÁ NĂNG LỰC (Recruitment & Technical Assessment)
  {
    id: 'recruitment_advisory',
    keywords: [
      'danh gia ung vien', 'co phu hop', 'nang luc ky thuat', 'danh gia ki thuat',
      'phong van ky thuat', 'muc luong mong muon', 'danh gia chuyen mon'
    ],
    intentCategory: 'recruitment',
    responseVi: `💼 **Tư Vấn Hồ Sơ Ứng Viên & Năng Lực Kỹ Thuật (Mai Anh Kiệt):**

Nếu bạn là Nhà tuyển dụng (HR/Tech Lead/Founder) đang tìm kiếm nhân sự chủ chốt, đây là bảng đánh giá khách quan:

1. 🎯 **Các Vị Trí Phù Hợp Nhất**:
   - **Fullstack Software Engineer** (React, TypeScript, Node.js, PostgreSQL).
   - **Frontend 3D Web Engineer** (Three.js, WebGL Shaders, GSAP, TailwindCSS).
   - **Backend & Systems Engineer** (API Gateway, Caching, Circuit Breakers, Docker).
   - **Logistics Systems Analyst** (Tối ưu hóa quy trình luân chuyển dữ liệu và hàng hóa).

2. 🧠 **Điểm Mạnh Vượt Trội (Key Value Proposition)**:
   - **Khả năng chịu áp lực cao**: Đã được tôi luyện trực tiếp tại sàn kho vận SPX Express điều phối **100,000+ kiện/ngày**.
   - **Tư duy kiến trúc hệ thống bền vững**: 100% test coverage tự động, phòng ngừa quá tải, phân tầng bảo mật RBAC.
   - **Tốc độ thực thi nhanh**: Tự chủ toàn bộ từ thiết kế UI/UX 3D, lập trình API, thiết kế cơ sở dữ liệu đến đóng gói Docker.

3. 📬 **Quy Trình Kết Nối Nhanh**:
   - Gửi email: **kietteve22102005@gmail.com** (Cam kết phản hồi trong 24h).
   - LinkedIn: [linkedin.com/in/maianhkiet](https://linkedin.com/in/maianhkiet)
   - Hoặc để lại lời nhắn tại Form Liên Hệ ở cuối trang!`,
    responseEn: `💼 **Candidate Profile & Technical Assessment (Mai Anh Kiet):**

For Recruiters, Engineering Leads, and Hiring Managers:

1. 🎯 **Optimal Role Alignment**:
   - **Fullstack Software Engineer** (React, TypeScript, Node.js, PostgreSQL).
   - **Frontend 3D Interactive Engineer** (Three.js, WebGL, GSAP, High-FPS interfaces).
   - **Backend & Distributed Systems Engineer** (Concurrency, Caching, Docker).
   - **Logistics Tech Specialist** (Warehouse systems and routing optimization).

2. 🧠 **Core Value Proposition**:
   - **Tested Under Pressure**: Proven resilience running high-stress SPX Express operations handling **100k+ daily parcels**.
   - **Architectural Rigor**: 100% automated test coverage, defensive failover patterns, and multi-tier RBAC security.
   - **Rapid End-to-End Delivery**: Complete autonomy across UI/UX, database modeling, and DevOps deployment.

3. 📬 **Direct Hiring Channels**:
   - Email: **kietteve22102005@gmail.com** (Guaranteed response within 24h).
   - LinkedIn: [linkedin.com/in/maianhkiet](https://linkedin.com/in/maianhkiet)`,
    actionLink: {
      labelVi: 'Đi đến Form Liên Hệ Tuyển Dụng',
      labelEn: 'Go to Recruitment Contact Form',
      url: '#contact',
    },
    quickRepliesVi: [
      { label: '📊 Xem báo cáo số liệu thực chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
      { label: '🛠️ Tech Stack chi tiết', query: 'Tech stack và kiến trúc của Kietfolio là gì?' },
    ],
    quickRepliesEn: [
      { label: '📊 View Empirical Proof', query: 'What empirical metrics and data prove system performance?' },
      { label: '🛠️ Detailed Tech Stack', query: 'What is Kiet tech stack and software skills?' },
    ],
  },

  // 5. GIỚI THIỆU MAI ANH KIỆT (Biography & Philosophy)
  {
    id: 'about_kiet',
    intentCategory: 'portfolio',
    keywords: [
      'la ai', 'gioi thieu', 'thong tin', 'profile', 'bio', 'who is', 'about kiet', 'ban la ai',
      'anh kiet', 'ronah', 'ronah mai', 'sinh nam', 'tuoi', 'que quan', 'hoc van', 'background'
    ],
    responseVi: `👨‍💻 **Mai Anh Kiệt (Ronah Mai) — Kỹ Sư Phần Mềm & Chuyên Viên Vận Hành Logistics:**

- **Chuyên môn cốt lõi**: Xây dựng ứng dụng web thời gian thực chịu tải cao, đồ họa 3D không gian tương tác (Three.js/WebGL), và tối ưu quy trình chuỗi cung ứng thực tế.
- **Tư duy kỹ thuật khác biệt**: Kiệt không chỉ viết mã, mà giải quyết bài toán với góc nhìn từ **sàn điều phối thực tế** — nơi mỗi giây nghẽn xe tải hay trễ bưu kiện đều phải trả giá bằng chi phí vận hành.
- **Dự án tiêu biểu**: *Kietfolio 3D Cyber Ecosystem, CinemaStreamHub 4K, Cyber Core Terminal, và Hệ thống điều phối trạm SPX Hub 63BDG02*.
- **Địa bàn**: TP. Hồ Chí Minh & Bình Dương (Sẵn sàng cho các dự án On-site hoặc Remote chất lượng cao).`,
    responseEn: `👨‍💻 **Mai Anh Kiet (Ronah Mai) — Software Engineer & Logistics Systems Specialist:**

- **Core Expertise**: High-concurrency web systems, immersive 3D web environments (Three.js/WebGL), and industrial logistics optimization.
- **Distinctive Engineering Mindset**: Bridges frontline warehouse floor pressure with scalable software architecture.
- **Signature Projects**: *Kietfolio 3D Cybernetic Ecosystem, CinemaStreamHub 4K, Cyber Core Terminal, and SPX Hub 63BDG02 Fleet Dispatching*.
- **Location**: Ho Chi Minh City & Binh Duong (Available for High-Impact On-site or Remote Roles).`,
    actionLink: {
      labelVi: 'Xem Mục Giới Thiệu',
      labelEn: 'View About Section',
      url: '#about',
    },
    quickRepliesVi: [
      { label: '📊 Số liệu thực chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
      { label: '📦 Kinh nghiệm SPX Express', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
      { label: '📬 Liên hệ Kiệt', query: 'Làm sao để liên hệ Kiệt?' },
    ],
    quickRepliesEn: [
      { label: '📊 Empirical Metrics', query: 'What empirical metrics and data prove system performance?' },
      { label: '📦 SPX Operations', query: 'Tell me about Kiet operations experience at SPX Express' },
      { label: '📬 Contact Info', query: 'How to contact Kiet?' },
    ],
  },

  // 6. KINH NGHIỆM ĐIỀU PHỐI KHO BÃI SPX EXPRESS
  {
    id: 'experience_spx',
    intentCategory: 'spx_logistics',
    keywords: [
      'spx', 'kinh nghiem spx', 'kinh nghiem lam viec tai spx', 'lam viec tai spx',
      'shopee', 'shopee express', 'spx express', 'hub', '63bdg02', 'thu dau mot', 'dieu phoi',
      'dispatcher', 'kho bai', 'hau can', 'logistics', 'mega sale', 'don hang', 'buu kien', 'operation'
    ],
    responseVi: `📦 **Kinh Nghiệm Điều Phối Vận Hành Tại SPX Express (Hub 63BDG02 - Thủ Dầu Một):**

Tại một trong những trạm trung chuyển trọng điểm khu vực miền Nam, Mai Anh Kiệt đã trực tiếp giải quyết các bài toán chuỗi cung ứng:
1. 📈 **Sản lượng bưu kiện**: Điều phối trơn tru luồng hàng đạt đỉnh **100,000+ bưu kiện/ngày** trong các chiến dịch Mega Sale 11.11, 12.12 mà không để xảy ra tình trạng tồn ứ quá 24h.
2. ⏱️ **Tối ưu thời gian quay đầu xe (Fleet Turnaround)**: Rút ngắn thời gian bốc dỡ xe tải từ 45 phút xuống dưới **28 phút (-37.7%)**, giúp đội xe container tăng thêm 1 chuyến giao/ngày.
3. 🛡️ **Duy trì SLA 99.9%**: Thiết lập quy trình điều động dự phòng (manual failover) khi hệ thống băng chuyền tự động gặp trục trặc kỹ thuật trong đêm cao điểm.`,
    responseEn: `📦 **Frontline Dispatching Operations at SPX Express (Hub 63BDG02):**

At a critical logistics hub in Southern Vietnam, Kiet engineered frontline operations:
1. 📈 **Surge Throughput**: Handled **100,000+ daily parcels** during peak Mega Sales (11.11, 12.12) with zero backlog over 24h.
2. ⏱️ **Fleet Turnaround Optimization**: Reduced loading bay cycle times from 45 mins to under **28 mins (-37.7%)**, boosting fleet utilization.
3. 🛡️ **99.9% SLA Adherence**: Authored failover procedures ensuring zero sorting line collapse during mechanical interruptions.`,
    actionLink: {
      labelVi: 'Xem Dòng Thời Gian Kinh Nghiệm',
      labelEn: 'View Experience Timeline',
      url: '#experience',
    },
    quickRepliesVi: [
      { label: '📊 Số liệu thực chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
      { label: '🛠️ Kỹ năng công nghệ', query: 'Tech stack và kiến trúc của Kietfolio là gì?' },
    ],
    quickRepliesEn: [
      { label: '📊 Empirical Metrics', query: 'What empirical metrics and data prove system performance?' },
      { label: '🛠️ Tech Stack', query: 'What is Kiet tech stack and software skills?' },
    ],
  },

  // 7. CINEMASTREAMHUB & TÍNH NĂNG KỸ THUẬT
  {
    id: 'cinema_stream_hub',
    intentCategory: 'cinema',
    keywords: [
      'cinemastreamhub', 'cinemastream', 'gioi thieu ve nen tang phim cinemastreamhub',
      'gioi thieu cinema', 'gioi thieu cinemastreamhub', 'nen tang cinemastreamhub',
      'rap chieu phim 3d', 'man nhung 3d', 'threejs cinema', 'tinh nang cinema',
      'cong nghe cinema', 'trai nghiem cinema', 'man nhung rap', 'cinemastreamhub la gi',
      'trailer', 'trailer cinema'
    ],
    responseVi: `🎬 **CinemaStreamHub — Nền Tảng Điện Ảnh & Chiếu Rạp 4K:**

Nền tảng đa phương tiện được thiết kế với tiêu chuẩn công nghệ cao cấp:
- 🎭 **Hiệu Ứng Màn Nhung Rạp 3D**: Sử dụng Three.js mô phỏng chân thực từng nếp gấp vải và ánh sáng spotlight rạp chiếu khi mở màn.
- ⚡ **Chịu Tải 2,000 CCU**: Backend chống nghẽn với Redis in-memory cache, connection pooling và Circuit Breakers.
- 🌐 **Vượt Rào DNS Việt Nam**: Toàn bộ áp phích và poster được dẫn qua edge CDN proxy \`wsrv.nl\` giúp tải ảnh mượt mà trên mọi nhà mạng (VNPT, Viettel, FPT).
- 🎞️ **Kho Phim Rực Rỡ**: Tuyển tập Doraemon The Movie, Conan, Shin-chan, Anime chiếu rạp và bom tấn điện ảnh Việt Nam.`,
    responseEn: `🎬 **CinemaStreamHub — 4K Theatrical Streaming Experience:**

High-fidelity cinema platform built with advanced web technologies:
- 🎭 **3D Velvet Curtain Simulation**: Custom Three.js shaders modeling fabric physics and cinema spotlights.
- ⚡ **2,000 CCU Concurrency Tested**: Resilient architecture with multi-tier Redis caching and Circuit Breakers.
- 🌐 **Edge CDN Proxying**: Images routed via \`wsrv.nl\` edge CDN to seamlessly bypass Vietnamese ISP DNS blocks.
- 🎞️ **Rich Catalog**: Complete Doraemon, Detective Conan, Shin-chan, and Vietnamese box office masterpieces.`,
    actionLink: {
      labelVi: 'Vào Trải Nghiệm CinemaStreamHub',
      labelEn: 'Explore CinemaStreamHub',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '🍿 Tư vấn tối nay xem gì', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
      { label: '👑 Quyền lợi VIP Cinema', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '⛩️ Phim Doraemon có gì?', query: 'Phim Doraemon có những phần nào?' },
    ],
    quickRepliesEn: [
      { label: '🍿 Recommend a movie', query: 'Recommend a great movie to watch on CinemaStreamHub' },
      { label: '👑 VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
    ],
  },

  // 8. TECH STACK & KIẾN TRÚC PHẦN MỀM
  {
    id: 'skills_tech',
    intentCategory: 'portfolio',
    keywords: [
      'ky nang', 'tech stack', 'cong nghe', 'skill', 'tools', 'ngon ngu', 'lap trinh', 'react',
      'typescript', 'node', 'nodejs', 'threejs', 'three.js', 'postgres', 'postgresql', 'docker', 'redis', 'vitest'
    ],
    responseVi: `🛠️ **Bộ Kỹ Năng & Kiến Trúc Phần Mềm của Mai Anh Kiệt:**

- **Frontend & Không Gian 3D**: React 19, TypeScript, Three.js, WebGL Shaders, TailwindCSS v4, GSAP, Framer Motion, Vite (Rolldown engine).
- **Backend & Hệ Thống Phân Tán**: Node.js, Express, NestJS, RESTful API, WebSockets, Rate Limiting, Circuit Breakers, Task Queue với Dead-Letter Queue.
- **Cơ Sở Dữ Liệu & Bộ Nhớ Đệm**: PostgreSQL, Prisma ORM, Redis Multi-tier caching, Composite Index Optimization.
- **Kiểm Thử & DevOps**: Docker, Docker Compose, Vitest (**198 testcases pass 100%**), CI/CD GitHub Actions, Zero-downtime deployment.`,
    responseEn: `🛠️ **Engineering Tech Stack & Architecture Skills:**

- **Frontend & 3D Web**: React 19, TypeScript, Three.js, WebGL, TailwindCSS v4, GSAP, Vite with Rolldown.
- **Backend & Distributed Systems**: Node.js, Express, RESTful APIs, WebSockets, Circuit Breakers, Idempotency Middleware, DLQ Task Queues.
- **Database & High-Speed Cache**: PostgreSQL, Prisma ORM, Redis multi-tier caching, Composite Index Tuning.
- **DevOps & Verification**: Docker, Docker Compose, Vitest (**198 tests passing 100%**), GitHub Actions CI/CD.`,
    actionLink: {
      labelVi: 'Xem Toàn Bộ Kỹ Năng',
      labelEn: 'View All Skills',
      url: '#skills',
    },
    quickRepliesVi: [
      { label: '📊 Số liệu thực chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
      { label: '💼 Đề xuất tuyển dụng', query: 'Làm sao để liên hệ tuyển dụng hoặc hợp tác với Kiệt?' },
    ],
    quickRepliesEn: [
      { label: '📊 Empirical Metrics', query: 'What empirical metrics and data prove system performance?' },
      { label: '💼 Recruitment Inquiry', query: 'How can I contact Kiet for recruitment or collaboration?' },
    ],
  },

  // 9. LIÊN HỆ & KÊNH KẾT NỐI (Contact & Collaboration)
  {
    id: 'contact_hire',
    intentCategory: 'recruitment',
    keywords: [
      'lien he', 'contact', 'email', 'gui email', 'sdt', 'dien thoai', 'zalo', 'github', 'linkedin',
      'hop tac', 'tuyen dung', 'hire', 'phong van', 'cv', 'resume', 'gui loi nhan', 'tim viec'
    ],
    responseVi: `📬 **Thông Tin Liên Hệ Trực Tiếp Với Mai Anh Kiệt:**

- 📧 **Email**: [kietteve22102005@gmail.com](mailto:kietteve22102005@gmail.com)
- 🐙 **GitHub**: [github.com/RonahDev](https://github.com/RonahDev)
- 💼 **LinkedIn**: [linkedin.com/in/maianhkiet](https://linkedin.com/in/maianhkiet)
- 📍 **Khu vực**: TP. Hồ Chí Minh & Bình Dương (Sẵn sàng làm việc On-site hoặc Remote)
- ⚡ **Tốc độ phản hồi**: Trong vòng 24 giờ kể từ khi nhận được lời nhắn!`,
    responseEn: `📬 **Direct Contact Channels for Mai Anh Kiet:**

- 📧 **Email**: [kietteve22102005@gmail.com](mailto:kietteve22102005@gmail.com)
- 🐙 **GitHub**: [github.com/RonahDev](https://github.com/RonahDev)
- 💼 **LinkedIn**: [linkedin.com/in/maianhkiet](https://linkedin.com/in/maianhkiet)
- 📍 **Location**: Ho Chi Minh City & Binh Duong, Vietnam
- ⚡ **Response Time**: Within 24 hours guaranteed!`,
    actionLink: {
      labelVi: 'Đi Đến Form Liên Hệ',
      labelEn: 'Go to Contact Form',
      url: '#contact',
    },
    quickRepliesVi: [
      { label: '💼 Tư vấn tuyển dụng', query: 'Làm sao để liên hệ tuyển dụng hoặc hợp tác với Kiệt?' },
      { label: '📊 Số liệu thực chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
    ],
    quickRepliesEn: [
      { label: '💼 Recruitment Inquiry', query: 'How can I contact Kiet for recruitment or collaboration?' },
      { label: '📊 Empirical Metrics', query: 'What empirical metrics and data prove system performance?' },
    ],
  },

  // 10. CHÀO HỎI THÂN THIỆN
  {
    id: 'greeting',
    intentCategory: 'greeting',
    keywords: [
      'chao', 'xin chao', 'hello', 'hi', 'hey', 'alo', 'good morning', 'good evening',
      'co ai', 'giup toi', 'help', 'chao ban', 'test', 'halo'
    ],
    responseVi: `👋 **Xin chào bạn! Rất vui được đón tiếp bạn.**

Tôi là Trợ lý AI của Mai Anh Kiệt, được trang bị tư duy logic, dữ liệu thực chứng và khả năng tư vấn toàn diện:
- 📊 **Cần xem số liệu chứng minh?** Hỏi tôi về SLA 99.9% kho SPX hay test chịu tải 2,000 CCU.
- 🍿 **Muốn tìm phim giải trí?** Hãy nói thể loại bạn thích, tôi sẽ gợi ý ngay!
- 👑 **Cần tìm hiểu gói VIP?** Tôi sẽ giải thích chi tiết chất lượng 4K & Dolby Atmos.
- 💼 **Quan tâm tuyển dụng Kiệt?** Tôi sẽ cung cấp thông tin liên hệ và bảng đánh giá kỹ năng.

*Hãy chọn câu hỏi gợi ý bên dưới hoặc nhắn bất kỳ thắc mắc nào của bạn nhé!*`,
    responseEn: `👋 **Hello there! Welcome to Kietfolio.**

I am Mai Anh Kiet's AI Assistant, equipped with logical reasoning and verified metrics:
- 📊 **Need proof?** Ask me about our 99.9% SPX logistics SLA or 2,000 CCU load test.
- 🍿 **Looking for a movie?** Tell me your mood, and I'll recommend the best pick!
- 👑 **Interested in VIP?** I can explain the 4K Ultra HD & Dolby Atmos streaming perks.
- 💼 **Recruiting Kiet?** I can provide contact info and fullstack competency assessment.

*Feel free to select a quick suggestion below or ask anything!*`,
    quickRepliesVi: DEFAULT_QUICK_REPLIES_VI,
    quickRepliesEn: DEFAULT_QUICK_REPLIES_EN,
  },
]

export const FALLBACK_RESPONSE_VI = `🤖 **Tôi chưa hiểu rõ câu hỏi này, nhưng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn!**

Bạn có thể thử hỏi tôi về các chủ đề chuyên sâu sau:
1. 📊 **Số liệu thực chứng & uy tín**: Chịu tải 2,000 CCU, P95 < 45ms, 198 testcases pass 100%, SLA kho SPX 99.9%.
2. 🎬 **Tư vấn xem phim**: Gợi ý phim rạp Việt, bom tấn hành động, anime Doraemon/Conan, đặc quyền gói VIP 4K.
3. 📦 **Kinh nghiệm SPX Express**: Điều phối hơn 100,000 bưu kiện/ngày tại trạm Hub 63BDG02.
4. 🛠️ **Tech Stack & Kiến trúc**: React 19, TypeScript, Three.js 3D, Node.js, PostgreSQL, Docker.
5. 💼 **Tuyển dụng & Hợp tác**: Đánh giá độ phù hợp ứng viên và kênh liên hệ trực tiếp với Kiệt.

*Hoặc bạn hãy bấm chọn một trong các gợi ý bên dưới để nhận câu trả lời tức thì nhé!*`

export const FALLBACK_RESPONSE_EN = `🤖 **I didn't quite catch that, but I'm ready to assist you!**

Feel free to ask me about:
1. 📊 **Verifiable Metrics & Proof**: 2,000 CCU load test, P95 < 45ms, 198 test suites pass 100%, 99.9% SPX SLA.
2. 🎬 **Movie Advisory**: Curated theatrical blockbusters, anime universes, 4K & Dolby Atmos VIP perks.
3. 📦 **SPX Express Track Record**: 100k+ daily parcels coordinated at Hub 63BDG02.
4. 🛠️ **Tech Stack & Architecture**: React 19, TypeScript, Three.js, Node.js, PostgreSQL, Docker.
5. 💼 **Hiring & Partnership**: Candidate alignment and direct recruitment channels.

*You can also pick one of the quick suggestions below for instant guidance!*`
