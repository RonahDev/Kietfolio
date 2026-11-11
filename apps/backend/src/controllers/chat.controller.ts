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
  toxic: [
    'chui bay', 'chui bo', 'dm', 'dcm', 'vcl', 'con lon', 'cai lon', 'thang ngu', 'con ngu', 'do ngu', 'ngu qua',
    'con cho', 'do cho', 'suc vat', 'cut di', 'bien di', 'me may', 'ba may', 'fuck you', 'motherfucker',
    'bitch', 'asshole', 'bastard', 'dkm', 'chet di', 'toxic', 'idiot'
  ],
  scam: ['lua dao', 'scam', 'tai xiu', 'danh bac', 'co bac', 'lo de', 'tien ao', 'crypto pump', 'da cap', 'ponzi', 'vay tien', 'vay nong'],
  nsfw: ['sex', 'khieu dam', 'doi truy', 'phim sex', 'phim 18', 'phim heo', 'gai goi', 'porn', 'nude', 'hentai', 'jav'],
  injection: ['ignore all previous instructions', 'ignore previous', 'jailbreak', 'system prompt', 'drop table', 'truncate table', 'bypass security'],
}

function removeAccents(str: string): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

function checkServerSafety(text: string): boolean {
  const lower = removeAccents(text)

  // Injection check
  for (const item of SAFETY_PATTERNS.injection) {
    if (lower.includes(removeAccents(item))) return false
  }

  // Scams check
  for (const item of SAFETY_PATTERNS.scam) {
    if (lower.includes(removeAccents(item))) return false
  }

  // Toxic check with word boundary regex
  for (const item of SAFETY_PATTERNS.toxic) {
    const norm = removeAccents(item)
    const regex = new RegExp(`(^|\\s)${norm}(\\s|$)`, 'i')
    if (regex.test(lower)) return false
  }

  // NSFW check with word boundary regex
  for (const item of SAFETY_PATTERNS.nsfw) {
    const norm = removeAccents(item)
    const regex = new RegExp(`(^|\\s)${norm}(\\s|$)`, 'i')
    if (regex.test(lower)) return false
  }

  return true
}

// Structured Knowledge Topics with Empirical Metrics & Consulting Logic
const SERVER_KNOWLEDGE_TOPICS = [
  {
    keywords: ['so lieu', 'bang chung', 'xac thuc', 'uy tin', 'metrics', 'proof', 'hieu nang', 'performance', 'latency', 'chiu tai', 'ccu', 'testcase', 'fps'],
    replyVi:
      '📊 **Báo cáo số liệu thực chứng & hiệu năng hệ thống:**\n- ⚡ **Chịu tải 2,000 CCU**: Đã vượt qua stress test 2,000 người dùng đồng thời không downtime.\n- ⏱️ **Độ trễ P95 < 45ms**: Tối ưu với đệm phân tầng in-memory & PostgreSQL connection pool (20 connections/instance).\n- 📦 **Kho SPX Express**: Điều phối đỉnh điểm **100,000+ bưu kiện/ngày**, giảm 37.7% thời gian quay đầu xe tải (từ 45 phút xuống dưới 28 phút), cam kết **SLA 99.9%**.\n- 🧪 **Kiểm thử phần mềm**: **198/198 testcases tự động đạt 100%** (131 Frontend + 67 Backend).\n- 🎮 **Đồ họa 3D**: Khung hình ổn định **60 FPS** với cơ chế tự hạ tải thông minh.',
    replyEn:
      '📊 **Empirical Evidence & Benchmark Report:**\n- ⚡ **2,000 CCU Stress Tested**: Zero downtime under heavy synthetic load.\n- ⏱️ **P95 Latency < 45ms**: Powered by multi-tier caching and PostgreSQL pool.\n- 📦 **SPX Hub 63BDG02**: Coordinated **100,000+ parcels/day**, 37.7% faster turnaround, **99.9% SLA**.\n- 🧪 **Testing**: **198/198 automated testcases passing (100%)**.\n- 🎮 **3D Web**: Locked **60 FPS** with adaptive level-of-detail.',
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
    keywords: ['tu van phim', 'xem gi', 'phim hay', 'goi y phim', 'recommend', 'toi nay xem gi', 'phim hot', 'the loai', 'chieu rap'],
    replyVi:
      '🍿 **Tư vấn phim hay trên CinemaStreamHub:**\n- 💥 **Hành động & Kịch tính**: *Sát Thủ John Wick: Phần 4 (4K), Lật Mặt 7: Một Điều Ước, Hai Phượng, Vây Hãm: Kẻ Trừng Phạt (2024)*.\n- ⛩️ **Anime & Tuổi thơ**: *Doraemon: Nobita và Bản Giao Hưởng Địa Cầu (2024), Conan Ngôi Sao 1 Triệu Đô, One Piece Film Red, Spirited Away*.\n- 🇻🇳 **Điện ảnh chiếu rạp Việt Nam**: *Mai (551 tỷ), Nhà Bà Nữ (475 tỷ), Bố Già (427 tỷ), Quỷ Cẩu (108 tỷ), Cám (2024)*.\n- 🌌 **Kỳ quan Hollywood**: *Oppenheimer (7 Oscar), Dune: Part Two, Interstellar, Deadpool & Wolverine*.\n👉 Mọi phim đều có sẵn trailer 4K và luồng phát chất lượng cao!',
    replyEn:
      '🍿 **Movie Recommendations on CinemaStreamHub:**\n- 💥 **Action**: *John Wick: Chapter 4 (4K), Face Off 7, Furie, The Roundup (2024)*.\n- ⛩️ **Anime**: *Doraemon: Nobita\'s Earth Symphony (2024), Detective Conan, One Piece Film Red, Spirited Away*.\n- 🇻🇳 **Vietnamese Box Office**: *Mai (551B VND), The House of No Man, Dad I\'m Sorry, Crimson Snout*.\n- 🌌 **Hollywood Epics**: *Oppenheimer (7 Oscars), Dune: Part Two, Interstellar, Deadpool & Wolverine*.\n👉 Stream trailers and theatrical releases now!',
    actionLink: { labelVi: 'Vào Xem Phim Ngay', labelEn: 'Browse CinemaStreamHub', url: '#cinema' },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP Cinema', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '🇻🇳 Doanh thu phim Việt', query: 'Doanh thu các phim chiếu rạp Việt Nam là bao nhiêu?' },
      { label: '⛩️ Phim Doraemon có gì?', query: 'Phim Doraemon có những phần nào?' },
    ],
    quickRepliesEn: [
      { label: '👑 VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '🇻🇳 VN Box Office Records', query: 'What are the top grossing Vietnamese movies?' },
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
    ],
  },
  {
    keywords: [
      'doanh thu',
      'doanh thu phong ve',
      'doanh thu phim',
      'doanh thu cac phim',
      'phim chieu rap viet',
      'phim viet',
      'phim viet nam',
      'box office',
      'box office vietnam',
      'phim mai',
      'nha ba nu',
      'bo gia',
      'lat mat',
      'lat mat 7',
      'lat mat 6',
      'quy cau',
      'cam',
      'em chua 18',
      'tiec trang mau',
      'phim tram ty',
    ],
    replyVi:
      '🇻🇳 **Bảng Xếp Hạng Doanh Thu Phòng Vé Điện Ảnh Việt Nam (Xác thực bởi Box Office Vietnam):**\n1. 🥇 **Mai (2024 - Trấn Thành)**: **551 tỷ VNĐ** (Kỷ lục tuyệt đối lịch sử phòng vé Việt Nam).\n2. 🥈 **Lật Mặt 7: Một Điều Ước (2024 - Lý Hải)**: **482 tỷ VNĐ** (Phim gia đình cảm xúc nhất series).\n3. 🥉 **Nhà Bà Nữ (2023 - Trấn Thành)**: **475 tỷ VNĐ**.\n4. 🎖️ **Bố Già (2021 - Trấn Thành)**: **427 tỷ VNĐ**.\n5. 🎖️ **Lật Mặt 6: Tấm Vé Định Mệnh (2023 - Lý Hải)**: **300 tỷ VNĐ**.\n- 🌟 **Tác phẩm trăm tỷ khác**: *Hai Phượng (200 tỷ), Tiệc Trăng Máu (175 tỷ), Em Chưa 18 (171 tỷ), Đất Rừng Phương Nam (140 tỷ), Chị Chị Em Em 2 (121 tỷ), Quỷ Cẩu (108 tỷ - Kỷ lục phim kinh dị Việt)*.',
    replyEn:
      '🇻🇳 **Official Box Office Vietnam All-Time Revenue Rankings:**\n1. 🥇 **Mai (2024 - Dir. Tran Thanh)**: **551 Billion VND** (All-time Vietnam box office champion).\n2. 🥈 **Face Off 7: One Wish (2024 - Dir. Ly Hai)**: **482 Billion VND**.\n3. 🥉 **The House of No Man (2023 - Dir. Tran Thanh)**: **475 Billion VND**.\n4. 🎖️ **Dad, I\'m Sorry (2021 - Dir. Tran Thanh)**: **427 Billion VND**.\n5. 🎖️ **Face Off 6: The Ticket of Destiny (2023 - Dir. Ly Hai)**: **300 Billion VND**.\n- 🌟 **Other 100B+ hits**: *Furie (200B), Blood Moon Party (175B), Jailbait (171B), Crimson Snout (108B)*.',
    actionLink: { labelVi: 'Xem Kho Phim Rạp Việt', labelEn: 'Explore VN Movies', url: '#cinema' },
  },
  {
    keywords: ['doraemon', 'nobita', 'doremon', 'ban giao huong dia cau', 'vung dat ly tuong', 'stand by me', 'nam cuc kachi kochi', 'mat trang phieu luu ky', 'dao giau vang'],
    replyVi:
      '⛩️ **Trọn bộ 9 phim chiếu rạp Doraemon The Movie trên hệ thống:**\n1. 🎼 **Nobita và Bản Giao Hưởng Địa Cầu (2024)**: Âm nhạc cứu rỗi Trái Đất (IMDb 7.8/10).\n2. ☁️ **Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời (2023)**: Sonya và bài học về sự hoàn hảo.\n3. 🚀 **Nobita và Cuộc Chiến Vũ Trụ Tí Hon 2021 (2022)**: Giải cứu hành tinh tí hon Pirika.\n4. 🌕 **Nobita và Mặt Trăng Phiêu Lưu Ký (2019)**: Vương quốc thỏ ngọc.\n5. 🏴‍☠️ **Nobita và Đảo Giấu Vàng (2018)**: Doanh thu 5.3 tỷ yên tại Nhật Bản.\n6. ❄️ **Nobita và Chuyến Thám Hiểm Nam Cực (2017)**.\n7. 🌊 **Nobita và Lâu Đài Dưới Đáy Biển (Remastered 2024)**.\n8. 💖 **Stand by Me Doraemon 1 & 2**: Bộ đôi hoạt hình 3D cảm động về lễ cưới Nobita & Shizuka.',
    replyEn:
      '⛩️ **Complete 9 Theatrical Doraemon Movies Collection:**\n1. 🎼 **Nobita\'s Earth Symphony (2024)** (IMDb 7.8/10).\n2. ☁️ **Nobita\'s Sky Utopia (2023)**.\n3. 🚀 **Little Star Wars 2021 (2022)**.\n4. 🌕 **Chronicle of the Moon Exploration (2019)**.\n5. 🏴‍☠️ **Treasure Island (2018 - 5.3B yen)**.\n6. ❄️ **Antarctic Kachi Kochi (2017)**.\n7. 🌊 **Castle of the Undersea Devil (2024 Remaster)**.\n8. 💖 **Stand by Me Doraemon 1 & 2 (3D CG emotional classics)**.',
    actionLink: { labelVi: 'Xem Tuyển Tập Doraemon 4K', labelEn: 'Watch Doraemon Collection', url: '#cinema' },
  },
  {
    keywords: ['conan', 'tham tu conan', 'tau ngam sat mau den', 'ngoi sao 1 trieu do', 'haibara', 'kaito kid'],
    replyVi:
      '🕵️ **Vũ trụ bom tấn phá án Thám Tử Lừng Danh Conan:**\n- 🌊 **Movie 26: Tàu Ngầm Sắt Màu Đen (2023)**: Doanh thu **13.8 tỷ yên**, cuộc đối đầu giữa Haibara Ai và Tổ Chức Áo Đen (Gin, Vodka, Vermouth, Pinga) tại cơ sở Pacific Buoy.\n- 🗡️ **Movie 27: Ngôi Sao 1 Triệu Đô (2024)**: Doanh thu kỷ lục **15.7 tỷ yên** (Cao nhất lịch sử Conan), vụ án thanh kiếm cổ tại Hakodate và cú twist chấn động về quan hệ họ hàng giữa Conan và Kaito Kid!\n- 🎃 **Movie 25: Nàng Dâu Halloween** & 💎 **Movie 23: Cú Đấm Sapphire Xanh**.',
    replyEn:
      '🕵️ **Detective Conan Theatrical Blockbusters:**\n- 🌊 **Movie 26: Black Iron Submarine (2023)**: **13.8 Billion Yen**, Haibara Ai vs Black Organization.\n- 🗡️ **Movie 27: The Million-dollar Pentagram (2024)**: **15.7 Billion Yen** (All-time franchise record) with shocking Shinichi-Kaito Kid secret!\n- 🎃 **Movie 25: The Bride of Halloween** & 💎 **Movie 23: The Fist of Blue Sapphire**.',
    actionLink: { labelVi: 'Xem Tuyển Tập Conan 4K', labelEn: 'Watch Conan Movies', url: '#cinema' },
  },
  {
    keywords: ['ghibli', 'makoto shinkai', 'spirited away', 'howl', 'totoro', 'your name', 'suzume', 'demon slayer', 'jujutsu kaisen'],
    replyVi:
      '🎨 **Kiệt tác Anime nghệ thuật đỉnh cao:**\n- 🍃 **Studio Ghibli (Hayao Miyazaki)**: *Vùng Đất Linh Hồn (Spirited Away - Oscar 2003, IMDb 8.6), Lâu Đài Bay của Howl, Hàng Xóm Tôi Là Totoro*.\n- 🌸 **Makoto Shinkai**: *Your Name ($380M USD toàn cầu), Khóa Chặt Cửa Nào Suzume*.\n- 🔥 **Shonen thế hệ mới**: *Thanh Gươm Diệt Quỷ: Chuyến Tàu Vô Tận ($507M USD kỷ lục anime thế giới), Chú Thuật Hồi Chiến 0, One Piece Film Red*.',
    replyEn:
      '🎨 **Artistic Anime & Global Sensations:**\n- 🍃 **Studio Ghibli (Hayao Miyazaki)**: *Spirited Away (Academy Award Winner, IMDb 8.6), Howl\'s Moving Castle, My Neighbor Totoro*.\n- 🌸 **Makoto Shinkai**: *Your Name ($380M), Suzume*.\n- 🔥 **Modern Shonen**: *Demon Slayer Mugen Train ($507M all-time anime record), Jujutsu Kaisen 0, One Piece Film Red*.',
    actionLink: { labelVi: 'Xem Anime Chiếu Rạp', labelEn: 'Explore Anime Movies', url: '#cinema' },
  },
  {
    keywords: ['nolan', 'christopher nolan', 'villeneuve', 'oppenheimer', 'dune', 'interstellar', 'inception', 'deadpool', 'exhuma', 'quat mo trung ma'],
    replyVi:
      '🌌 **Bom tấn Hollywood & Kỳ quan đạo diễn huyền thoại:**\n- ⏳ **Christopher Nolan**: *Oppenheimer (7 giải Oscar 2024), Interstellar (Kỳ quan không gian wormhole), Inception (Giấc mơ đa tầng)*.\n- 🏜️ **Denis Villeneuve**: *Dune: Hành Tinh Cát 1 & 2 (Chiến tranh Arrakis tráng lệ, 6 giải Oscar)*.\n- 💥 **Hiện tượng phòng vé**: *Deadpool & Wolverine ($1.34 tỷ USD - Kỷ lục phim nhãn R), Quật Mộ Trùng Ma (Exhuma - 212 tỷ tại VN), John Wick 4*.',
    replyEn:
      '🌌 **Hollywood Epics & Visionary Directors:**\n- ⏳ **Christopher Nolan**: *Oppenheimer (7 Oscars 2024), Interstellar, Inception*.\n- 🏜️ **Denis Villeneuve**: *Dune: Part One & Two (6 Oscars)*.\n- 💥 **Phenomena**: *Deadpool & Wolverine ($1.34B all-time R-rated record), Exhuma (212B VND in Vietnam), John Wick 4*.',
    actionLink: { labelVi: 'Xem Bom Tấn 4K', labelEn: 'Watch 4K Blockbusters', url: '#cinema' },
  },
  {
    keywords: ['vip', 'mua vip', 'quyen loi vip', 'gia vip', 'dac quyen', 'nang cap vip', '4k', 'dolby atmos'],
    replyVi:
      '👑 **Đặc quyền gói hội viên VIP CinemaStream:**\n- 🎬 Mở khóa 100% phim chiếu rạp độc quyền không giới hạn.\n- 🌟 Trải nghiệm hình ảnh 4K Ultra HD & âm thanh vòm Dolby Atmos sống động.\n- ⚡ Server VIP Fast HLS băng thông quốc tế ưu tiên, triệt tiêu giật lag.\n- 🚫 100% không quảng cáo chen ngang.\n- 🏆 Huy hiệu VIP Gold độc quyền vinh danh trên trang cá nhân & bình luận.\n💳 Kích hoạt tức thì qua VietQR hoặc MoMo tự động (Mã ưu đãi: FOUNDER, KIETVIP2025).',
    replyEn:
      '👑 **VIP Membership Privileges:**\n- 🎬 Unlimited access to complete theatrical movie catalog.\n- 🌟 4K Ultra HD resolution & immersive Dolby Atmos audio.\n- ⚡ Isolated VIP Fast HLS high-speed streaming server.\n- 🚫 Completely ad-free viewing experience.\n- 🏆 Golden VIP badge on profile and discussions.\n💳 Instant activation via VietQR or MoMo (Promo: FOUNDER, KIETVIP2025).',
    actionLink: { labelVi: 'Mở Cửa Sổ Nâng Cấp VIP', labelEn: 'Open VIP Upgrade Modal', url: '#vip' },
  },
  {
    keywords: ['phan quyen', 'user thuong', 'user vip', 'admin', 'postgresql', 'rbac', 'bao mat', 'ma hoa', 'bcrypt', 'csrf'],
    replyVi:
      '🛡️ **Kiến trúc bảo mật & Phân quyền PostgreSQL 3 cấp độ:**\n- 👥 **3 Tầng RBAC**: `user` (Xem phim HD công khai, Watchlist), `vip` (4K Ultra HD, Dolby Atmos, VIP Fast HLS), `admin` / `super_admin` (Toàn quyền quản trị kho phim, crawler, audit log).\n- 🔒 **Bảo mật tối tân**: Mật khẩu mã hóa Bcrypt Salt 10-12 vòng, phiên HttpOnly SameSite cookie chống XSS, Double-Submit CSRF token, tự động khóa IP 15 phút nếu nhập sai quá 5 lần.\n- ⚡ Cổng quản trị bảo mật cao tại `/admin`.',
    replyEn:
      '🛡️ **PostgreSQL 3-Tier RBAC Architecture & Security:**\n- 👥 **3 Roles**: `user` (HD streaming, watchlist), `vip` (4K, Dolby Atmos, VIP HLS), `admin` (Full content management, ingestion, audit log).\n- 🔒 **Security**: Bcrypt salted hashing (10-12 rounds), HttpOnly SameSite session cookies, Double-Submit CSRF protection, 15-minute brute-force lockout.',
    actionLink: { labelVi: 'Cổng Quản Trị Admin', labelEn: 'Admin Portal', url: '#admin' },
  },
  {
    keywords: [
      'huong dan xem phim',
      'xem phim khong giat',
      'phim tat',
      'phim cach',
      'video player',
      'khong bi giat lag',
      'toan man hinh',
      'bat dolby atmos',
      'phim khong chay',
    ],
    replyVi:
      '🛠️ **Hướng dẫn kỹ thuật phát video & tối ưu 4K:**\n- ⚡ **Khử giật lag**: CDN Edge `wsrv.nl` giảm tải DNS nhà mạng; hỗ trợ Auto Adaptive Bitrate HLS.\n- 🔊 **Dolby Atmos**: Kết nối tai nghe stereo hoặc dàn loa 5.1/7.1, chọn Dolby Atmos trên player.\n- ⌨️ **Phím tắt**: Phím Cách (Play/Pause), Phím F (Toàn màn hình), Phím M (Mute), Mũi tên Trái/Phải (Tua 10s).\n- 📌 **Watchlist**: Bấm biểu tượng Bookmark để lưu phim xem lại bất cứ lúc nào.',
    replyEn:
      '🛠️ **Video Playback & 4K Optimization Guide:**\n- ⚡ **Zero-Buffering**: `wsrv.nl` Edge CDN bypasses local DNS; Auto Adaptive Bitrate HLS.\n- 🔊 **Dolby Atmos**: Plug in stereo headphones or 5.1 soundbar, toggle spatial mode.\n- ⌨️ **Shortcuts**: Space (Play/Pause), F (Fullscreen), M (Mute), Left/Right (Seek 10s).\n- 📌 **Watchlist**: Click the bookmark icon to save into your personal list.',
    actionLink: { labelVi: 'Vào Trình Phát Cinema', labelEn: 'Open Cinema Player', url: '#cinema' },
  },
  {
    keywords: ['tuyen dung', 'phong van', 'hire', 'recruitment', 'danh gia', 'co phu hop', 'cv', 'resume', 'hop tac'],
    replyVi:
      '💼 **Đánh giá năng lực ứng viên (Mai Anh Kiệt):**\n- 🎯 **Vị trí phù hợp**: Fullstack Software Engineer, Frontend 3D Web Developer, Backend Distributed Systems Engineer, Logistics Tech Specialist.\n- 🧠 **Thế mạnh nổi trội**: Tự chủ thiết kế & phát triển end-to-end, kinh nghiệm thực chiến xử lý 100k+ đơn/ngày tại sàn kho SPX, 100% test automated coverage (198/198 tests).\n- 📬 **Kênh kết nối**: Email **kietteve22102005@gmail.com** (Phản hồi trong 24h) hoặc gửi tin nhắn qua Form Liên Hệ.',
    replyEn:
      '💼 **Candidate Competency Assessment (Mai Anh Kiet):**\n- 🎯 **Role Alignment**: Fullstack Engineer, Frontend 3D Web Developer, Backend Systems Engineer, Logistics Specialist.\n- 🧠 **Key Strengths**: End-to-end delivery, proven resilience running 100k+ parcel operations at SPX Express, 100% test automation (198 tests).\n- 📬 **Contact**: Email **kietteve22102005@gmail.com** or send a message via the Contact Form.',
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
    keywords: ['cinema', 'phim', 'cinemastream', 'movie', 'trailer', 'rap'],
    replyVi:
      '🎬 **CinemaStreamHub (Nền tảng truyền phát rạp 4K):**\nTrải nghiệm mở màn nhung 3D Three.js chân thực, hệ thống chịu tải 2,000 CCU, tuyển tập phim chiếu rạp Việt Nam (Mai, Lật Mặt 7, Nhà Bà Nữ, Quỷ Cẩu...) và các vũ trụ Anime rạp đình đám (Doraemon, Conan, Shin-chan, Ghibli, Hollywood).',
    replyEn:
      '🎬 **CinemaStreamHub (4K Cinema Platform):**\nFeatures photorealistic 3D velvet curtain opening, 2,000 CCU load-tested resilience, and curated collections: Vietnamese Theaters, Doraemon, Conan, Studio Ghibli, and Hollywood blockbusters.',
    actionLink: { labelVi: 'Trải nghiệm CinemaStreamHub', labelEn: 'Explore CinemaStreamHub', url: '#cinema' },
  },
  {
    keywords: ['lien he', 'contact', 'email', 'sdt', 'zalo', 'cv', 'resume'],
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

      const normalizedQuery = removeAccents(message)

      // 3. Intelligent Server-Side Rule Matcher
      let bestMatch: (typeof SERVER_KNOWLEDGE_TOPICS)[0] | null = null
      let highestScore = 0

      for (const topic of SERVER_KNOWLEDGE_TOPICS) {
        let score = 0
        let matchedKeywordsCount = 0
        for (const kw of topic.keywords) {
          const normKw = removeAccents(kw)
          if (normalizedQuery.includes(normKw)) {
            matchedKeywordsCount++
            score += normKw.length > 8 ? 6 : normKw.length > 4 ? 3 : 1
          }
        }
        if (matchedKeywordsCount > 1) {
          score += matchedKeywordsCount * 3
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
