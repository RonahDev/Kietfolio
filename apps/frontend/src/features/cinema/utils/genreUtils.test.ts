import { describe, it, expect } from 'vitest'
import {
  CINEMA_GENRE_GROUPS,
  normalizeGenreSlug,
  getGenreLabel,
  isMovieMatchingGenre,
} from './genreUtils'
import { CINEMA_GENRES } from '../data/moviesData'
import {
  OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
  OFFICIAL_THEATRICAL_ANIME_MOVIES,
  OFFICIAL_ACTION_THRILLER_MOVIES,
} from '../services/officialMovieService'
import { CINEMA_MOVIES } from '../data/moviesData'

describe('Cinema Genre Taxonomy & Grouping Suite', () => {
  it('defines 4 structured genre groups with proper metadata', () => {
    expect(CINEMA_GENRE_GROUPS).toHaveLength(4)
    const groupIds = CINEMA_GENRE_GROUPS.map((g) => g.id)
    expect(groupIds).toEqual(['collections', 'cinema_genres', 'anime_franchises', 'tech_and_docs'])

    for (const group of CINEMA_GENRE_GROUPS) {
      expect(group.labelVi).toBeTruthy()
      expect(group.genres.length).toBeGreaterThan(0)
    }
  })

  it('ensures all genres in CINEMA_GENRES are mapped to a group', () => {
    expect(CINEMA_GENRES.length).toBeGreaterThan(15)
    for (const genre of CINEMA_GENRES) {
      expect(genre.groupId).toBeDefined()
      expect(genre.labelVi).toBeTruthy()
    }
  })

  it('accurately normalizes genre aliases and slugs', () => {
    expect(normalizeGenreSlug('hanh-dong')).toBe('action')
    expect(normalizeGenreSlug('hai-huoc')).toBe('comedy')
    expect(normalizeGenreSlug('kinh-di')).toBe('horror')
    expect(normalizeGenreSlug('hoat-hinh')).toBe('animation')
    expect(normalizeGenreSlug('trinh-tham')).toBe('mystery')
    expect(normalizeGenreSlug('onepiece')).toBe('onepiece')
  })

  it('accurately resolves human-readable Vietnamese labels', () => {
    expect(getGenreLabel('action')).toBe('Hành Động & Kịch Tính')
    expect(getGenreLabel('comedy')).toBe('Hài Hước & Vui Nhộn')
    expect(getGenreLabel('horror')).toBe('Kinh Dị & Rùng Rợn')
    expect(getGenreLabel('doraemon')).toBe('Doraemon Movie')
    expect(getGenreLabel('conan')).toBe('Thám Tử Conan')
    expect(getGenreLabel('onepiece')).toBe('One Piece: Vua Hải Tặc')
  })

  it('properly categorizes theatrical movies into their respective categories', () => {
    const allCatalog = [
      ...OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
      ...OFFICIAL_THEATRICAL_ANIME_MOVIES,
      ...OFFICIAL_ACTION_THRILLER_MOVIES,
      ...CINEMA_MOVIES,
    ]

    // 1. Phim Chiếu Rạp Việt Nam
    const vnTheatrical = allCatalog.filter((m) => isMovieMatchingGenre(m, 'theatrical_vn'))
    expect(vnTheatrical.length).toBeGreaterThanOrEqual(8)
    expect(vnTheatrical.some((m) => m.id === 'vn-mai-2024')).toBe(true)
    expect(vnTheatrical.some((m) => m.id === 'vn-lat-mat-7-2024')).toBe(true)
    expect(vnTheatrical.some((m) => m.id === 'vn-nha-ba-nu-2023')).toBe(true)
    expect(vnTheatrical.some((m) => m.id === 'vn-quy-cau-2023')).toBe(true)

    // 2. Doraemon franchise
    const doraemonMovies = allCatalog.filter((m) => isMovieMatchingGenre(m, 'doraemon'))
    expect(doraemonMovies.length).toBeGreaterThanOrEqual(6)
    for (const m of doraemonMovies) {
      expect(m.franchise).toBe('doraemon')
    }

    // 3. Conan franchise
    const conanMovies = allCatalog.filter((m) => isMovieMatchingGenre(m, 'conan'))
    expect(conanMovies.length).toBeGreaterThanOrEqual(2)
    for (const m of conanMovies) {
      expect(m.franchise).toBe('conan')
    }

    // 4. Action & Thriller
    const actionMovies = allCatalog.filter((m) => isMovieMatchingGenre(m, 'action'))
    expect(actionMovies.length).toBeGreaterThanOrEqual(10)
    expect(actionMovies.some((m) => m.id === 'action-hai-phuong-2019')).toBe(true)
    expect(actionMovies.some((m) => m.id === 'action-john-wick-4-2023')).toBe(true)

    // 5. Comedy & Humor
    const comedyMovies = allCatalog.filter((m) => isMovieMatchingGenre(m, 'comedy'))
    expect(comedyMovies.length).toBeGreaterThanOrEqual(5)
    expect(comedyMovies.some((m) => m.id === 'vn-lat-mat-7-2024')).toBe(true)
    expect(comedyMovies.some((m) => m.id === 'vn-nha-ba-nu-2023')).toBe(true)
    expect(comedyMovies.some((m) => m.id === 'anime-shin-chan-sushi-bay-2023')).toBe(true)

    // 6. Horror & Spooky
    const horrorMovies = allCatalog.filter((m) => isMovieMatchingGenre(m, 'horror'))
    expect(horrorMovies.length).toBeGreaterThanOrEqual(2)
    expect(horrorMovies.some((m) => m.id === 'vn-cam-2024')).toBe(true)
    expect(horrorMovies.some((m) => m.id === 'vn-quy-cau-2023')).toBe(true)

    // 7. Animation / Hoạt hình matches all anime movies
    const animationMovies = allCatalog.filter((m) => isMovieMatchingGenre(m, 'animation'))
    expect(animationMovies.length).toBeGreaterThanOrEqual(OFFICIAL_THEATRICAL_ANIME_MOVIES.length)
  })
})
