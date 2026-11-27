import type { Language } from '@/types'

export interface MusicI18nStrings {
  // Intro
  introCrest: string
  introTitle: string
  introSubtitle: string
  enterTheater: string
  skipIntro: string
  stageReady: string
  performanceTagline: string
  performanceDesc: string

  // Navigation Tabs
  tabHome: string
  tabDiscover: string
  tabAllSongs: string
  tabAlbums: string
  tabArtists: string
  tabMyPlaylists: string
  tabImportedMusic: string
  tabRecentlyPlayed: string
  tabFavorites: string
  tabSettings: string

  // Header
  searchPlaceholder: string
  myCollection: string
  importShort: string
  cinemaBtn: string
  backToPortfolio: string
  brandTitle: string
  brandSubtitle: string

  // Dashboard
  welcomeBadge: string
  welcomeTitle: string
  welcomeDesc: string
  playOpening: string
  importAudio: string
  recentlyPlayedTitle: string
  viewHistory: string
  trendingVpopTitle: string
  trendingVpopDesc: string
  featuredMasterworks: string
  viewAllSongs: string
  curatedAlbums: string
  composersTitle: string
  categoriesTitle: string
  myPlaylistsTitle: string
  newPlaylist: string
  emptyPlaylistsPrompt: string
  trackSingular: string
  trackPlural: string

  // Library & Collections
  allSongsTitle: string
  allSongsDesc: string
  discoverTitle: string
  discoverDesc: string
  albumsTitle: string
  albumsDesc: string
  artistsTitle: string
  artistsDesc: string
  favoritesTitle: string
  favoritesDesc: string
  playAllFavorites: string
  noFavoritesPrompt: string
  historyTitle: string
  historyDesc: string
  clearHistory: string
  noHistoryPrompt: string

  // My Music Collection
  importedTitle: string
  importedDesc: string
  importDropzoneTitle: string
  importDropzoneSubtitle: string
  selectFilesBtn: string
  importProgress: string
  importComplete: string
  unsupportedFormat: string
  personalPlaylistsTitle: string
  personalPlaylistsDesc: string
  createNewPlaylist: string
  playlistNameLabel: string
  playlistDescLabel: string
  createBtn: string
  cancelBtn: string
  deletePlaylist: string
  playAllBtn: string
  reorderUp: string
  reorderDown: string
  searchInPlaylist: string

  // Track Actions & Modals
  editMetadataTitle: string
  trackTitleLabel: string
  artistLabel: string
  albumLabel: string
  saveChanges: string
  assignPlaylistTitle: string
  saveSelection: string

  // Player Bar
  nowPlaying: string
  noTrackSelected: string
  play: string
  pause: string
  previous: string
  next: string
  mute: string
  unmute: string
  shuffle: string
  repeatAll: string
  repeatOne: string
  repeatOff: string
  volume: string
  seekTimeline: string

  // Settings
  settingsTitle: string
  settingsDesc: string
  volumePref: string
  atmosphereTheme: string
  themeDeepVelvet: string
  themeWarmAmber: string
  themeMinimalCharcoal: string
  animationPref: string
  reduceMotionLabel: string
  autoPlayNextLabel: string
  replayIntroBtn: string
  shortcutsTitle: string
  storageVaultTitle: string
  storageVaultDesc: string
  clearLocalVaultBtn: string
  clearHistoryBtn: string
}

export const musicTranslations: Record<Language, MusicI18nStrings> = {
  vi: {
    // Intro
    introCrest: 'Thính Phòng Biệt Lập · Độc Tấu Cổ Điển',
    introTitle: 'Nhà Hát Âm Nhạc Cá Nhân',
    introSubtitle:
      'Không gian hòa nhạc thính phòng cổ điển sang trọng, nơi mỗi bản nhạc trở thành một tác phẩm nghệ thuật và lưu trữ bộ sưu tập lossless của riêng bạn.',
    enterTheater: 'Bước Vào Nhà Hát',
    skipIntro: 'Bỏ Qua Mở Đầu',
    stageReady: 'Ánh Sáng Sân Khấu Sẵn Sàng',
    performanceTagline: 'Nơi Mỗi Giai Điệu Trở Thành Một Buổi Trình Diễn',
    performanceDesc:
      'Không gian giao hưởng thính phòng và kho lưu trữ đĩa than & lossless riêng tư đang chờ đón bạn.',

    // Navigation Tabs
    tabHome: 'Trang Chủ',
    tabDiscover: 'Khám Phá',
    tabAllSongs: 'Tất Cả Bài Hát',
    tabAlbums: 'Tuyển Tập Album',
    tabArtists: 'Nghệ Sĩ & Tác Giả',
    tabMyPlaylists: 'Danh Sách Phát',
    tabImportedMusic: 'Nhạc Đã Nhập',
    tabRecentlyPlayed: 'Phát Gần Đây',
    tabFavorites: 'Yêu Thích',
    tabSettings: 'Cài Đặt',

    // Header
    searchPlaceholder: 'Tìm bài hát, tác phẩm, nhà soạn nhạc, nghệ sĩ...',
    myCollection: 'Bộ Sưu Tập Nhạc Của Tôi',
    importShort: 'Nhập Nhạc',
    cinemaBtn: 'Rạp Phim 3D',
    backToPortfolio: 'Về Trang Portfolio',
    brandTitle: 'Nhà Hát Nhạc',
    brandSubtitle: 'Khán Phòng Riêng',

    // Dashboard
    welcomeBadge: 'Thính Phòng Cổ Điển & Kho Nhạc Cá Nhân',
    welcomeTitle: 'Chào Mừng Đến Với Nhà Hát Âm Nhạc Cá Nhân',
    welcomeDesc:
      'Thả mình vào không gian tĩnh lặng nghệ thuật. Thưởng thức các kiệt tác thính phòng giao hưởng bất hủ hoặc nhập trực tiếp tệp nhạc MP3, WAV, FLAC, M4A từ máy của bạn.',
    playOpening: 'Phát Buổi Hòa Nhạc Mở Đầu',
    importAudio: 'Nhập Nhạc Cá Nhân',
    recentlyPlayedTitle: 'Đã Nghe Gần Đây',
    viewHistory: 'Xem Lịch Sử',
    trendingVpopTitle: 'Bảng Xếp Hạng Nhạc Hot Việt Nam',
    trendingVpopDesc: 'Các bản hit thịnh hành hàng đầu từ Sơn Tùng M-TP, Đen Vâu, Phan Mạnh Quỳnh, Vũ., Tăng Duy Tân...',
    featuredMasterworks: 'Tác Phẩm Tuyển Chọn',
    viewAllSongs: 'Xem Tất Cả Bài Hát',
    curatedAlbums: 'Album Cổ Điển Tuyển Chọn',
    composersTitle: 'Các Nhà Soạn Nhạc & Nghệ Sĩ Lớn',
    categoriesTitle: 'Tâm Trạng Âm Nhạc & Thể Loại',
    myPlaylistsTitle: 'Danh Sách Phát Của Bạn',
    newPlaylist: 'Tạo Danh Sách Mới',
    emptyPlaylistsPrompt:
      'Chưa có danh sách phát nào. Hãy tạo danh sách đầu tiên để gom các tác phẩm yêu thích của bạn.',
    trackSingular: 'tác phẩm',
    trackPlural: 'tác phẩm',

    // Library & Collections
    allSongsTitle: 'Toàn Bộ Kho Nhạc Giao Hưởng',
    allSongsDesc: 'Khám phá tất cả tác phẩm thính phòng kinh điển và bài hát đã nhập của bạn.',
    discoverTitle: 'Khám Phá Âm Hưởng Nghệ Thuật',
    discoverDesc: 'Các giai điệu tuyển chọn giúp bạn tập trung làm việc, đọc sách và thư giãn sâu.',
    albumsTitle: 'Album Hòa Nhạc Cổ Điển',
    albumsDesc: 'Bộ tuyển tập trọn vẹn từ các nhà soạn nhạc vĩ đại trong lịch sử âm nhạc.',
    artistsTitle: 'Nhà Soạn Nhạc & Nghệ Sĩ Biểu Diễn',
    artistsDesc: 'Chân dung và tác phẩm của những thiên tài Chopin, Beethoven, Bach, Mozart, Debussy...',
    favoritesTitle: 'Tác Phẩm Yêu Thích Của Bạn',
    favoritesDesc: 'Bộ sưu tập những bản nhạc chạm tới cảm xúc được bạn lưu lại.',
    playAllFavorites: 'Phát Tất Cả Bài Yêu Thích',
    noFavoritesPrompt: 'Chưa có bài hát nào được thêm vào danh sách yêu thích.',
    historyTitle: 'Lịch Sử Nghe Nhạc',
    historyDesc: 'Danh sách các tác phẩm bạn đã thưởng thức trong khán phòng.',
    clearHistory: 'Xóa Lịch Sử',
    noHistoryPrompt: 'Chưa có lịch sử phát nhạc nào được ghi nhận.',

    // My Music Collection
    importedTitle: 'Thư Viện Tệp Nhạc Cục Bộ Của Bạn',
    importedDesc: 'Các bài hát tải từ máy tính được lưu trữ an toàn trong IndexedDB của trình duyệt.',
    importDropzoneTitle: 'Kéo Thả Tệp Âm Thanh Vào Đây',
    importDropzoneSubtitle: 'Hỗ trợ các định dạng MP3, WAV, FLAC, M4A, OGG, AAC',
    selectFilesBtn: 'Chọn Tệp Từ Máy Tính',
    importProgress: 'Tiến độ nhập tệp',
    importComplete: 'Đã hoàn tất nhập bài hát',
    unsupportedFormat: 'Định dạng tệp không được hỗ trợ hoặc bị lỗi',
    personalPlaylistsTitle: 'Danh Sách Phát Cá Nhân',
    personalPlaylistsDesc: 'Tự do tạo danh sách theo sở thích, sắp xếp thứ tự và quản lý bài hát.',
    createNewPlaylist: 'Tạo Danh Sách Mới',
    playlistNameLabel: 'Tên Danh Sách Phát',
    playlistDescLabel: 'Mô Tả Danh Sách (Tùy chọn)',
    createBtn: 'Tạo Danh Sách',
    cancelBtn: 'Hủy',
    deletePlaylist: 'Xóa Danh Sách',
    playAllBtn: 'Phát Tất Cả',
    reorderUp: 'Di chuyển lên',
    reorderDown: 'Di chuyển xuống',
    searchInPlaylist: 'Tìm bài hát trong danh sách...',

    // Track Actions & Modals
    editMetadataTitle: 'Chỉnh Sửa Thông Tin Bài Hát',
    trackTitleLabel: 'Tên Bài Hát',
    artistLabel: 'Nghệ Sĩ / Nhà Soạn Nhạc',
    albumLabel: 'Album Tuyển Tập',
    saveChanges: 'Lưu Thay Đổi',
    assignPlaylistTitle: 'Gán Bài Hát Vào Danh Sách Phát',
    saveSelection: 'Lưu Lựa Chọn',

    // Player Bar
    nowPlaying: 'Đang Phát',
    noTrackSelected: 'Chưa chọn bài hát nào',
    play: 'Phát',
    pause: 'Tạm dừng',
    previous: 'Bài trước',
    next: 'Bài sau',
    mute: 'Tắt âm',
    unmute: 'Bật âm',
    shuffle: 'Xáo trộn',
    repeatAll: 'Lặp lại tất cả',
    repeatOne: 'Lặp lại 1 bài',
    repeatOff: 'Tắt lặp lại',
    volume: 'Âm lượng',
    seekTimeline: 'Tua thời gian',

    // Settings
    settingsTitle: 'Cài Đặt Khán Phòng & Âm Thanh',
    settingsDesc: 'Tùy chỉnh trải nghiệm thính phòng, âm lượng, giao diện và kho lưu trữ cục bộ.',
    volumePref: 'Âm Lượng Mặc Định',
    atmosphereTheme: 'Không Gian & Giao Diện Nhà Hát',
    themeDeepVelvet: 'Rèm Nhung Đỏ Cổ Điển (Deep Velvet)',
    themeWarmAmber: 'Ánh Đèn Hổ Phách (Warm Amber)',
    themeMinimalCharcoal: 'Đêm Than Tĩnh Lặng (Minimal Charcoal)',
    animationPref: 'Tự Động Phát & Hiệu Ứng',
    reduceMotionLabel: 'Chế độ giảm chuyển động (Reduced Motion)',
    autoPlayNextLabel: 'Tự động phát bài tiếp theo khi kết thúc',
    replayIntroBtn: 'Xem Lại Hiệu Ứng Mở Màn Rạp Hát GSAP',
    shortcutsTitle: 'Bảng Phím Tắt Tiện Ích',
    storageVaultTitle: 'Kho Lưu Trữ Nhạc Cục Bộ (IndexedDB)',
    storageVaultDesc:
      'Dữ liệu âm thanh tải lên được lưu 100% trong bộ nhớ trình duyệt của bạn, tuyệt đối không gửi lên máy chủ bên ngoài.',
    clearLocalVaultBtn: 'Xóa Toàn Bộ Dữ Liệu Nhạc Cục Bộ',
    clearHistoryBtn: 'Xóa Toàn Bộ Lịch Sử Nghe Nhạc',
  },
  en: {
    // Intro
    introCrest: 'Private Residence Recital',
    introTitle: 'Private Music Theater',
    introSubtitle:
      'An intimate classical concert hall designed for unhurried listening and your personal lossless collection.',
    enterTheater: 'Enter the Theater',
    skipIntro: 'Skip Intro',
    stageReady: 'Stage Spotlights Ready',
    performanceTagline: 'Every Song Becomes a Performance',
    performanceDesc: 'Orchestral chamber acoustics and your private vinyl & lossless archive await.',

    // Navigation Tabs
    tabHome: 'Home',
    tabDiscover: 'Discover',
    tabAllSongs: 'All Songs',
    tabAlbums: 'Albums',
    tabArtists: 'Artists',
    tabMyPlaylists: 'My Playlists',
    tabImportedMusic: 'Imported Music',
    tabRecentlyPlayed: 'Recently Played',
    tabFavorites: 'Favorites',
    tabSettings: 'Settings',

    // Header
    searchPlaceholder: 'Search performances, composers, albums...',
    myCollection: 'My Music Collection',
    importShort: 'Import',
    cinemaBtn: 'Cinema 3D',
    backToPortfolio: 'Back to Portfolio',
    brandTitle: 'Music Theater',
    brandSubtitle: 'Private Box',

    // Dashboard
    welcomeBadge: 'Evening Matinee & Private Archive',
    welcomeTitle: 'Welcome to Your Private Music Theater',
    welcomeDesc:
      'Settle into acoustic silence. Enjoy curated chamber nocturnes or import your personal MP3, WAV, FLAC, and M4A library directly into local concert storage.',
    playOpening: 'Play Opening Recital',
    importAudio: 'Import Personal Audio',
    recentlyPlayedTitle: 'Recently Played',
    viewHistory: 'View History',
    trendingVpopTitle: 'Top Trending Vietnamese Hits',
    trendingVpopDesc: 'Top chart-topping Vietnamese hits from Son Tung M-TP, Den Vau, Phan Manh Quynh, Vu., Tang Duy Tan...',
    featuredMasterworks: 'Featured Masterworks',
    viewAllSongs: 'View All Songs',
    curatedAlbums: 'Curated Classical Albums',
    composersTitle: 'Master Composers & Artists',
    categoriesTitle: 'Acoustic Moods & Categories',
    myPlaylistsTitle: 'My Playlists',
    newPlaylist: 'New Playlist',
    emptyPlaylistsPrompt:
      'No custom playlists yet. Create your first list to group your favorite performances.',
    trackSingular: 'performance',
    trackPlural: 'performances',

    // Library & Collections
    allSongsTitle: 'Complete Symphony Catalog',
    allSongsDesc: 'Explore all timeless classical works and your personal imported tracks.',
    discoverTitle: 'Curated Acoustic Discovery',
    discoverDesc: 'Timeless compositions tailored for deep focus, reading, and contemplative listening.',
    albumsTitle: 'Classical Concert Albums',
    albumsDesc: 'Complete compositions and collections from history’s greatest maestros.',
    artistsTitle: 'Master Composers & Performers',
    artistsDesc: 'Biographies and immortal works of Chopin, Beethoven, Bach, Mozart, Debussy...',
    favoritesTitle: 'Your Favorite Performances',
    favoritesDesc: 'Personal collection of beloved chamber and orchestral pieces.',
    playAllFavorites: 'Play All Favorites',
    noFavoritesPrompt: 'No favorite tracks saved yet.',
    historyTitle: 'Listening History',
    historyDesc: 'Recent recital recordings and tracks experienced in your private hall.',
    clearHistory: 'Clear History',
    noHistoryPrompt: 'No playback history recorded yet.',

    // My Music Collection
    importedTitle: 'Imported Local Audio Library',
    importedDesc: 'Locally imported files safely preserved in your browser’s IndexedDB vault.',
    importDropzoneTitle: 'Drag & Drop Audio Files Here',
    importDropzoneSubtitle: 'Supported formats: MP3, WAV, FLAC, M4A, OGG, AAC',
    selectFilesBtn: 'Select Audio Files',
    importProgress: 'Import Progress',
    importComplete: 'Import complete',
    unsupportedFormat: 'Unsupported format or corrupted file',
    personalPlaylistsTitle: 'Personal Playlists',
    personalPlaylistsDesc: 'Curate your own concert programs, reorder tracks, and manage your library.',
    createNewPlaylist: 'Create New Playlist',
    playlistNameLabel: 'Playlist Name',
    playlistDescLabel: 'Description (Optional)',
    createBtn: 'Create Playlist',
    cancelBtn: 'Cancel',
    deletePlaylist: 'Delete Playlist',
    playAllBtn: 'Play All',
    reorderUp: 'Move up',
    reorderDown: 'Move down',
    searchInPlaylist: 'Search songs in playlist...',

    // Track Actions & Modals
    editMetadataTitle: 'Edit Track Metadata',
    trackTitleLabel: 'Track Title',
    artistLabel: 'Composer / Artist',
    albumLabel: 'Album / Suite',
    saveChanges: 'Save Changes',
    assignPlaylistTitle: 'Assign Track to Playlists',
    saveSelection: 'Save Selection',

    // Player Bar
    nowPlaying: 'Now Playing',
    noTrackSelected: 'No track selected',
    play: 'Play',
    pause: 'Pause',
    previous: 'Previous',
    next: 'Next',
    mute: 'Mute',
    unmute: 'Unmute',
    shuffle: 'Shuffle',
    repeatAll: 'Repeat all',
    repeatOne: 'Repeat one',
    repeatOff: 'Repeat off',
    volume: 'Volume',
    seekTimeline: 'Seek timeline',

    // Settings
    settingsTitle: 'Theater Preferences & Acoustics',
    settingsDesc: 'Customize hall ambiance, playback defaults, theme, and local audio storage.',
    volumePref: 'Default Playback Volume',
    atmosphereTheme: 'Acoustic Atmosphere & Theme',
    themeDeepVelvet: 'Deep Velvet Burgundy',
    themeWarmAmber: 'Warm Amber Glow',
    themeMinimalCharcoal: 'Minimal Charcoal Noir',
    animationPref: 'Playback & Animation',
    reduceMotionLabel: 'Reduced Motion Override',
    autoPlayNextLabel: 'Auto-play next track on finish',
    replayIntroBtn: 'Replay Curtain Opening Sequence',
    shortcutsTitle: 'Keyboard Shortcuts Reference',
    storageVaultTitle: 'Local Storage Vault (IndexedDB)',
    storageVaultDesc:
      'Imported audio files remain 100% on your device in browser IndexedDB. Zero cloud uploads.',
    clearLocalVaultBtn: 'Clear Local Music Vault',
    clearHistoryBtn: 'Clear Playback History',
  },
}
