import type { MovieItem, CinemaGenre } from '../types/cinema'

export const CINEMA_GENRES: CinemaGenre[] = [
  { id: 'all', labelVi: 'Tất cả thể loại', labelEn: 'All Genres' },
  { id: 'cyberpunk', labelVi: 'Cyberpunk & Công Nghệ', labelEn: 'Cyberpunk & Tech' },
  { id: 'sci-fi', labelVi: 'Khoa Học Viễn Tưởng', labelEn: 'Sci-Fi & Cosmos' },
  { id: 'action', labelVi: 'Hành Động & Kịch Tính', labelEn: 'Action & Thriller' },
  { id: 'logistics', labelVi: 'Kỹ Thuật & Logistics Doc', labelEn: 'Logistics & Systems Doc' },
  { id: 'drama', labelVi: 'Tâm Lý & Chiêm Nghiệm', labelEn: 'Drama & Philosophy' },
  { id: 'animation', labelVi: 'Hoạt Họa Nghệ Thuật', labelEn: 'Cinematic Animation' },
]

export const CINEMA_MOVIES: MovieItem[] = [
  {
    id: 'cybernetic-odyssey',
    title: 'The Cybernetic Odyssey: Ghost in the Network',
    tagline: 'When neural networks awaken, consciousness becomes the battlefield.',
    synopsis:
      'Trong tương lai gần khi các hệ thống phân tán AI chiếm lĩnh toàn bộ cơ sở hạ tầng toàn cầu, một kỹ sư kiến trúc hệ thống ngầm phát hiện ra một thực thể số tự sinh khởi chạy từ một node bị cô lập. Một cuộc rượt đuổi nghẹt thở xuyên qua mạng lưới điện toán đám mây và thực tại mở rộng bắt đầu.',
    backdropUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoStreamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    year: 2026,
    rating: 9.3,
    matchPercentage: 98,
    maturityRating: 'PG-13',
    duration: '2h 24m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    genres: ['cyberpunk', 'sci-fi', 'action'],
    director: 'Ronah Mai & Elena Vance',
    cast: [
      { name: 'Kaelen Cross', role: 'Chief Systems Architect' },
      { name: 'Nyx Tanaka', role: 'Neural Net Specialist' },
      { name: 'Viktor Reyes', role: 'Security Ops Director' },
    ],
    isTrending: true,
    isFeaturedHero: true,
    isAwardWinning: true,
    progressPercentage: 45,
    similarMovieIds: ['interstellar-logistics', 'blade-runner-neon', 'matrix-resurgence'],
  },
  {
    id: 'interstellar-logistics',
    title: 'Interstellar Logistics: Beyond Hub 63BDG02',
    tagline: 'Delivering survival across 4.2 light years with 99.999% SLA.',
    synopsis:
      'Lấy cảm hứng từ 2 năm thực chiến điều phối điều vận kho bãi tại Trạm Hub Thủ Dầu Một, bộ phim tài liệu điện ảnh tái hiện lại chiến dịch hậu cần vũ trụ vĩ đại nhất nhân loại: thiết lập chuỗi cung ứng không độ trễ giữa Trái Đất và Trạm vũ trụ Kepler-452b trong bối cảnh cơn bão từ thế kỷ đe dọa làm sập toàn bộ hệ thống định tuyến.',
    backdropUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoStreamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    year: 2025,
    rating: 9.5,
    matchPercentage: 99,
    maturityRating: 'G',
    duration: '1h 58m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    genres: ['logistics', 'sci-fi', 'drama'],
    director: 'Mai Anh Kiệt',
    cast: [
      { name: 'Marcus Sterling', role: 'Fleet Dispatcher Lead' },
      { name: 'Dr. Aris Thorne', role: 'Orbital Route Optimizer' },
      { name: 'Captain Linh Tran', role: 'Freighter Commander' },
    ],
    isTrending: true,
    isFeaturedHero: true,
    isAwardWinning: true,
    progressPercentage: 80,
    similarMovieIds: ['cybernetic-odyssey', 'oppenheimer-quantum', 'autonomous-transit'],
  },
  {
    id: 'oppenheimer-quantum',
    title: 'The Quantum Horizon: Architecture of Fire',
    tagline: 'The theory divided the atom. The engineering changed reality forever.',
    synopsis:
      'Khắc họa chân thực áp lực trí tuệ tột bậc và những quyết định kỹ thuật cân não đằng sau dự án Manhattan. Phim đi sâu vào bài toán xung khắc giữa tốc độ triển khai khẩn cấp và tính ổn định tuyệt đối của hệ thống cơ học lượng tử.',
    backdropUrl:
      'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    year: 2024,
    rating: 9.1,
    matchPercentage: 95,
    maturityRating: 'R',
    duration: '3h 00m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    genres: ['drama', 'logistics', 'sci-fi'],
    director: 'Christopher N.',
    cast: [
      { name: 'Cillian M.', role: 'J. Robert Oppenheimer' },
      { name: 'Robert D.', role: 'Lewis Strauss' },
      { name: 'Emily B.', role: 'Kitty Oppenheimer' },
    ],
    isTrending: false,
    isFeaturedHero: true,
    isAwardWinning: true,
    similarMovieIds: ['interstellar-logistics', 'inception-architecture'],
  },
  {
    id: 'dune-prophecy',
    title: 'Dune: Prophecy of the Arrakis Sands',
    tagline: 'Power over spice is power over all.',
    synopsis:
      'Trên hành tinh sa mạc khắc nghiệt Arrakis, sự khan hiếm tài nguyên và các cuộc tranh giành vương quyền đẩy các gia tộc vào vòng xoáy chiến tranh. Sự trỗi dậy của một đấng cứu thế mang theo những khúc ca bi tráng giữa biển cát vô tận.',
    backdropUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoStreamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    year: 2025,
    rating: 8.9,
    matchPercentage: 94,
    maturityRating: 'PG-13',
    duration: '2h 46m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    genres: ['sci-fi', 'action', 'drama'],
    director: 'Denis V.',
    cast: [
      { name: 'Timothée C.', role: 'Paul Atreides' },
      { name: 'Zendaya', role: 'Chani' },
      { name: 'Rebecca F.', role: 'Lady Jessica' },
    ],
    isTrending: true,
    isAwardWinning: true,
    similarMovieIds: ['cybernetic-odyssey', 'blade-runner-neon'],
  },
  {
    id: 'blade-runner-neon',
    title: 'Blade Runner 2099: Neon Rain',
    tagline: 'Memories can be coded. Empathy cannot.',
    synopsis:
      'Tại đại đô thị ngập trong ánh đèn neon và mưa axít, một thám tử sinh học nhân tạo đối mặt với bí ẩn về một nhóm người máy thế hệ mới có khả năng cảm nhận được giấc mơ và sự sáng tạo tâm linh.',
    backdropUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoStreamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    year: 2026,
    rating: 9.0,
    matchPercentage: 96,
    maturityRating: 'R',
    duration: '2h 35m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY 5.1',
    genres: ['cyberpunk', 'sci-fi', 'action'],
    director: 'Ridley S. & Silvana Cole',
    cast: [
      { name: 'Jared K.', role: 'Detective Zero' },
      { name: 'Sora Aoi', role: 'Synthesizer Architect' },
    ],
    isTrending: true,
    similarMovieIds: ['cybernetic-odyssey', 'matrix-resurgence'],
  },
  {
    id: 'inception-architecture',
    title: 'Inception: Subconscious Architecture',
    tagline: 'Your mind is the scene of the crime.',
    synopsis:
      'Nghệ thuật thâm nhập tiềm thức để gieo mầm ý niệm. Một tác phẩm kinh điển về kết cấu phân tầng thời gian và không gian đa chiều, nơi mọi định luật vật lý đều có thể bị bẻ cong bởi kiến trúc sư giấc mơ.',
    backdropUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    year: 2023,
    rating: 9.2,
    matchPercentage: 97,
    maturityRating: 'PG-13',
    duration: '2h 28m',
    quality: '1080P FULL HD',
    audio: 'DOLBY 5.1',
    genres: ['action', 'sci-fi', 'drama'],
    director: 'Christopher N.',
    cast: [
      { name: 'Leonardo D.', role: 'Dom Cobb' },
      { name: 'Joseph G.', role: 'Arthur' },
      { name: 'Elliot P.', role: 'Ariadne' },
    ],
    isAwardWinning: true,
    similarMovieIds: ['oppenheimer-quantum', 'matrix-resurgence'],
  },
  {
    id: 'autonomous-transit',
    title: 'Autonomous Transit: The Mega Sale Protocol',
    tagline: 'When 100,000 packages meet a fractured conveyor belt at midnight.',
    synopsis:
      'Phim tài liệu kỹ thuật kịch tính ghi lại thời khắc nghẹt thở trong đợt Mega Sale 11.11. Trước nguy cơ sập luồng bốc dỡ hàng loạt và tắc nghẽn cục bộ, đội ngũ vận hành và kỹ sư phần mềm đã ứng biến tái phân luồng thủ công kết hợp thuật toán dự báo tải trọng để giải cứu toàn bộ đơn hàng trong đêm.',
    backdropUrl:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoStreamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    year: 2025,
    rating: 9.4,
    matchPercentage: 99,
    maturityRating: 'G',
    duration: '1h 42m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY 5.1',
    genres: ['logistics', 'drama'],
    director: 'SPX Ground Engineering Team',
    cast: [
      { name: 'Lead Dispatcher Kiet', role: 'Ground Commander (63BDG02)' },
      { name: 'Minh Vu', role: 'Inbound Line Coordinator' },
      { name: 'Tuan Tran', role: 'Outbound Driver Squad Lead' },
    ],
    isTrending: true,
    progressPercentage: 20,
    similarMovieIds: ['interstellar-logistics', 'cybernetic-odyssey'],
  },
  {
    id: 'matrix-resurgence',
    title: 'The Matrix: Resurgence of the Machine',
    tagline: 'Free your mind once more.',
    synopsis:
      'Quay trở lại thế giới của hai thực tại: cuộc sống hàng ngày và những gì ẩn sau bức màn nhị phân xanh biếc. Liệu sự thật có giải phóng con người hay chỉ đưa họ vào một tầng mô phỏng tinh vi hơn?',
    backdropUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoStreamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    year: 2024,
    rating: 8.7,
    matchPercentage: 91,
    maturityRating: 'R',
    duration: '2h 28m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    genres: ['cyberpunk', 'sci-fi', 'action'],
    director: 'Lana W.',
    cast: [
      { name: 'Keanu R.', role: 'Neo' },
      { name: 'Carrie-Anne M.', role: 'Trinity' },
      { name: 'Yahya A.', role: 'Morpheus' },
    ],
    similarMovieIds: ['cybernetic-odyssey', 'blade-runner-neon'],
  },
  {
    id: 'spirited-echoes',
    title: 'Spirited Echoes: The Shinto Realm',
    tagline: 'Between the world of spirits and memories, follow the lantern lights.',
    synopsis:
      'Một kiệt tác hoạt họa 3D phong cách anime duy mỹ. Một cô bé vô tình bước qua cánh cổng Torii cổ kính giữa rừng rậm và lạc vào thành phố nổi của các linh hồn cổ xưa, nơi chỉ có lòng dũng cảm và trái tim thuần khiết mới mở được đường về.',
    backdropUrl:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoStreamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    year: 2026,
    rating: 9.6,
    matchPercentage: 99,
    maturityRating: 'G',
    duration: '2h 12m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    genres: ['animation', 'drama'],
    director: 'Makoto S. Studio',
    cast: [
      { name: 'Hana Kuroki', role: 'Aoi (Voice)' },
      { name: 'Ren Meguro', role: 'Kohaku (Voice)' },
    ],
    isAwardWinning: true,
    isComingSoon: false,
    similarMovieIds: ['dune-prophecy', 'inception-architecture'],
  },
  {
    id: 'chronicles-of-ai-2030',
    title: 'Chronicles of 2030: The Algorithmic Dawn',
    tagline: 'Coming Soon exclusively to Cinema Stream.',
    synopsis:
      'Bom tấn khoa học viễn tưởng sắp ra mắt về khoảnh khắc bước ngoặt khi công nghệ điện toán lượng tử kết hợp trí tuệ nhân tạo tổng quát (AGI) viết lại toàn bộ lịch sử tiến hóa nhân loại.',
    backdropUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    posterUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    year: 2027,
    rating: 9.8,
    matchPercentage: 99,
    maturityRating: 'PG-13',
    duration: '2h 50m',
    quality: '4K ULTRA HD',
    audio: 'DOLBY ATMOS',
    genres: ['cyberpunk', 'sci-fi'],
    director: 'Ronah Mai',
    cast: [{ name: 'Aria Sterling', role: 'Quantum Engineer' }],
    isComingSoon: true,
    similarMovieIds: ['cybernetic-odyssey', 'interstellar-logistics'],
  },
]
