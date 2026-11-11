import type { QuickReplyOption } from '../types/chat'

export interface KnowledgeTopic {
  id: string
  keywords: string[]
  intentCategory:
    | 'safety'
    | 'proof_metrics'
    | 'portfolio'
    | 'spx_logistics'
    | 'cinema'
    | 'vip'
    | 'recruitment'
    | 'security'
    | 'greeting'
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

export const DEFAULT_INITIAL_MESSAGE_VI = `👋 **Xin chào! Tôi là Trợ Lý AI Chuyên Sâu của Mai Anh Kiệt.**

Tôi được huấn luyện liên tục với tư duy phân tích logic, sự am hiểu sâu sắc về điện ảnh và dữ liệu thực chứng minh bạch:
- 📊 **Số Liệu Xác Thực & Hiệu Năng**: Chịu tải 2,000 CCU không downtime, P95 < 45ms, 198/198 testcases pass 100%, SLA 99.9% kho SPX.
- 🎬 **Chuyên Gia Điện Ảnh CinemaStreamHub**: Tư vấn hơn 81+ phim chiếu rạp 4K, vũ trụ Doraemon/Conan/Ghibli/Hollywood, số liệu doanh thu Box Office Vietnam chính thức.
- 👑 **Đặc Quyền Hội Viên VIP 4K**: Tư vấn âm thanh Dolby Atmos, cụm server VIP Fast HLS, mã ưu đãi kích hoạt.
- 🛡️ **Bảo Mật & Phân Quyền RBAC**: Kiến trúc PostgreSQL 3 cấp độ (User, VIP, Super Admin), mã hóa bcrypt, HttpOnly cookies.
- 💼 **Hồ Sơ Năng Lực & Tuyển Dụng**: Đánh giá chuyên môn Fullstack/DevOps/Logistics của Mai Anh Kiệt.

*Bạn muốn tìm hiểu hoặc cần tư vấn điều gì? Hãy chọn các gợi ý nhanh bên dưới hoặc đặt câu hỏi trực tiếp nhé!*`

export const DEFAULT_INITIAL_MESSAGE_EN = `👋 **Hello! I am Mai Anh Kiet's Advanced AI Engineering & Cinema Assistant.**

Continuously trained with logical reasoning, deep cinematic expertise, and empirical transparency:
- 📊 **Verified Metrics & Proof**: 2,000 CCU concurrency, P95 < 45ms latency, 198 automated testcases passing (100%), 99.9% SPX logistics SLA.
- 🎬 **CinemaStreamHub Movie Expert**: Curated recommendations across 81+ 4K movies, Doraemon/Conan/Ghibli/Hollywood universes, and verified Box Office revenue data.
- 👑 **4K VIP Privileges**: Dolby Atmos acoustics, dedicated VIP Fast HLS bandwidth, and promo codes.
- 🛡️ **Security & RBAC Architecture**: 3-tier PostgreSQL access control (User, VIP, Super Admin), bcrypt hashing, HttpOnly session cookies.
- 💼 **Recruitment & Partnership**: Fullstack/DevOps/Logistics engineering assessment for Mai Anh Kiet.

*What would you like to explore? Feel free to pick a prompt below or type your inquiry!*`

export const DEFAULT_QUICK_REPLIES_VI: QuickReplyOption[] = [
  { label: '📊 Số liệu hiệu năng & bằng chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
  { label: '🎬 Tư vấn: Tối nay xem phim gì?', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
  { label: '🇻🇳 Doanh thu phim rạp Việt', query: 'Doanh thu các phim chiếu rạp Việt Nam là bao nhiêu?' },
  { label: '⛩️ Tuyển tập Doraemon & Conan', query: 'Phim Doraemon và Conan có những phần nào?' },
  { label: '👑 Quyền lợi tài khoản VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
  { label: '📦 Kinh nghiệm 100k đơn tại SPX', query: 'Kinh nghiệm điều phối kho bãi tại SPX Express' },
  { label: '🛡️ Bảo mật & Phân quyền RBAC', query: 'Kiến trúc bảo mật và phân quyền PostgreSQL như thế nào?' },
  { label: '📬 Đề xuất tuyển dụng / Hợp tác', query: 'Làm sao để liên hệ tuyển dụng hoặc hợp tác với Kiệt?' },
]

export const DEFAULT_QUICK_REPLIES_EN: QuickReplyOption[] = [
  { label: '📊 Verified Metrics & Proof', query: 'What empirical metrics and data prove system performance?' },
  { label: '🎬 Movie Recommendations', query: 'Recommend a great movie to watch on CinemaStreamHub' },
  { label: '🇻🇳 VN Box Office Records', query: 'What are the top grossing Vietnamese movies?' },
  { label: '⛩️ Doraemon & Conan Catalog', query: 'Which Doraemon and Conan movies are available?' },
  { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
  { label: '📦 SPX Express 100k Volume', query: 'Tell me about Kiet operations experience at SPX Express' },
  { label: '🛡️ Security & RBAC Specs', query: 'How does the PostgreSQL 3-tier RBAC architecture work?' },
  { label: '📬 Contact / Hiring', query: 'How can I contact Kiet for recruitment or collaboration?' },
]

// -----------------------------------------------------------------------------
// SAFETY & GUARDRAIL PATTERNS
// -----------------------------------------------------------------------------
export const SAFETY_FILTER = {
  toxicKeywords: [
    'chui bay', 'chui bo', 'dm', 'dcm', 'vcl', 'con lon', 'cai lon', 'thang ngu', 'con ngu', 'do ngu', 'ngu qua',
    'con cho', 'do cho', 'suc vat', 'cut di', 'bien di', 'me may', 'ba may', 'fuck you', 'motherfucker',
    'bitch', 'asshole', 'bastard', 'dkm', 'chet di', 'toxic', 'idiot'
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
// ENRICHED KNOWLEDGE TOPICS (EMPIRICAL EVIDENCE + CINEMA DOMAIN + ARCHITECTURE)
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
      'phim hot', 'the loai', 'chieu rap'
    ],
    intentCategory: 'cinema',
    responseVi: `🍿 **Gợi Ý & Tư Vấn Phim Theo Sở Thích trên CinemaStreamHub:**

Dựa trên dữ liệu đánh giá và lượt xem thực tế của hơn 81+ phim trên hệ thống:

1. 💥 **Hành Động, Kịch Tính & Bùng Nổ Cảm Xúc:**
   - **John Wick: Chapter 4** (Chất lượng 4K Ultra HD, những màn đấu súng võ thuật nghẹt thở tại Paris).
   - **Lật Mặt 7: Một Điều Ước & Lật Mặt 5: 48h** (Điện ảnh Lý Hải, cảm xúc gia đình sâu sắc kết hợp hành động tốc độ cao).
   - **Hai Phượng & Thanh Sói** (Ngô Thanh Vân - đỉnh cao phim võ thuật hành động Việt).
   - **Vây Hãm: Kẻ Trừng Phạt (2024)** (Ma Dong-seok đấm bốc phá án mãn nhãn).

2. ⛩️ **Anime Chiếu Rạp, Tuổi Thơ & Chữa Lành:**
   - **Doraemon: Nobita và Bản Giao Hưởng Địa Cầu (2024)** (Bữa tiệc âm nhạc diệu kỳ, hình ảnh siêu đẹp).
   - **Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời** (Cảm động, tình bạn sâu sắc).
   - **Thám Tử Lừng Danh Conan: Tàu Ngầm Sắt Màu Đen & Ngôi Sao 1 Triệu Đô** (Phá án đỉnh cao, Tổ chức Áo Đen).
   - **One Piece Film: Red** (Âm nhạc Uta bùng cháy) & **One Piece Stampede**.
   - **Spirited Away (Vùng Đất Linh Hồn - Oscar 2003)** & **Howl's Moving Castle**.

3. 🇻🇳 **Điện Ảnh Chiếu Rạp Việt Nam Trăm Tỷ:**
   - Tuyển tập kỷ lục phòng vé: *Mai (551 tỷ), Nhà Bà Nữ (475 tỷ), Bố Già (427 tỷ), Lật Mặt 6 (300 tỷ), Quỷ Cẩu (108 tỷ), Cám (2024)*.

4. 🌌 **Khoa Học Viễn Tưởng & Oscar Hollywood:**
   - *Oppenheimer (7 giải Oscar 2024), Dune: Part Two (Kỳ quan Arrakis), Interstellar, Inception, Deadpool & Wolverine ($1.34 tỷ USD)*.

💡 **Mẹo trải nghiệm**: Bạn có thể gõ trực tiếp tên diễn viên, đạo diễn (ví dụ: *Trấn Thành, Christopher Nolan, Ghibli, Doraemon*) để tôi tra cứu tức thì!`,
    responseEn: `🍿 **Curated Movie Recommendations on CinemaStreamHub:**

Drawn from our verified catalog of 81+ cinematic titles:

1. 💥 **High-Octane Action Blockbusters**:
   - **John Wick: Chapter 4** (Full 4K Ultra HD, relentless choreography across Paris).
   - **Face Off Series (Lat Mat 5 & 7)** (Record-grossing Vietnamese action & emotional family drama).
   - **The Roundup: Punishment (2024)** (Ma Dong-seok hard-hitting crime action).
   - **Furie & Furies** (Pinnacle of Vietnamese martial arts cinema).

2. ⛩️ **Heartwarming Anime Universes**:
   - **Doraemon: Nobita's Earth Symphony (2024)** (Audio-visual masterpiece).
   - **Detective Conan The Movie: Black Iron Submarine & 1-Million-Dollar Pentagram** (High-stakes deduction).
   - **One Piece Film: Red** (Epic musical pirate adventure).
   - **Studio Ghibli: Spirited Away (Academy Award Winner) & Howl's Moving Castle**.

3. 🇻🇳 **Vietnamese Box Office Record Breakers**:
   - *Mai (551 billion VND), The House of No Man (475 billion VND), Dad, I'm Sorry (427 billion VND), Lat Mat 6 & 7, Crimson Snout*.

4. 🌌 **Hollywood & Sci-Fi Legends**:
   - *Oppenheimer (7 Oscars 2024), Dune: Part Two, Interstellar, Inception, Deadpool & Wolverine ($1.34B worldwide)*.`,
    actionLink: {
      labelVi: 'Vào Xem Phim Ngay',
      labelEn: 'Browse CinemaStreamHub',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '🇻🇳 Doanh thu phim Việt', query: 'Doanh thu các phim chiếu rạp Việt Nam là bao nhiêu?' },
      { label: '⛩️ Phim Doraemon có gì?', query: 'Phim Doraemon có những phần nào?' },
    ],
    quickRepliesEn: [
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '🇻🇳 VN Box Office Records', query: 'What are the top grossing Vietnamese movies?' },
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
    ],
  },

  // 3. VŨ TRỤ PHIM CHIẾU RẠP VIỆT NAM & DOANH THU BOX OFFICE (Vietnamese Theatrical Cinema & Revenue)
  {
    id: 'vietnam_box_office',
    intentCategory: 'cinema',
    keywords: [
      'phim viet', 'phim viet nam', 'chieu rap viet', 'doanh thu', 'box office', 'box office vietnam',
      'phim mai', 'nha ba nu', 'bo gia', 'lat mat', 'lat mat 7', 'lat mat 6', 'lat mat 5', 'dat rung phuong nam',
      'quy cau', 'cam', 'em chua 18', 'tiec trang mau', 'hai phuong', 'thanh soi', 'tran thanh', 'ly hai',
      'doanh thu phong ve', 'phim tram ty'
    ],
    responseVi: `🇻🇳 **Bảng Xếp Hạng Doanh Thu Phòng Vé Điện Ảnh Việt Nam (Số Liệu Thực Chứng Box Office Vietnam):**

CinemaStreamHub tự hào cập nhật các cột mốc doanh thu chính thức được xác nhận bởi Box Office Vietnam:

1. 🏆 **Top 5 Phim Có Doanh Thu Cao Nhất Lịch Sử:**
   - 🥇 **Mai (2024 - ĐD Trấn Thành)**: **551 tỷ VNĐ** (Kỷ lục tuyệt đối của phòng vé Việt, thu hút 6.5 triệu lượt khán giả).
   - 🥈 **Lật Mặt 7: Một Điều Ước (2024 - ĐD Lý Hải)**: **482 tỷ VNĐ** (Bộ phim gia đình lấy đi nhiều nước mắt nhất series Lật Mặt).
   - 🥉 **Nhà Bà Nữ (2023 - ĐD Trấn Thành)**: **475 tỷ VNĐ** (Cơn sốt phòng vé dịp Tết Nguyên Đán 2023).
   - 🎖️ **Bố Già (2021 - ĐD Trấn Thành & Vũ Ngọc Đãng)**: **427 tỷ VNĐ** (Bộ phim đầu tiên của Việt Nam vượt mốc 400 tỷ).
   - 🎖️ **Lật Mặt 6: Tấm Vé Định Mệnh (2023 - ĐD Lý Hải)**: **300 tỷ VNĐ**.

2. 🌟 **Các Tác Phẩm Trăm Tỷ Đình Đám Khác Có Mặt Trên Hệ Thống:**
   - **Hai Phượng (2019 - Ngô Thanh Vân)**: **200 tỷ VNĐ** (Bộ phim hành động định hình chuẩn mực điện ảnh Việt ra thế giới).
   - **Tiệc Trăng Máu (2020 - ĐD Nguyễn Quang Dũng)**: **175 tỷ VNĐ** (Kịch bản tâm lý kịch tính xuất sắc).
   - **Em Chưa 18 (2017 - ĐD Lê Thanh Sơn)**: **171 tỷ VNĐ** (Cú hích thanh xuân phòng vé một thời).
   - **Đất Rừng Phương Nam (2023)**: **140 tỷ VNĐ** (Đại cảnh thiên nhiên Nam Bộ tráng lệ).
   - **Chị Chị Em Em 2 (2023)**: **121 tỷ VNĐ** & **Gặp Lại Chị Bầu (2024)**: **105 tỷ VNĐ**.

3. 👻 **Dòng Phim Kinh Dị & Tâm Linh Chiếu Rạp:**
   - **Quỷ Cẩu (2023)**: **108 tỷ VNĐ** (Hiện tượng kinh dị tâm linh gia đình lập kỷ lục doanh thu thể loại kinh dị).
   - **Cám (2024)**: Dị bản kinh dị đen tối từ câu chuyện cổ tích Tấm Cám gây tiếng vang lớn.`,
    responseEn: `🇻🇳 **Official Box Office Vietnam All-Time Revenue Rankings:**

Verifiable box office figures certified by Box Office Vietnam:

1. 🏆 **Top 5 Highest-Grossing Vietnamese Movies of All Time:**
   - 🥇 **Mai (2024 - Dir. Tran Thanh)**: **551 Billion VND** (All-time record holder with 6.5 million admissions).
   - 🥈 **Face Off 7: One Wish (2024 - Dir. Ly Hai)**: **482 Billion VND** (Most emotional family installment).
   - 🥉 **The House of No Man (2023 - Dir. Tran Thanh)**: **475 Billion VND**.
   - 🎖️ **Dad, I'm Sorry (2021 - Dir. Tran Thanh)**: **427 Billion VND** (First to cross 400B VND).
   - 🎖️ **Face Off 6: The Ticket of Destiny (2023 - Dir. Ly Hai)**: **300 Billion VND**.

2. 🌟 **Other Iconic 100B+ Blockbusters Available on CinemaStreamHub:**
   - **Furie (Hai Phuong - 2019)**: **200 Billion VND** (Landmark Vietnamese martial arts action).
   - **Blood Moon Party (Tiec Trang Mau - 2020)**: **175 Billion VND**.
   - **Jailbait (Em Chua 18 - 2017)**: **171 Billion VND**.
   - **Song of the South (Dat Rung Phuong Nam - 2023)**: **140 Billion VND**.
   - **Crimson Snout (Quy Cau - 2023)**: **108 Billion VND** (Highest-grossing Vietnamese horror film).`,
    actionLink: {
      labelVi: 'Xem Kho Phim Rạp Việt',
      labelEn: 'Explore VN Theatrical Movies',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '🎬 Xem phim Mai & Lật Mặt 7', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
    ],
    quickRepliesEn: [
      { label: '🎬 Browse Mai & Lat Mat 7', query: 'Recommend a great movie to watch on CinemaStreamHub' },
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
    ],
  },

  // 4. VŨ TRỤ DORAEMON THE MOVIE (Complete Doraemon Universe)
  {
    id: 'doraemon_universe',
    intentCategory: 'cinema',
    keywords: [
      'doraemon', 'nobita', 'doremon', 'doraemon the movie', 'ban giao huong dia cau',
      'vung dat ly tuong', 'stand by me', 'nam cuc kachi kochi', 'lau dai day bien',
      'vu tru ti hon', 'mat trang phieu luu ky', 'dao giau vang'
    ],
    responseVi: `⛩️ **Trọn Bộ 9 Phần Phim Chiếu Rạp Doraemon The Movie Trên CinemaStreamHub:**

Hệ thống đã chọn lọc và tối ưu hóa 9 tác phẩm hoạt hình Doraemon chiếu rạp đỉnh cao với hình ảnh 4K sắc nét và âm thanh sống động:

1. 🎼 **Doraemon: Nobita và Bản Giao Hưởng Địa Cầu (Movie 43 - 2024)**:
   - *Cốt truyện*: Nhóm bạn dùng âm nhạc để cứu lấy Trái Đất và hành tinh Muka khỏi thực thể bí ẩn nuốt chửng âm thanh.
   - *Điểm IMDb*: **7.8/10** | Đồ họa siêu thực, nhạc giao hưởng đỉnh cao.
2. ☁️ **Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời (Movie 42 - 2023)**:
   - *Cốt truyện*: Hành trình khám phá Paradapia cùng chú mèo robot Sonya; thông điệp xúc động: sự hoàn hảo không tạo nên hạnh phúc, hãy là chính mình.
3. 🚀 **Doraemon: Nobita và Cuộc Chiến Vũ Trụ Tí Hon 2021 (Movie 41 - 2022)**:
   - Nobita kết bạn với người ngoài hành tinh tí hon Papi và giải cứu hành tinh Pirika khỏi quân phiến loạn.
4. 🌕 **Doraemon: Nobita và Mặt Trăng Phiêu Lưu Ký (Movie 39 - 2019)**:
   - Thám hiểm vương quốc thỏ ngọc phía sau Mặt Trăng và sức mạnh của niềm tin.
5. 🏴‍☠️ **Doraemon: Nobita và Đảo Giấu Vàng (Movie 38 - 2018)**:
   - Doanh thu kỷ lục hơn 5.3 tỷ yên tại Nhật Bản, bài học sâu sắc về tình phụ tử của thuyền trưởng Silver.
6. ❄️ **Doraemon: Nobita và Chuyến Thám Hiểm Nam Cực Kachi Kochi (Movie 37 - 2017)**:
   - Cuộc phiêu lưu tìm chủ nhân chiếc nhẫn vàng đóng băng 100,000 năm tại Nam Cực.
7. 🌊 **Doraemon: Nobita và Lâu Đài Dưới Đáy Biển (2024 Remastered)**:
   - Khám phá vực sâu rãnh Mariana và máy tính năng lượng hạt nhân Poseidon.
8. 💖 **Stand by Me Doraemon (2014) & Stand by Me Doraemon 2 (2020)**:
   - Bộ đôi phim 3D cảm động lấy đi nước mắt của hàng triệu khán giả về ngày chia tay và lễ cưới tương lai của Nobita & Shizuka.`,
    responseEn: `⛩️ **Complete 9 Theatrical Doraemon Movies Collection on CinemaStreamHub:**

All 9 cinematic masterpieces remastered in 4K resolution with edge CDN acceleration:
1. 🎼 **Nobita's Earth Symphony (Movie 43 - 2024)**: Music restores planetary life.
2. ☁️ **Nobita's Sky Utopia (Movie 42 - 2023)**: Sonya the cat robot & the profound message on accepting flaws.
3. 🚀 **Nobita's Little Star Wars 2021 (2022)**: Intergalactic battle on planet Pirika with tiny alien Papi.
4. 🌕 **Chronicle of the Moon Exploration (2019)**: The hidden rabbit kingdom on the far side of the Moon.
5. 🏴‍☠️ **Nobita's Treasure Island (2018)**: Top-grossing entry (5.3B yen) featuring Captain Silver's story.
6. ❄️ **Great Adventure in the Antarctic Kachi Kochi (2017)**: Frozen golden ring mystery 100,000 years in the past.
7. 🌊 **Nobita and the Castle of the Undersea Devil (Remastered)**: Oceanic abyss exploration.
8. 💖 **Stand by Me Doraemon 1 & 2 (3D CG Masterpieces)**: The tearjerking journey of farewell and Nobita's wedding.`,
    actionLink: {
      labelVi: 'Xem Tuyển Tập Doraemon 4K',
      labelEn: 'Watch Doraemon Collection',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '🕵️ Phim Thám Tử Conan có gì?', query: 'Phim Conan có những phần nào?' },
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
    ],
    quickRepliesEn: [
      { label: '🕵️ Detective Conan Movies', query: 'Which Conan movies are available?' },
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
    ],
  },

  // 5. VŨ TRỤ THÁM TỬ LỪNG DANH CONAN (Detective Conan Movies)
  {
    id: 'conan_universe',
    intentCategory: 'cinema',
    keywords: [
      'conan', 'tham tu lung danh conan', 'tau ngam sat mau den', 'ngoi sao 1 trieu do',
      'qua bom choc tiet', 'cu dam sapphire', 'movie conan', 'conan movie', 'haibara ai', 'kaito kid'
    ],
    responseVi: `🕵️ **Vũ Trụ Bom Tấn Phá Án Thám Tử Lừng Danh Conan Trên CinemaStreamHub:**

Các siêu phẩm điện ảnh Conan xô đổ mọi kỷ lục phòng vé Nhật Bản và Việt Nam:

1. 🌊 **Conan Movie 26: Tàu Ngầm Sắt Màu Đen (2023)**:
   - *Doanh thu*: **13.8 tỷ yên** (Bộ phim đầu tiên của thương hiệu Conan vượt mốc 10 tỷ yên).
   - *Cốt truyện*: Cuộc chạm trán nghẹt thở giữa Conan, Haibara Ai và Tổ Chức Áo Đen (Gin, Vodka, Vermouth, Pinga) tại cơ sở giám sát đa quốc gia Pacific Buoy.
   - *Điểm nổi bật*: Mối quan hệ xúc động giữa Conan & Haibara, hành động dưới đáy biển đỉnh cao.

2. 🗡️ **Conan Movie 27: Ngôi Sao 1 Triệu Đô (2024)**:
   - *Doanh thu*: **15.7 tỷ yên** (Kỷ lục doanh thu cao nhất lịch sử thương hiệu Conan).
   - *Cốt truyện*: Vụ án bí ẩn tại Hakodate xoay quanh thanh kiếm Nhật của Hijikata Toshizo, sự đối đầu giữa Siêu trộm Kaito Kid và Thám tử miền Tây Hattori Heiji.
   - *Cú twist chấn động*: Tiết lộ bí mật thân thế gia tộc giữa Conan (Kudo Shinichi) và Kaito Kid!

3. 🎃 **Conan Movie 25: Nàng Dâu Halloween (2022)** & 💎 **Conan Movie 23: Cú Đấm Sapphire Xanh (2019)**:
   - Những màn đấu trí đỉnh cao tại Shibuya (Tokyo) và Marina Bay Sands (Singapore).`,
    responseEn: `🕵️ **Detective Conan Theatrical Blockbusters on CinemaStreamHub:**

Record-breaking anime movies dominating Japanese and Asian box offices:

1. 🌊 **Conan Movie 26: Black Iron Submarine (2023)**:
   - *Box Office*: **13.8 Billion Yen** (First Conan movie to cross the historic 10B yen threshold).
   - *Plot*: Climax confrontation between Conan, Haibara Ai, and the Black Organization (Gin, Vodka, Vermouth, Pinga) at the Pacific Buoy facility.

2. 🗡️ **Conan Movie 27: The Million-dollar Pentagram (2024)**:
   - *Box Office*: **15.7 Billion Yen** (All-time franchise record).
   - *Plot*: Hakodate mystery featuring Hijikata Toshizo's historical katana, Kaito Kid, and Hattori Heiji.
   - *Shocking Reveal*: The canonical family connection between Shinichi Kudo and Kaito Kid!

3. 🎃 **Movie 25: The Bride of Halloween** & 💎 **Movie 23: The Fist of Blue Sapphire**:
   - Explosive cases set in Shibuya and Singapore's Marina Bay Sands.`,
    actionLink: {
      labelVi: 'Xem Tuyển Tập Conan 4K',
      labelEn: 'Watch Conan Movies',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '⛩️ Tuyển tập Doraemon', query: 'Phim Doraemon có những phần nào?' },
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
    ],
    quickRepliesEn: [
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
    ],
  },

  // 6. KIỆT TÁC ANIME GHIBLI & MAKOTO SHINKAI (Ghibli & Makoto Shinkai)
  {
    id: 'anime_art_masterpieces',
    intentCategory: 'cinema',
    keywords: [
      'ghibli', 'makoto shinkai', 'spirited away', 'vung dat linh hon', 'howl', 'lau dai bay',
      'totoro', 'hang xom toi la totoro', 'your name', 'kimi no na wa', 'suzume', 'khoa chat cua nao suzume',
      'jujutsu kaisen 0', 'demon slayer', 'mugen train', 'thanh guom diet quy', 'chu thuat hoi chien',
      'one piece film red', 'one piece stampede'
    ],
    responseVi: `🎨 **Kiệt Tác Anime Nghệ Thuật: Studio Ghibli & Phù Thủy Nỗi Buồn Makoto Shinkai:**

1. 🍃 **Vũ Trụ Hoạt Họa Huyền Thoại Studio Ghibli (Hayao Miyazaki):**
   - **Vùng Đất Linh Hồn (Spirited Away - 2001)**: Tác phẩm anime duy nhất trong lịch sử đoạt giải **Oscar cho Phim Hoạt Hình Xuất Sắc Nhất**, điểm IMDb **8.6/10**, câu chuyện trưởng thành của cô bé Chihiro trong thế giới linh hồn.
   - **Lâu Đài Bay Của Pháp Sư Howl (Howl's Moving Castle - 2004)**: Hình ảnh tráng lệ, thông điệp phản chiến và tình yêu vượt qua lời nguyền tuổi già của Sophie.
   - **Hàng Xóm Tôi Là Totoro (My Neighbor Totoro - 1988)**: Biểu tượng văn hóa tuổi thơ Nhật Bản trong trẻo và ấm áp.

2. 🌸 **Hiện Tượng Toàn Cầu Của Makoto Shinkai:**
   - **Your Name (Kimi no Na wa - 2016)**: Doanh thu **$380 triệu USD** toàn cầu, câu chuyện hoán đổi thân xác kỳ diệu giữa Taki và Mitsuha dưới bầu trời sao chổi Tiamat.
   - **Khóa Chặt Cửa Nào Suzume (Suzume no Tojimari - 2022)**: Hành trình phiêu lưu khắp nước Nhật để đóng lại những cánh cửa giải thoát thảm họa động đất.

3. 🔥 **Bom Tấn Anime Shonen Hiện Đại:**
   - **Thanh Gươm Diệt Quỷ: Chuyến Tàu Vô Tận (Demon Slayer: Mugen Train)**: Doanh thu **$507 triệu USD** (Phim hoạt hình Nhật Bản có doanh thu cao nhất lịch sử điện ảnh thế giới).
   - **Chú Thuật Hồi Chiến 0 (Jujutsu Kaisen 0)**: Yuta Okkotsu và lời nguyền tình yêu Rika.
   - **One Piece Film: Red (2022)**: Bữa tiệc âm nhạc của diva Uta, xô đổ kỷ lục doanh thu One Piece.`,
    responseEn: `🎨 **Artistic Anime Masterpieces: Studio Ghibli & Makoto Shinkai:**

1. 🍃 **Studio Ghibli Legends (Hayao Miyazaki):**
   - **Spirited Away (2001)**: The only anime feature to win the **Academy Award for Best Animated Feature** (IMDb 8.6/10).
   - **Howl's Moving Castle (2004)**: Visual splendor, anti-war themes, and enduring love.
   - **My Neighbor Totoro (1988)**: The ultimate universal icon of childhood warmth.

2. 🌸 **Makoto Shinkai Global Phenomena:**
   - **Your Name (2016)**: **$380M worldwide box office**, timeless connection under the Tiamat comet.
   - **Suzume (2022)**: Nationwide quest closing portal doors to stave off catastrophic quakes.

3. 🔥 **Modern Shonen Record Breakers:**
   - **Demon Slayer: Mugen Train**: **$507M worldwide**, highest-grossing anime film in history.
   - **Jujutsu Kaisen 0**: Yuta Okkotsu and the curse of Rika.
   - **One Piece Film: Red**: Global musical spectacle featuring Uta.`,
    actionLink: {
      labelVi: 'Xem Tuyển Tập Anime 4K',
      labelEn: 'Watch Anime Masterpieces',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '🍿 Tư vấn phim theo tâm trạng', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
    ],
    quickRepliesEn: [
      { label: '🍿 Recommend a movie', query: 'Recommend a great movie to watch on CinemaStreamHub' },
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
    ],
  },

  // 7. BOM TẤN HOLLYWOOD, OSCAR & KHOA HỌC VIỄN TƯỞNG (Hollywood & Sci-Fi)
  {
    id: 'hollywood_sci_fi',
    intentCategory: 'cinema',
    keywords: [
      'hollywood', 'christopher nolan', 'denis villeneuve', 'oppenheimer', 'dune', 'dune 2', 'hanh tinh cat',
      'interstellar', 'ho sau vo tan', 'inception', 'ke cap giac mo', 'deadpool', 'deadpool & wolverine',
      'john wick', 'top gun', 'maverick', 'gladiator', 'the batman', 'avengers', 'endgame', 'spider-man',
      'exhuma', 'quat mo trung ma'
    ],
    responseVi: `🌌 **Kỳ Quan Điện Ảnh Hollywood, Đạo Diễn Huyền Thoại & Phim Đoạt Giải Oscar:**

1. ⏳ **Bộ Ba Kiệt Tác Của Christopher Nolan:**
   - **Oppenheimer (2023)**: Thắng **7 tượng vàng Oscar 2024** (bao gồm Phim Hay Nhất & Đạo Diễn Xuất Sắc Nhất), cuộc đời đầy giằng xé của cha đẻ bom nguyên tử J. Robert Oppenheimer.
   - **Interstellar (2014)**: Hành trình xuyên qua hố sâu không gian (wormhole) để tìm kiếm ngôi nhà mới cho nhân loại, điểm nhấn tình cha con lay động và nhạc phim Hans Zimmer.
   - **Inception (2010)**: Nghệ thuật xâm nhập giấc mơ đa tầng, một trong những tác phẩm có kịch bản phức tạp và xuất sắc nhất thế kỷ 21.

2. 🏜️ **Kỳ Quan Viễn Tưởng Dune (Denis Villeneuve):**
   - **Dune: Hành Tinh Cát - Phần 1 & Phần 2 (2024)**: Chuyển thể vĩ đại từ tiểu thuyết của Frank Herbert, đoạt tổng cộng 6 giải Oscar, đưa khán giả đắm chìm vào cuộc chiến sinh tồn trên sa mạc cằn cỗi Arrakis.

3. 💥 **Bom Tấn Giải Trí & Hiện Tượng Toàn Cầu:**
   - **Deadpool & Wolverine (2024)**: Kỷ lục phim dán nhãn R có doanh thu cao nhất mọi thời đại (**$1.34 tỷ USD**).
   - **Sát Thủ John Wick: Phần 4 (2023)**: Đỉnh cao võ thuật gun-fu của Keanu Reeves.
   - **Quật Mộ Trùng Ma (Exhuma - 2024)**: Hiện tượng kinh dị tâm linh Hàn Quốc thu về hơn **212 tỷ VNĐ** tại phòng vé Việt Nam.`,
    responseEn: `🌌 **Hollywood Epics, Visionary Directors & Oscar Winners:**

1. ⏳ **Christopher Nolan's Masterwork Trio:**
   - **Oppenheimer (2023)**: Winner of **7 Academy Awards in 2024** (Best Picture & Best Director).
   - **Interstellar (2014)**: Deep-space wormhole traversal, astrophysically grounded, emotional father-daughter bond.
   - **Inception (2010)**: Multi-layered subconscious dream heist masterpiece.

2. 🏜️ **Denis Villeneuve's Dune Universe:**
   - **Dune: Part One & Part Two (2024)**: Definitive Frank Herbert adaptation, 6 Oscars, epic warfare on Arrakis.

3. 💥 **Global Blockbuster Phenomena:**
   - **Deadpool & Wolverine (2024)**: Highest-grossing R-rated film in cinematic history (**$1.34 Billion**).
   - **John Wick: Chapter 4 (2023)**: Keanu Reeves at the absolute summit of martial arts action.
   - **Exhuma (2024)**: Korean shamanistic horror sensation crossing **212 Billion VND** in Vietnam.`,
    actionLink: {
      labelVi: 'Xem Phim Hollywood 4K',
      labelEn: 'Explore Hollywood 4K',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '🍿 Gợi ý phim theo tâm trạng', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
    ],
    quickRepliesEn: [
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '🍿 Recommend a movie', query: 'Recommend a great movie to watch on CinemaStreamHub' },
    ],
  },

  // 8. HƯỚNG DẪN KỸ THUẬT PHÁT VIDEO & TRẢI NGHIỆM CINEMA
  {
    id: 'cinema_tech_guide',
    intentCategory: 'cinema',
    keywords: [
      'huong dan xem phim', 'huong dan cach xem phim', 'cach xem phim', 'xem phim khong giat',
      'xem phim khong bi giat', 'khong bi giat lag', 'khong giat lag', 'giat lag', 'phim bi lag',
      'load cham', 'video player', 'che do rap chieu', 'full screen', 'toan man hinh',
      'man hinh rong', 'them vao watchlist', 'danh sach xem sau', 'phu de', 'vietsub', 'thuyet minh',
      'phim khong chay', 'buffering', 'nut bam', 'phim tat', 'phim cach', 'phim f', 'phim m',
      'bat dolby atmos', 'am thanh vom'
    ],
    responseVi: `🛠️ **Hướng Dẫn Kỹ Thuật Tối Ưu Hóa Trải Nghiệm Xem Phim Trên CinemaStreamHub:**

Để có trải nghiệm nghe nhìn chuẩn rạp chiếu mượt mà nhất:

1. ⚡ **Cách Khắc Phục Tình Trạng Giật Lag / Đang Tải:**
   - **CDN Tối Ưu**: Mọi hình ảnh và stream đã được phân phối qua cụm CDN Edge \`wsrv.nl\` giúp triệt tiêu hiện tượng bóp băng thông từ các nhà mạng Việt Nam (VNPT, Viettel, FPT).
   - **Điều chỉnh chất lượng**: Trình phát hỗ trợ chế độ **Auto Adaptive Bitrate** tự động cân chỉnh độ phân giải phù hợp tốc độ mạng thực tế của bạn.

2. 🔊 **Kích Hoạt Âm Thanh Vòm Dolby Atmos:**
   - Bật tai nghe Stereo hoặc kết nối dàn loa soundbar/5.1.
   - Chọn chuẩn âm thanh Dolby Atmos trong bảng tùy chỉnh âm lượng của player để tận hưởng không gian âm thanh đa hướng.

3. ⌨️ **Phím Tắt Tiện Lợi (Keyboard Shortcuts):**
   - **Phím Cách (Space)**: Tạm dừng / Tiếp tục phát.
   - **Phím F**: Bật / Tắt chế độ Toàn Màn Hình (Fullscreen Cinema).
   - **Phím M**: Tắt / Mở tiếng (Mute/Unmute).
   - **Phím Mũi tên Trái / Phải**: Tua lùi / Tua tới 10 giây.
   - **Phím Mũi tên Lên / Xuống**: Tăng / Giảm âm lượng 5%.

4. 📌 **Lưu Phim Vào Danh Sách Yêu Thích (Watchlist):**
   - Bấm vào biểu tượng **Bookmark / Trái tim** trên thẻ phim hoặc trang chi tiết để lưu lại vào tab *Danh Sách Xem Sau*.`,
    responseEn: `🛠️ **CinemaStreamHub Playback & Acoustic Optimization Guide:**

1. ⚡ **Zero-Buffering Optimization**:
   - Assets are routed through Cloudflare-powered \`wsrv.nl\` Edge CDN, bypassing local ISP DNS bottlenecks.
   - Player supports **Auto Adaptive Bitrate (HLS)** for seamless frame delivery.

2. 🔊 **Dolby Atmos Audio**:
   - Plug in high-fidelity stereo headphones or a 5.1/7.1 home theatre setup.
   - Toggle spatial audio mode inside the player control bar.

3. ⌨️ **Keyboard Controls**:
   - **Spacebar**: Play / Pause.
   - **Key F**: Toggle Fullscreen.
   - **Key M**: Mute / Unmute.
   - **Arrow Left / Right**: Seek -/+ 10 seconds.
   - **Arrow Up / Down**: Volume -/+ 5%.

4. 📌 **Personal Watchlist**:
   - Click the bookmark icon on any title card to save it into your persistent Watchlist tab.`,
    actionLink: {
      labelVi: 'Vào Trình Phát Cinema',
      labelEn: 'Open Cinema Player',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '🍿 Tư vấn phim hay', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
    ],
    quickRepliesEn: [
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '🍿 Movie recommendations', query: 'Recommend a great movie to watch on CinemaStreamHub' },
    ],
  },

  // 9. MINH BẠCH VỀ NGUỒN PHÁT & PHÁP LÝ BẢN QUYỀN
  {
    id: 'cinema_transparency_rights',
    intentCategory: 'cinema',
    keywords: [
      'ban quyen', 'nguon phim', 'tai sao chi co trailer', 'trailer hay phim full', 'xem phim full o dau',
      'phim ban quyen', 'phim lau', 'tinh minh bach', 'nguon goc', 'phap ly', 'chinh hang'
    ],
    responseVi: `⚖️ **Chính Sách Bản Quyền & Tính Minh Bạch Về Nguồn Dữ Liệu:**

CinemaStreamHub hoạt động theo nguyên tắc **minh bạch, chuẩn mực pháp lý và tôn trọng quyền tác giả**:

1. 📽️ **Phân Loại Nguồn Phát Minh Bạch:**
   - **Phim Chiếu Rạp Mới & Đang Công Chiếu**: Nhúng trực tiếp **Trailer 4K chính thức** từ kênh YouTube được ủy quyền của nhà phát hành (Galaxy Studio, CJ ENM, Sony Pictures, Warner Bros, Toho).
   - **Phim Hoạt Hình & Anime Mở**: Tích hợp các luồng phát HLS chất lượng cao kết hợp thông tin chuyển hướng đến các đối tác bản quyền chính hãng tại Việt Nam (Netflix, Galaxy Play, FPT Play, Apple TV+, POPS Anime, Muse Vietnam).

2. 🛡️ **Cam Kết Trải Nghiệm Sạch 100%:**
   - **Nói Không Với Quảng Cáo Rác**: Tuyệt đối không cài cắm cờ bạc, cá độ bóng đá, pop-up tự nhảy hay mã độc đào tiền ảo.
   - **An Toàn Thiết Bị Tuyệt Đối**: Toàn bộ luồng dữ liệu đều được kiểm định bằng sandbox và chạy trong môi trường bảo mật cao.`,
    responseEn: `⚖️ **Copyright Transparency & Legal Content Delivery:**

CinemaStreamHub operates under **full transparency, strict legal compliance, and copyright integrity**:

1. 📽️ **Transparent Source Classification**:
   - **Current Theatrical Releases**: Embeds verified **Official 4K Trailers** sourced directly from authorized studio YouTube channels (Warner Bros, Sony Pictures, Toho, Galaxy Studio).
   - **Licensed Anime & Classics**: Integrates high-bitrate HLS streams alongside official Vietnamese streaming provider links (Netflix, Galaxy Play, FPT Play, POPS Anime, Muse VN).

2. 🛡️ **Clean & Secure Platform**:
   - **Zero Invasive Ads**: No gambling banners, intrusive pop-unders, or crypto miners.
   - **Guaranteed Device Safety**: Clean, isolated web runtime protected by rigorous Content Security Policies.`,
    actionLink: {
      labelVi: 'Xem Nền Tảng Cinema',
      labelEn: 'Explore Cinema Platform',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '📊 Xem số liệu hệ thống', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
    ],
    quickRepliesEn: [
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '📊 View Benchmarks', query: 'What empirical metrics and data prove system performance?' },
    ],
  },

  // 10. TƯ VẤN QUYỀN LỢI VIP & NÂNG CẤP (VIP Privileges)
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

  // 11. BẢO MẬT & PHÂN QUYỀN POSTGRESQL RBAC (Security & 3-Tier Access Control)
  {
    id: 'security_rbac_auth',
    intentCategory: 'security',
    keywords: [
      'phan quyen', 'user thuong', 'user vip', 'admin', 'super admin', 'postgresql', 'rbac', 'bao mat',
      'ma hoa', 'bcrypt', 'cookie', 'httponly', 'csrf', 'brute force', 'dang nhap admin', 'tai khoan admin',
      'co so du lieu'
    ],
    responseVi: `🛡️ **Kiến Trúc Bảo Mật & Hệ Thống Phân Quyền 3 Cấp Độ (PostgreSQL RBAC):**

Hệ thống được thiết kế theo chuẩn bảo mật doanh nghiệp nhiều lớp:

1. 👥 **Phân Tầng Người Dùng 3 Cấp Độ (3-Tier Roles)**:
   - 👤 **Regular Member (\`user\`)**: Xem phim công khai HD, lưu Watchlist, gửi bình luận và đánh giá.
   - 👑 **VIP Member (\`vip\`)**: Mở khóa 4K Ultra HD, cụm server VIP Fast HLS riêng, âm thanh Dolby Atmos, huy hiệu VIP Gold.
   - 🛡️ **Administrator (\`admin\` / \`super_admin\`)**: Toàn quyền quản trị kho phim, kiểm soát người dùng, cấu hình crawler tự động và xem audit log.

2. 🔒 **Bảo Vệ Dữ Liệu & Xác Thực Phiên**:
   - **Mã hóa Bcrypt Salt 10-12 vòng**: Mật khẩu người dùng không bao giờ lưu dưới dạng văn bản thô.
   - **Phiên HttpOnly Cookie**: Chống tấn công đánh cắp phiên qua mã độc XSS.
   - **Double-Submit CSRF Token**: Bảo vệ mọi thao tác thay đổi dữ liệu (POST, PUT, DELETE).
   - **Chống Brute-Force Rate Limiting**: Tự động khóa IP 15 phút nếu nhập sai quá 5 lần liên tiếp.

3. ⚡ **Cổng Quản Trị Hệ Thống**:
   - Đăng nhập an toàn tại cổng \`/admin\` với cơ chế Dual-Mode High Availability tự động dự phòng.`,
    responseEn: `🛡️ **Enterprise Security & 3-Tier PostgreSQL RBAC Architecture:**

1. 👥 **3-Tier Role Hierarchy**:
   - 👤 **Regular Member (\`user\`)**: Public HD streaming, watchlist, user guestbook comments.
   - 👑 **VIP Member (\`vip\`)**: 4K Ultra HD, dedicated VIP HLS clusters, Dolby Atmos, VIP badge.
   - 🛡️ **Super Administrator (\`admin\`)**: Full content management, user control, ingestion scheduler, audit logging.

2. 🔒 **Defensive Security Controls**:
   - **Bcrypt Password Hashing (10-12 Salt Rounds)**.
   - **HttpOnly & SameSite Session Cookies**: Complete XSS session hijack immunity.
   - **Double-Submit CSRF Protection** across all mutating HTTP methods.
   - **Brute-Force Rate Limiting**: 15-minute automatic lockout after 5 consecutive failed attempts.`,
    actionLink: {
      labelVi: 'Xem Cổng Quản Trị Admin',
      labelEn: 'Admin Portal',
      url: '#admin',
    },
    quickRepliesVi: [
      { label: '📊 Số liệu thực chứng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
      { label: '👑 Quyền lợi tài khoản VIP', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
    ],
    quickRepliesEn: [
      { label: '📊 Verified Metrics', query: 'What empirical metrics and data prove system performance?' },
      { label: '👑 VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
    ],
  },

  // 12. TỰ ĐỘNG HÓA THU THẬP & ĐỒNG BỘ DỮ LIỆU PHIM (Automated Movie Ingestion)
  {
    id: 'movie_ingestion_automation',
    intentCategory: 'cinema',
    keywords: [
      'dong bo phim', 'lay du lieu phim', 'sync phim', 'api phim', 'ingestion', 'crawler',
      'tu dong hoa phim', 'cron job', 'scheduler', 'kkphim', 'tmdb'
    ],
    responseVi: `🔄 **Hệ Thống Tự Động Hóa Thu Thập & Đồng Bộ Dữ Liệu Phim (Automated Ingestion Engine):**

Để kho phim luôn được làm mới liên tục mà không cần can thiệp thủ công:

1. ⏱️ **Tiến Trình Chạy Ngầm (Background MovieSyncScheduler)**:
   - Tự động kích hoạt định kỳ (mặc định mỗi 60 phút) để kéo các bộ phim chiếu rạp mới nhất từ các nguồn API chuẩn rạp.
   - Hệ thống khóa Mutex ngăn chặn tình trạng xung đột tiến trình khi có nhiều yêu cầu đồng thời.

2. 🧹 **Thuật Toán Làm Sạch & Sửa Lỗi Dữ Liệu (Sanitization Engine)**:
   - **Tự động nhận diện hash ảnh lỗi**: Sửa chữa các trường hợp CDN đối tác tải nhầm áp phích (như sửa lỗi nhầm ảnh phim Doraemon sang Hijack 1971).
   - **Khử trùng lặp (Deduplication by slug)**: Tự động hợp nhất dữ liệu, bảo toàn danh sách tập phim và trailer 4K.
   - **Ghi vết Audit Log**: Lưu lại lịch sử đồng bộ minh bạch để quản trị viên dễ dàng theo dõi.`,
    responseEn: `🔄 **Automated Movie Ingestion & Background Sync Engine:**

1. ⏱️ **Background Scheduler (\`MovieSyncScheduler\`)**:
   - Periodic cron-like job pulling new theatrical cinema releases without manual overhead.
   - Mutex lock protection preventing concurrent sync conflicts.

2. 🧹 **Sanitization & Integrity Engine**:
   - **Automatic corrupted hash override**: Auto-corrects mismatched third-party poster hashes.
   - **Slug-based deduplication**: Preserves stream URLs, episode listings, and 4K trailers.
   - **Audit logging**: Full operational traceability in database records.`,
    actionLink: {
      labelVi: 'Xem Nền Tảng Cinema',
      labelEn: 'Explore Cinema Platform',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '📊 Số liệu hiệu năng', query: 'Những số liệu thực chứng chứng minh năng lực của hệ thống là gì?' },
      { label: '🎬 Tư vấn xem phim', query: 'Tư vấn cho tôi phim hay trên CinemaStreamHub' },
    ],
    quickRepliesEn: [
      { label: '📊 Performance Benchmarks', query: 'What empirical metrics and data prove system performance?' },
      { label: '🎬 Movie Recommendations', query: 'Recommend a great movie to watch on CinemaStreamHub' },
    ],
  },

  // 13. TƯ VẤN TUYỂN DỤNG & ĐÁNH GIÁ NĂNG LỰC (Recruitment & Assessment)
  {
    id: 'recruitment_advisory',
    keywords: [
      'danh gia ung vien', 'co phu hop', 'nang luc ky thuat', 'danh gia ki thuat',
      'phong van ky thuat', 'muc luong mong muon', 'danh gia chuyen mon', 'tuyen dung',
      'hire', 'recruitment', 'tim viec'
    ],
    intentCategory: 'recruitment',
    responseVi: `💼 **Tư Vấn Hồ Sơ Ứng Viên & Năng Lực Kỹ Thuật (Mai Anh Kiệt):**

Nếu bạn là Nhà tuyển dụng (HR/Tech Lead/Founder) đang tìm kiếm nhân sự chủ chốt, đây là bảng đánh giá khách quan:

1. 🎯 **Các Vị Trí Phù Hợp Nhất**:
   - **Fullstack Software Engineer** (React 19, TypeScript, Node.js, PostgreSQL).
   - **Frontend 3D Web Engineer** (Three.js, WebGL Shaders, GSAP, TailwindCSS v4).
   - **Backend & Systems Engineer** (High Concurrency, API Gateway, Caching, Circuit Breakers, Docker).
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
   - **Fullstack Software Engineer** (React 19, TypeScript, Node.js, PostgreSQL).
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

  // 14. GIỚI THIỆU MAI ANH KIỆT (Biography & Philosophy)
  {
    id: 'about_kiet',
    intentCategory: 'portfolio',
    keywords: [
      'la ai', 'gioi thieu', 'thong tin', 'profile', 'bio', 'who is', 'about kiet', 'ban la ai',
      'anh kiet', 'ronah', 'ronah mai', 'sinh nam', 'tuoi', 'que quan', 'hoc van', 'background'
    ],
    responseVi: `👨‍💻 **Mai Anh Kiệt (Ronah Mai) — Kỹ Sư Phần Mềm & Chuyên Viên Vận Hành Logistics:**

- **Chuyên môn cốt lõi**: Xây dựng ứng dụng web thời gian thực chịu tải cao (2,000 CCU), đồ họa 3D không gian tương tác (Three.js/WebGL 60 FPS), và tối ưu quy trình chuỗi cung ứng thực tế.
- **Tư duy kỹ thuật khác biệt**: Kiệt không chỉ viết mã, mà giải quyết bài toán với góc nhìn từ **sàn điều phối thực tế** — nơi mỗi giây nghẽn xe tải hay trễ bưu kiện đều phải trả giá bằng chi phí vận hành.
- **Dự án tiêu biểu**: *Kietfolio 3D Cyber Ecosystem, CinemaStreamHub 4K, Cyber Core Terminal, và Hệ thống điều phối trạm SPX Hub 63BDG02*.
- **Địa bàn**: TP. Hồ Chí Minh & Bình Dương (Sẵn sàng cho các dự án On-site hoặc Remote chất lượng cao).`,
    responseEn: `👨‍💻 **Mai Anh Kiet (Ronah Mai) — Software Engineer & Logistics Systems Specialist:**

- **Core Expertise**: High-concurrency web systems (2,000 CCU), immersive 3D web environments (Three.js/WebGL 60 FPS), and industrial logistics optimization.
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

  // 15. KINH NGHIỆM ĐIỀU PHỐI KHO BÃI SPX EXPRESS
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

  // 16. CINEMASTREAMHUB & TÍNH NĂNG KỸ THUẬT NỀN TẢNG
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
- 🎞️ **Kho Phim 81+ Tác Phẩm**: Tuyển tập Doraemon The Movie, Conan, Shin-chan, Anime chiếu rạp và bom tấn điện ảnh Việt Nam trăm tỷ.`,
    responseEn: `🎬 **CinemaStreamHub — 4K Theatrical Streaming Experience:**

High-fidelity cinema platform built with advanced web technologies:
- 🎭 **3D Velvet Curtain Simulation**: Custom Three.js shaders modeling fabric physics and cinema spotlights.
- ⚡ **2,000 CCU Concurrency Tested**: Resilient architecture with multi-tier Redis caching and Circuit Breakers.
- 🌐 **Edge CDN Proxying**: Images routed via \`wsrv.nl\` edge CDN to seamlessly bypass Vietnamese ISP DNS blocks.
- 🎞️ **Rich Catalog of 81+ Masterpieces**: Complete Doraemon, Detective Conan, Shin-chan, and Vietnamese box office masterpieces.`,
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

  // 17. TECH STACK & KIẾN TRÚC PHẦN MỀM
  {
    id: 'skills_tech',
    intentCategory: 'portfolio',
    keywords: [
      'ky nang', 'tech stack', 'cong nghe', 'skill', 'tools', 'ngon ngu', 'lap trinh', 'react',
      'typescript', 'node', 'nodejs', 'threejs', 'three.js', 'postgres', 'postgresql', 'docker', 'redis', 'vitest'
    ],
    responseVi: `🛠️ **Bộ Kỹ Năng & Kiến Trúc Phần Mềm của Mai Anh Kiệt:**

- **Frontend & Không Gian 3D**: React 19, TypeScript, Three.js, WebGL Shaders, TailwindCSS v4, GSAP, Framer Motion, Vite (Rolldown engine).
- **Backend & Hệ Thống Phân Tán**: Node.js, Express, RESTful API, WebSockets, Rate Limiting, Circuit Breakers, Task Queue với Dead-Letter Queue.
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

  // 18. LIÊN HỆ & KÊNH KẾT NỐI (Contact & Collaboration)
  {
    id: 'contact_hire',
    intentCategory: 'recruitment',
    keywords: [
      'lien he', 'contact', 'email', 'gui email', 'sdt', 'dien thoai', 'zalo', 'github', 'linkedin',
      'hop tac', 'tuyen dung', 'hire', 'phong van', 'cv', 'resume', 'gui loi nhan'
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

  // 19. CHÀO HỎI THÂN THIỆN
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
- 🍿 **Muốn tìm phim giải trí?** Hãy nói thể loại bạn thích hoặc tên phim, tôi sẽ gợi ý ngay!
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
2. 🎬 **Tư vấn xem phim**: Gợi ý phim rạp Việt (Mai, Lật Mặt 7), bom tấn hành động (John Wick 4, Deadpool), anime Doraemon/Conan/Ghibli, đặc quyền gói VIP 4K.
3. 📦 **Kinh nghiệm SPX Express**: Điều phối hơn 100,000 bưu kiện/ngày tại trạm Hub 63BDG02.
4. 🛠️ **Tech Stack & Kiến trúc**: React 19, TypeScript, Three.js 3D, Node.js, PostgreSQL 3-tier RBAC, Docker.
5. 💼 **Tuyển dụng & Hợp tác**: Đánh giá độ phù hợp ứng viên và kênh liên hệ trực tiếp với Kiệt.

*Hoặc bạn hãy bấm chọn một trong các gợi ý bên dưới để nhận câu trả lời tức thì nhé!*`

export const FALLBACK_RESPONSE_EN = `🤖 **I didn't quite catch that, but I'm ready to assist you!**

Feel free to ask me about:
1. 📊 **Verifiable Metrics & Proof**: 2,000 CCU load test, P95 < 45ms, 198 test suites pass 100%, 99.9% SPX SLA.
2. 🎬 **Movie Advisory**: Curated theatrical blockbusters (Mai, Lat Mat 7, John Wick 4), anime universes, 4K & Dolby Atmos VIP perks.
3. 📦 **SPX Express Track Record**: 100k+ daily parcels coordinated at Hub 63BDG02.
4. 🛠️ **Tech Stack & Architecture**: React 19, TypeScript, Three.js, Node.js, PostgreSQL 3-tier RBAC, Docker.
5. 💼 **Hiring & Partnership**: Candidate alignment and direct recruitment channels.

*You can also pick one of the quick suggestions below for instant guidance!*`
