import { describe, it, expect } from 'vitest'
import {
  OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
  OFFICIAL_ACTION_THRILLER_MOVIES,
  OFFICIAL_THEATRICAL_ANIME_MOVIES,
} from '../services/officialMovieService'
import { CINEMA_MOVIES } from '../data/moviesData'
import { isMovieMatchingGenre } from '../utils/genreUtils'
import { getOptimizedImageUrl } from '../utils/imageFallbacks'

describe('Movie Catalog Classification & Genre Integrity', () => {
  const allMovies = [
    ...OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
    ...OFFICIAL_ACTION_THRILLER_MOVIES,
    ...OFFICIAL_THEATRICAL_ANIME_MOVIES,
    ...CINEMA_MOVIES,
  ]

  it('doraemon genre should match all Doraemon titles', () => {
    const doraemonMovies = allMovies.filter((m) => isMovieMatchingGenre(m, 'doraemon'))
    console.log(`Matched Doraemon Movies count: ${doraemonMovies.length}`)
    doraemonMovies.forEach((m) => console.log(` - [${m.id}] ${m.title}`))
    expect(doraemonMovies.length).toBeGreaterThanOrEqual(4)
  })

  it('action genre should match authentic action & thriller titles and not purely unrelated genres', () => {
    const actionMovies = allMovies.filter((m) => isMovieMatchingGenre(m, 'action'))
    console.log(`Matched Action Movies count: ${actionMovies.length}`)
    actionMovies.forEach((m) => console.log(` - [${m.id}] ${m.title}`))
    expect(actionMovies.length).toBeGreaterThanOrEqual(5)
  })

  it('anime theatrical should match franchise movies', () => {
    const anime = allMovies.filter((m) => isMovieMatchingGenre(m, 'anime_theatrical'))
    expect(anime.length).toBeGreaterThanOrEqual(10)
  })

  it('theatrical_vn should match Vietnamese theatrical movies', () => {
    const vnTheatrical = allMovies.filter((m) => isMovieMatchingGenre(m, 'theatrical_vn'))
    expect(vnTheatrical.length).toBeGreaterThanOrEqual(8)
  })

  it('should intercept corrupted KKPhim hashes and return authentic Doraemon artwork', () => {
    // Simulating upstream corrupted hash for Doraemon Bản Giao Hưởng (which was Vây Hãm Trên Không)
    const corruptedHashVayHam = 'https://phimimg.com/upload/vod/20250521-1/3b5ed51c3fb1dca303cfedbbfd59c904.jpg'
    const sanitizedPoster = getOptimizedImageUrl(corruptedHashVayHam, 'poster', ['doraemon'], 'doraemon')
    expect(sanitizedPoster).not.toContain('3b5ed51c')
    expect(sanitizedPoster).toContain('1W5Kg4K27U3dx9Kxb8DaE6WFLHI.jpg')

    // Simulating upstream corrupted hash for Doraemon Vùng Đất Lý Tưởng (which was Greek flyer)
    const corruptedHashGreek = 'https://phimimg.com/upload/vod/20250521-1/uux6M8z3hxLDkq8LXSzq8528mrq.jpg'
    const sanitizedGreekPoster = getOptimizedImageUrl(corruptedHashGreek, 'poster', ['doraemon'], 'doraemon')
    expect(sanitizedGreekPoster).not.toContain('uux6M8z3')
    expect(sanitizedGreekPoster).toContain('27f8594f')

    // Simulating backdrop override
    const corruptedBackdrop = 'https://phimimg.com/upload/vod/20250521-1/0514f6d0fba4bfeb3a48e24fa5eb066c.jpg'
    const sanitizedBackdrop = getOptimizedImageUrl(corruptedBackdrop, 'backdrop', ['doraemon'], 'doraemon')
    expect(sanitizedBackdrop).not.toContain('0514f6d0')
    expect(sanitizedBackdrop).toContain('xIKm2bfJ6HxiCfXBoOCwgDbOhzt.jpg')
  })
})
