import bcrypt from 'bcryptjs'
import { prisma } from '../config/prisma'
import { pool } from './pool'

export async function seedCompleteDatabase(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('🚀 [Master Seed]: Starting Complete Kietfolio & Cinema Database Seeding...')

  try {
    // -------------------------------------------------------------------------
    // 1. ROLES & RBAC PERMISSIONS
    // -------------------------------------------------------------------------
    const rolesData = [
      {
        id: 'super_admin',
        name: 'Super Administrator',
        description: 'Toàn quyền tối cao hệ sinh thái, cấu hình hệ thống, phân quyền RBAC',
      },
      {
        id: 'admin',
        name: 'System Administrator',
        description: 'Quản trị viên, quản lý nội dung phim, người dùng, xem báo cáo thống kê',
      },
      {
        id: 'vip',
        name: 'VIP Member',
        description: 'Người dùng VIP, đặc quyền phim 4K Ultra HD, Dolby Atmos, VIP HLS Server, VIP Badge',
      },
      {
        id: 'user',
        name: 'Regular Member',
        description: 'Người dùng thông thường, xem phim công khai HD, bình luận, lưu watchlist',
      },
    ]

    for (const r of rolesData) {
      await pool.query(
        `INSERT INTO roles (id, name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, description = EXCLUDED.description`,
        [r.id, r.name, r.description]
      ).catch(() => {})
    }

    // -------------------------------------------------------------------------
    // 2. USERS (3-TIER: Super Admin, Admin, VIP, Regular Member)
    // -------------------------------------------------------------------------
    const adminHash = await bcrypt.hash('SecretAdminKey@2005', 10)
    const vipHash = await bcrypt.hash('VipSecret@2026', 10)
    const userHash = await bcrypt.hash('UserSecret@2026', 10)

    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    const usersData = [
      {
        id: 'usr-admin-master',
        email: 'admin@kietfolio.dev',
        displayName: 'Mai Anh Kiệt (Master Admin)',
        passwordHash: adminHash,
        role: 'super_admin',
        status: 'active',
        vipExpiresAt: null,
      },
      {
        id: 'usr-admin-kiet-personal',
        email: 'kietteve22102005@gmail.com',
        displayName: 'Mai Anh Kiệt (Personal)',
        passwordHash: adminHash,
        role: 'super_admin',
        status: 'active',
        vipExpiresAt: null,
      },
      {
        id: 'usr-admin-kiet',
        email: 'kiet.maianh@gmail.com',
        displayName: 'Mai Anh Kiệt (Work)',
        passwordHash: adminHash,
        role: 'super_admin',
        status: 'active',
        vipExpiresAt: null,
      },
      {
        id: 'usr-vip-demo',
        email: 'vip@kietfolio.dev',
        displayName: 'VIP Member Explorer',
        passwordHash: vipHash,
        role: 'vip',
        status: 'active',
        vipExpiresAt: oneYearFromNow,
      },
      {
        id: 'usr-regular-demo',
        email: 'user@kietfolio.dev',
        displayName: 'Regular Member Explorer',
        passwordHash: userHash,
        role: 'user',
        status: 'active',
        vipExpiresAt: null,
      },
    ]

    for (const u of usersData) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          role: u.role,
          passwordHash: u.passwordHash,
          displayName: u.displayName,
          status: u.status,
          vipExpiresAt: u.vipExpiresAt,
        },
        create: {
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          displayName: u.displayName,
          role: u.role,
          status: u.status,
          vipExpiresAt: u.vipExpiresAt,
        },
      })
    }
    // eslint-disable-next-line no-console
    console.log('✅ [Master Seed]: 5 Core Users & RBAC roles seeded.')

    // -------------------------------------------------------------------------
    // 3. PORTFOLIO SHOWCASE PROJECTS
    // -------------------------------------------------------------------------
    const projectsData = [
      {
        id: 'kietfolio-core',
        title: 'Kietfolio Architecture',
        subtitle: {
          en: 'High-Performance 3D Full-Stack Cyber Portfolio',
          vi: 'Portfolio Công Nghệ Cao 3D Full-Stack',
        },
        category: 'creative',
        statusBadge: {
          en: 'Production Live',
          vi: 'Trực Tuyến Sẵn Sàng',
        },
        isFeatured: true,
        problemStatement: {
          en: 'Standard web portfolios lack technical depth and fail to communicate both real-time graphics and operational logistics capability.',
          vi: 'Các trang portfolio thông thường thiếu cá tính kỹ thuật và không thể hiện được năng lực đồ họa 3D cùng tư duy vận hành chuỗi cung ứng.',
        },
        solutionArchitecture: {
          en: 'Custom Three.js procedural shaders, GSAP motion choreography, and React 19 architecture with strict TypeScript contracts.',
          vi: 'Tùy biến shader Three.js theo thời gian thực, điều phối chuyển động GSAP và kiến trúc React 19 trên nền TypeScript chặt chẽ.',
        },
        keyEngineeringDecisions: {
          en: [
            'Domain-Driven Modular Folders with 0 barrel bundling penalties',
            'Capped WebGL pixel ratio at 1.5 to eliminate GPU throttling',
            'Offline fallback simulation for resilient auth and guestbook interactions',
          ],
          vi: [
            'Phân tách thư mục theo Domain-Driven Design không gây nghẽn bundle',
            'Giới hạn pixel ratio WebGL ở 1.5 để tối ưu hóa triệt để GPU',
            'Cơ chế fallback offline đảm bảo xác thực và lưu bút luôn mượt mà',
          ],
        },
        techStack: ['React 19', 'Three.js', 'GSAP', 'TypeScript', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'Express'],
        githubUrl: 'https://github.com/RonahDev/Kietfolio',
        liveUrl: 'https://ronahdev.github.io/Kietfolio/',
      },
      {
        id: 'spx-logistics-coordinator',
        title: 'SPX Real-Time Logistics Coordinator',
        subtitle: {
          en: 'High-Throughput Ground Operations & Dispatch Control Hub',
          vi: 'Trung Tâm Điều Phối Vận Tải Mặt Đất Tải Trọng Cao',
        },
        category: 'logistics',
        statusBadge: {
          en: 'Field Operational',
          vi: 'Thực Chiến Trạm Hub',
        },
        isFeatured: true,
        problemStatement: {
          en: 'Managing 100,000+ packages nightly during Mega Sales causes severe bottlenecking and driver desynchronization without real-time telemetry.',
          vi: 'Điều phối hơn 100.000 kiện hàng mỗi đêm trong kỳ Mega Sale dễ gây tắc nghẽn dây chuyền và lệch pha điều xe nếu thiếu viễn trắc thời gian thực.',
        },
        solutionArchitecture: {
          en: 'Inbound dynamic buffer routing, predictive queue management, and automated fallback dispatching implemented in 2 years of on-site operations.',
          vi: 'Hệ thống đệm phân luồng nhập hàng động, quản lý hàng đợi dự báo và quy trình điều vận dự phòng kiểm chứng qua 2 năm chỉ huy trực tiếp tại trạm.',
        },
        keyEngineeringDecisions: {
          en: [
            'Dynamic FIFO conveyor buffer allocation during peak inbounds',
            'Sub-second driver route re-assignment protocols',
            'Zero package loss SLA under 99.98% operational uptime',
          ],
          vi: [
            'Phân bổ bộ đệm băng chuyền FIFO động trong khung giờ cao điểm',
            'Giao thức tái điều hướng tuyến tài xế tức thì dưới 1 giây',
            'Đảm bảo SLA không thất thoát kiện hàng với độ sẵn sàng 99.98%',
          ],
        },
        techStack: ['PostgreSQL', 'Express', 'Redis', 'Docker', 'Node.js', 'TypeScript', 'High-Concurrency'],
        githubUrl: 'https://github.com/RonahDev/Kietfolio',
        liveUrl: 'https://ronahdev.github.io/Kietfolio/',
      },
    ]

    for (const p of projectsData) {
      await prisma.project.upsert({
        where: { id: p.id },
        update: {
          title: p.title,
          subtitle: p.subtitle,
          category: p.category,
          statusBadge: p.statusBadge,
          isFeatured: p.isFeatured,
          problemStatement: p.problemStatement,
          solutionArchitecture: p.solutionArchitecture,
          keyEngineeringDecisions: p.keyEngineeringDecisions,
          techStack: p.techStack,
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl,
        },
        create: {
          id: p.id,
          title: p.title,
          subtitle: p.subtitle,
          category: p.category,
          statusBadge: p.statusBadge,
          isFeatured: p.isFeatured,
          problemStatement: p.problemStatement,
          solutionArchitecture: p.solutionArchitecture,
          keyEngineeringDecisions: p.keyEngineeringDecisions,
          techStack: p.techStack,
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl,
        },
      })
    }
    // eslint-disable-next-line no-console
    console.log('✅ [Master Seed]: Portfolio Projects seeded.')

    // -------------------------------------------------------------------------
    // 4. PORTFOLIO GUESTBOOK ENTRIES
    // -------------------------------------------------------------------------
    const guestbookData = [
      {
        id: 'gb-seed-1',
        userUid: 'usr-admin-kiet',
        name: 'Mai Anh Kiệt',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        roleTitle: 'Creator & Software Engineer',
        message: 'Chào mừng bạn đến với Kietfolio! Hãy để lại lời nhắn, cùng trao đổi kinh nghiệm hoặc kết nối hợp tác nhé.',
        isGoogleVerified: true,
        isPinned: true,
        isApproved: true,
      },
      {
        id: 'gb-seed-2',
        userUid: null,
        name: 'SPX Operations Team',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        roleTitle: 'Logistics Operations Lead',
        message: 'Tinh thần điều phối áp lực cao và kết nối thực tế vận hành vào tư duy kỹ thuật rất ấn tượng!',
        isGoogleVerified: true,
        isPinned: false,
        isApproved: true,
      },
    ]

    for (const gb of guestbookData) {
      await prisma.guestbookEntry.upsert({
        where: { id: gb.id },
        update: {
          name: gb.name,
          avatar: gb.avatar,
          roleTitle: gb.roleTitle,
          message: gb.message,
          isGoogleVerified: gb.isGoogleVerified,
          isPinned: gb.isPinned,
          isApproved: gb.isApproved,
        },
        create: {
          id: gb.id,
          userUid: gb.userUid,
          name: gb.name,
          avatar: gb.avatar,
          roleTitle: gb.roleTitle,
          message: gb.message,
          isGoogleVerified: gb.isGoogleVerified,
          isPinned: gb.isPinned,
          isApproved: gb.isApproved,
        },
      })
    }
    // eslint-disable-next-line no-console
    console.log('✅ [Master Seed]: Guestbook entries seeded.')

    // -------------------------------------------------------------------------
    // 5. CINEMA GENRES (Content Genres + Theatrical + Franchises)
    // -------------------------------------------------------------------------
    const genresList = [
      { id: 'action', nameVi: 'Hành Động & Kịch Tính', nameEn: 'Action & Thriller', slug: 'action' },
      { id: 'romance', nameVi: 'Tình Cảm & Lãng Mạn', nameEn: 'Romance', slug: 'romance' },
      { id: 'drama', nameVi: 'Tâm Lý & Chính Kịch', nameEn: 'Drama', slug: 'drama' },
      { id: 'comedy', nameVi: 'Hài Hước & Vui Nhộn', nameEn: 'Comedy', slug: 'comedy' },
      { id: 'horror', nameVi: 'Kinh Dị & Rùng Rợn', nameEn: 'Horror', slug: 'horror' },
      { id: 'animation', nameVi: 'Hoạt Hình & Anime', nameEn: 'Animation', slug: 'animation' },
      { id: 'adventure', nameVi: 'Phiêu Lưu & Kỳ Ảo', nameEn: 'Adventure', slug: 'adventure' },
      { id: 'family', nameVi: 'Gia Đình & Tuổi Trẻ', nameEn: 'Family', slug: 'family' },
      { id: 'mystery', nameVi: 'Trinh Thám & Bí Ẩn', nameEn: 'Mystery', slug: 'mystery' },
      { id: 'sci-fi', nameVi: 'Khoa Học Viễn Tưởng', nameEn: 'Sci-Fi', slug: 'sci-fi' },
      { id: 'history', nameVi: 'Lịch Sử & Cổ Trang', nameEn: 'History', slug: 'history' },
      { id: 'cyberpunk', nameVi: 'Công Nghệ & AI Cyberpunk', nameEn: 'Cyberpunk & Tech', slug: 'cyberpunk' },
      { id: 'logistics', nameVi: 'Kỹ Thuật Hệ Thống & Logistics', nameEn: 'Logistics Doc', slug: 'logistics' },
      { id: 'theatrical_vn', nameVi: 'Phim Chiếu Rạp Việt Nam', nameEn: 'VN Theaters', slug: 'theatrical-vn' },
      { id: 'anime_theatrical', nameVi: 'Anime Chiếu Rạp Bản Quyền', nameEn: 'Theatrical Anime', slug: 'anime-theatrical' },
      { id: 'doraemon', nameVi: 'Doraemon Movie', nameEn: 'Doraemon', slug: 'doraemon' },
      { id: 'conan', nameVi: 'Thám Tử Conan', nameEn: 'Detective Conan', slug: 'conan' },
      { id: 'shin', nameVi: 'Cậu Bé Bút Chì Shin', nameEn: 'Shin-chan', slug: 'shin' },
      { id: 'dragonball', nameVi: 'Dragon Ball Movie', nameEn: 'Dragon Ball', slug: 'dragonball' },
      { id: 'naruto', nameVi: 'Naruto & Boruto', nameEn: 'Naruto', slug: 'naruto' },
      { id: 'onepiece', nameVi: 'One Piece: Vua Hải Tặc', nameEn: 'One Piece', slug: 'onepiece' },
    ]

    for (const g of genresList) {
      await prisma.genre.upsert({
        where: { id: g.id },
        update: { nameVi: g.nameVi, nameEn: g.nameEn, slug: g.slug },
        create: { id: g.id, nameVi: g.nameVi, nameEn: g.nameEn, slug: g.slug },
      })
    }
    // eslint-disable-next-line no-console
    console.log(`✅ [Master Seed]: ${genresList.length} Cinema Genres seeded.`)

    // -------------------------------------------------------------------------
    // 6. CINEMA CATEGORIES
    // -------------------------------------------------------------------------
    const categoriesList = [
      { id: 'trending', nameVi: 'Phim Thịnh Hành', nameEn: 'Trending Now', slug: 'trending', displayOrder: 1 },
      { id: 'theatrical_vn', nameVi: 'Phim Chiếu Rạp Việt Nam', nameEn: 'VN Theatrical', slug: 'theatrical-vn', displayOrder: 2 },
      { id: 'anime_theatrical', nameVi: 'Anime Chiếu Rạp Bản Quyền', nameEn: 'Theatrical Anime', slug: 'anime-theatrical', displayOrder: 3 },
      { id: 'tech_and_docs', nameVi: 'Công Nghệ & Tài Liệu Kỹ Thuật', nameEn: 'Tech & Docs', slug: 'tech-docs', displayOrder: 4 },
    ]

    for (const cat of categoriesList) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: { nameVi: cat.nameVi, nameEn: cat.nameEn, slug: cat.slug, displayOrder: cat.displayOrder },
        create: { id: cat.id, nameVi: cat.nameVi, nameEn: cat.nameEn, slug: cat.slug, displayOrder: cat.displayOrder },
      })
    }
    // eslint-disable-next-line no-console
    console.log(`✅ [Master Seed]: ${categoriesList.length} Cinema Categories seeded.`)

    // -------------------------------------------------------------------------
    // 7. CINEMA SHOWCASE MOVIES (4K Ultra HD, Dolby Atmos, Vietnamese, Anime, Tech)
    // -------------------------------------------------------------------------
    const moviesSeedData = [
      {
        id: 'cybernetic-odyssey',
        titleVi: 'The Cybernetic Odyssey: Ghost in the Network',
        titleOrigin: 'The Cybernetic Odyssey',
        slug: 'the-cybernetic-odyssey-ghost-in-the-network',
        type: 'movie',
        tagline: 'When neural networks awaken, consciousness becomes the battlefield.',
        synopsis: 'Trong tương lai gần khi các hệ thống phân tán AI chiếm lĩnh toàn bộ cơ sở hạ tầng toàn cầu, một kỹ sư kiến trúc hệ thống ngầm phát hiện ra một thực thể số tự sinh khởi chạy từ một node bị cô lập. Một cuộc rượt đuổi nghẹt thở xuyên qua mạng lưới điện toán đám mây và thực tại mở rộng bắt đầu.',
        backdropUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg&output=webp',
        posterUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg&output=webp',
        trailerUrl: 'https://www.youtube.com/watch?v=bK6ldnjv520',
        youtubeKey: 'bK6ldnjv520',
        videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        streamSource: 'hls',
        releaseYear: 2026,
        duration: '2h 24m',
        rating: 9.3,
        matchPercentage: 98,
        ageRating: 'PG-13',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        director: 'Ronah Mai & Elena Vance',
        castData: [
          { name: 'Kaelen Cross', role: 'Chief Systems Architect' },
          { name: 'Nyx Tanaka', role: 'Neural Net Specialist' },
          { name: 'Viktor Reyes', role: 'Security Ops Director' },
        ],
        isTheatrical: false,
        isVietnamese: false,
        isAnimeTheatrical: false,
        franchise: null,
        officialDistributor: 'Kietfolio Studios',
        watchProviders: [{ providerName: 'Cinema Hub', quality: '4K VIP' }],
        similarMovieIds: ['interstellar-logistics', 'blade-runner-neon', 'matrix-resurgence'],
        isFeatured: true,
        genres: ['cyberpunk', 'sci-fi', 'action'],
        categories: ['trending', 'tech_and_docs'],
      },
      {
        id: 'interstellar-logistics',
        titleVi: 'Interstellar Logistics: Beyond Hub 63BDG02',
        titleOrigin: 'Interstellar Logistics',
        slug: 'interstellar-logistics-beyond-hub-63bdg02',
        type: 'movie',
        tagline: 'Delivering survival across 4.2 light years with 99.999% SLA.',
        synopsis: 'Lấy cảm hứng từ 2 năm thực chiến điều phối điều vận kho bãi tại Trạm Hub Thủ Dầu Một, bộ phim tài liệu điện ảnh tái hiện lại chiến dịch hậu cần vũ trụ vĩ đại nhất nhân loại: thiết lập chuỗi cung ứng không độ trễ giữa Trái Đất và Trạm vũ trụ Kepler-452b.',
        backdropUrl: 'https://wsrv.nl/?url=phimimg.com/upload/vod/20250302-1/6012710a981edf1b6209bdb7fa82d1a6.jpg&output=webp',
        posterUrl: 'https://wsrv.nl/?url=phimimg.com/upload/vod/20250302-1/4cee31c3afd0fbfd11ed4f14b1bfd816.jpg&output=webp',
        trailerUrl: 'https://www.youtube.com/watch?v=2LqzF5WauAw',
        youtubeKey: '2LqzF5WauAw',
        videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        streamSource: 'hls',
        releaseYear: 2025,
        duration: '1h 58m',
        rating: 9.5,
        matchPercentage: 99,
        ageRating: 'G',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        director: 'Mai Anh Kiệt',
        castData: [
          { name: 'Marcus Sterling', role: 'Fleet Dispatcher Lead' },
          { name: 'Dr. Aris Thorne', role: 'Orbital Route Optimizer' },
          { name: 'Captain Linh Tran', role: 'Freighter Commander' },
        ],
        isTheatrical: false,
        isVietnamese: false,
        isAnimeTheatrical: false,
        franchise: null,
        officialDistributor: 'SPX Ground Media',
        watchProviders: [{ providerName: 'Cinema Hub', quality: '4K VIP' }],
        similarMovieIds: ['cybernetic-odyssey', 'oppenheimer-quantum', 'autonomous-transit'],
        isFeatured: true,
        genres: ['logistics', 'sci-fi', 'drama'],
        categories: ['trending', 'tech_and_docs'],
      },
      {
        id: 'vn-mai-2024',
        titleVi: 'Mai',
        titleOrigin: 'Mai (2024)',
        slug: 'vn-mai-2024',
        type: 'movie',
        tagline: 'Quá khứ chưa ngủ yên, tình yêu liệu có đủ lớn để vượt qua định kiến?',
        synopsis: 'Mai - một phụ nữ gần 40 tuổi làm nghề massage trị liệu, luôn gánh trên vai nỗi mặc cảm quá khứ và sự soi mói của khu chung cư cũ. Cuộc đời cô bỗng chốc đảo lộn khi gặp Dương, chàng nhạc công phong lưu kém cô nhiều tuổi. Tác phẩm xô đổ kỷ lục phòng vé lịch sử Việt Nam với hơn 520 tỷ đồng doanh thu.',
        backdropUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/uFsn8qBEzbeJCqH0LsViwPom5ww.jpg&output=webp',
        posterUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/uFsn8qBEzbeJCqH0LsViwPom5ww.jpg&output=webp',
        trailerUrl: 'https://www.youtube.com/watch?v=0YsPhl3d4Cg',
        youtubeKey: '0YsPhl3d4Cg',
        videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        streamSource: 'hls',
        releaseYear: 2024,
        duration: '2h 11m',
        rating: 8.8,
        matchPercentage: 99,
        ageRating: 'R',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        director: 'Trấn Thành',
        castData: [
          { name: 'Phương Anh Đào', role: 'Mai' },
          { name: 'Tuấn Trần', role: 'Dương (Sâu)' },
          { name: 'Hồng Đào', role: 'Bà Đào' },
          { name: 'Trấn Thành', role: 'Ông Hoàng' },
        ],
        isTheatrical: true,
        isVietnamese: true,
        isAnimeTheatrical: false,
        franchise: null,
        officialDistributor: 'Galaxy Studio & CJ HK Entertainment',
        watchProviders: [
          { providerName: 'Netflix', quality: '4K Ultra HD' },
          { providerName: 'Galaxy Play', quality: 'Full HD' },
        ],
        similarMovieIds: ['lat-mat-7-mot-dieu-uoc', 'nha-ba-nu'],
        isFeatured: true,
        genres: ['drama', 'romance', 'theatrical_vn'],
        categories: ['trending', 'theatrical_vn'],
      },
      {
        id: 'anime-doraemon-ban-giao-huong-2024',
        titleVi: 'Doraemon: Nobita và Bản Giao Hưởng Địa Cầu',
        titleOrigin: 'Doraemon the Movie: Nobita\'s Earth Symphony',
        slug: 'doraemon-nobitas-earth-symphony-2024',
        type: 'movie',
        tagline: 'Khi âm nhạc biến mất khỏi thế giới, chỉ có tình bạn mới cứu được vũ trụ!',
        synopsis: 'Kỷ niệm 90 năm ngày sinh tác giả Fujiko F. Fujio, nhóm bạn Doraemon tình cờ gặp Micca - cô bé bí ẩn đến từ hành tinh Hall Mùa. Tại Cung điện Farre tráng lệ, nơi vận hành bằng năng lượng âm nhạc, họ cùng nhau hòa tấu những giai điệu diệu kỳ để ngăn chặn loài sinh vật quái dị muốn nuốt chửng âm nhạc toàn địa cầu.',
        backdropUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/1v0p3c0Zz9P360jXF8c1F0t2Xz6.jpg&output=webp',
        posterUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/1v0p3c0Zz9P360jXF8c1F0t2Xz6.jpg&output=webp',
        trailerUrl: 'https://www.youtube.com/watch?v=0h9VqjF8a7c',
        youtubeKey: '0h9VqjF8a7c',
        videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        streamSource: 'hls',
        releaseYear: 2024,
        duration: '1h 55m',
        rating: 9.1,
        matchPercentage: 97,
        ageRating: 'G',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        director: 'Kazuaki Imai',
        castData: [
          { name: 'Wasabi Mizuta', role: 'Doraemon (Voice)' },
          { name: 'Megumi Oohara', role: 'Nobita (Voice)' },
        ],
        isTheatrical: true,
        isVietnamese: false,
        isAnimeTheatrical: true,
        franchise: 'doraemon',
        officialDistributor: 'Toho & CJ CGV Vietnam',
        watchProviders: [
          { providerName: 'POPS Anime', quality: '1080P' },
          { providerName: 'Galaxy Play', quality: '1080P' },
        ],
        similarMovieIds: ['anime-doraemon-vung-dat-ly-tuong-2023', 'anime-conan-tau-ngam-sat-mau-den'],
        isFeatured: true,
        genres: ['animation', 'family', 'adventure', 'doraemon', 'anime_theatrical'],
        categories: ['trending', 'anime_theatrical'],
      },
      {
        id: 'anime-conan-tau-ngam-sat-mau-den',
        titleVi: 'Thám Tử Lừng Danh Conan: Tàu Ngầm Sắt Màu Đen',
        titleOrigin: 'Detective Conan: Black Iron Submarine',
        slug: 'detective-conan-black-iron-submarine',
        type: 'movie',
        tagline: 'Đừng chết, Haibara! Cuộc đối đầu sinh tử dưới đáy biển sâu với Tổ Chức Áo Đen.',
        synopsis: 'Tại vùng biển Hachijo-jima, kỹ sư toàn cầu quy tụ để vận hành Phao Thái Bình Dương - cơ sở kết nối mạng lưới camera giám sát trên khắp thế giới. Tổ chức Áo Đen bí mật bắt cóc kỹ sư nắm giữ công nghệ nhận diện khuôn mặt và phát hiện bí mật thân phận thật của Haibara Ai.',
        backdropUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/lGic4222E9QoZ6vK1L2Lz1n6w4K.jpg&output=webp',
        posterUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/lGic4222E9QoZ6vK1L2Lz1n6w4K.jpg&output=webp',
        trailerUrl: 'https://www.youtube.com/watch?v=nO3_7dKx97E',
        youtubeKey: 'nO3_7dKx97E',
        videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        streamSource: 'hls',
        releaseYear: 2023,
        duration: '1h 50m',
        rating: 9.4,
        matchPercentage: 99,
        ageRating: 'PG-13',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        director: 'Yuzuru Tachikawa',
        castData: [
          { name: 'Minami Takayama', role: 'Conan Edogawa (Voice)' },
          { name: 'Megumi Hayashibara', role: 'Ai Haibara (Voice)' },
        ],
        isTheatrical: true,
        isVietnamese: false,
        isAnimeTheatrical: true,
        franchise: 'conan',
        officialDistributor: 'Toho & CJ CGV Vietnam',
        watchProviders: [
          { providerName: 'FPT Play', quality: '1080P' },
          { providerName: 'Galaxy Play', quality: '1080P' },
        ],
        similarMovieIds: ['anime-doraemon-ban-giao-huong-2024'],
        isFeatured: true,
        genres: ['animation', 'action', 'mystery', 'conan', 'anime_theatrical'],
        categories: ['trending', 'anime_theatrical'],
      },
    ]

    for (const m of moviesSeedData) {
      await prisma.movie.upsert({
        where: { id: m.id },
        update: {
          titleVi: m.titleVi,
          titleOrigin: m.titleOrigin,
          slug: m.slug,
          type: m.type,
          tagline: m.tagline,
          synopsis: m.synopsis,
          backdropUrl: m.backdropUrl,
          posterUrl: m.posterUrl,
          trailerUrl: m.trailerUrl,
          youtubeKey: m.youtubeKey,
          videoStreamUrl: m.videoStreamUrl,
          streamSource: m.streamSource,
          releaseYear: m.releaseYear,
          duration: m.duration,
          rating: m.rating,
          matchPercentage: m.matchPercentage,
          ageRating: m.ageRating,
          quality: m.quality,
          audio: m.audio,
          director: m.director,
          castData: m.castData,
          isTheatrical: m.isTheatrical,
          isVietnamese: m.isVietnamese,
          isAnimeTheatrical: m.isAnimeTheatrical,
          franchise: m.franchise,
          officialDistributor: m.officialDistributor,
          watchProviders: m.watchProviders,
          similarMovieIds: m.similarMovieIds,
          isFeatured: m.isFeatured,
          status: 'published',
        },
        create: {
          id: m.id,
          titleVi: m.titleVi,
          titleOrigin: m.titleOrigin,
          slug: m.slug,
          type: m.type,
          tagline: m.tagline,
          synopsis: m.synopsis,
          backdropUrl: m.backdropUrl,
          posterUrl: m.posterUrl,
          trailerUrl: m.trailerUrl,
          youtubeKey: m.youtubeKey,
          videoStreamUrl: m.videoStreamUrl,
          streamSource: m.streamSource,
          releaseYear: m.releaseYear,
          duration: m.duration,
          rating: m.rating,
          matchPercentage: m.matchPercentage,
          ageRating: m.ageRating,
          quality: m.quality,
          audio: m.audio,
          director: m.director,
          castData: m.castData,
          isTheatrical: m.isTheatrical,
          isVietnamese: m.isVietnamese,
          isAnimeTheatrical: m.isAnimeTheatrical,
          franchise: m.franchise,
          officialDistributor: m.officialDistributor,
          watchProviders: m.watchProviders,
          similarMovieIds: m.similarMovieIds,
          isFeatured: m.isFeatured,
          status: 'published',
        },
      })

      // Link Genres
      for (const gid of m.genres) {
        await prisma.movieGenre.upsert({
          where: {
            movieId_genreId: { movieId: m.id, genreId: gid },
          },
          update: {},
          create: { movieId: m.id, genreId: gid },
        }).catch(() => {})
      }

      // Link Categories
      for (const cid of m.categories) {
        await prisma.movieCategory.upsert({
          where: {
            movieId_categoryId: { movieId: m.id, categoryId: cid },
          },
          update: {},
          create: { movieId: m.id, categoryId: cid },
        }).catch(() => {})
      }

      // Seed Default Episode & Video Server Sources
      const episode = await prisma.episode.upsert({
        where: {
          movieId_episodeNumber: { movieId: m.id, episodeNumber: 1 },
        },
        update: {
          name: 'Tập Đầy Đủ (Bản Chuẩn 4K)',
          slug: 'tap-day-du',
          duration: m.duration,
          thumbnailUrl: m.backdropUrl,
        },
        create: {
          movieId: m.id,
          episodeNumber: 1,
          name: 'Tập Đầy Đủ (Bản Chuẩn 4K)',
          slug: 'tap-day-du',
          duration: m.duration,
          thumbnailUrl: m.backdropUrl,
        },
      })

      // Seed Video Sources for Episode
      const existingSources = await prisma.episodeSource.findMany({
        where: { episodeId: episode.id },
      })
      if (existingSources.length === 0 && m.videoStreamUrl) {
        await prisma.episodeSource.createMany({
          data: [
            {
              episodeId: episode.id,
              serverName: 'VIP HLS 4K Ultra Server',
              videoUrl: m.videoStreamUrl,
              quality: '4K',
            },
            {
              episodeId: episode.id,
              serverName: 'Google CDN Backup 1080P',
              videoUrl: m.videoStreamUrl,
              quality: '1080P',
            },
          ],
        })
      }
    }
    // eslint-disable-next-line no-console
    console.log(`✅ [Master Seed]: ${moviesSeedData.length} Cinema Movies with genres, categories & episodes seeded.`)

    // -------------------------------------------------------------------------
    // 8. WATCHLIST SAMPLES (e.g. VIP user has bookmarks)
    // -------------------------------------------------------------------------
    const watchlistSamples = [
      { userId: 'usr-vip-demo', movieId: 'cybernetic-odyssey' },
      { userId: 'usr-vip-demo', movieId: 'vn-mai-2024' },
      { userId: 'usr-regular-demo', movieId: 'anime-doraemon-ban-giao-huong-2024' },
    ]

    for (const wl of watchlistSamples) {
      await prisma.watchlist.upsert({
        where: {
          userId_movieId: { userId: wl.userId, movieId: wl.movieId },
        },
        update: {},
        create: { userId: wl.userId, movieId: wl.movieId },
      }).catch(() => {})
    }
    // eslint-disable-next-line no-console
    console.log('✅ [Master Seed]: Sample Watchlist records linked.')

    // eslint-disable-next-line no-console
    console.log('🎉 [Master Seed]: ALL PORTFOLIO & CINEMA DATABASE SEEDS COMPLETED SUCCESSFULLY!')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ [Master Seed Error]: Failed to seed database:', error)
    throw error
  }
}
