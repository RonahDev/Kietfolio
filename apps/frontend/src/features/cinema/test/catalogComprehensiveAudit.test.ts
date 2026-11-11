import { describe, it, expect } from 'vitest'
import {
  OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
  OFFICIAL_ACTION_THRILLER_MOVIES,
  OFFICIAL_THEATRICAL_ANIME_MOVIES,
} from '../services/officialMovieService'
import { CINEMA_MOVIES } from '../data/moviesData'
import type { MovieItem } from '../types/cinema'

function extractYoutubeKey(keyOrUrl?: string | null): string | null {
  if (!keyOrUrl) return null
  const trimmed = keyOrUrl.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match ? match[1] : null
}

describe('Cinema Catalog Comprehensive Integrity Audit', () => {
  const allMovies: MovieItem[] = [
    ...OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
    ...OFFICIAL_ACTION_THRILLER_MOVIES,
    ...OFFICIAL_THEATRICAL_ANIME_MOVIES,
    ...CINEMA_MOVIES,
  ]

  it('audits total catalog size and ensures over 40+ curated master titles', () => {
    expect(allMovies.length).toBeGreaterThanOrEqual(40)
    console.log(`Auditing total ${allMovies.length} movies in cinema catalog`)
  })

  it('ensures all movies have strictly unique IDs', () => {
    const idSet = new Set<string>()
    const duplicates: string[] = []

    for (const movie of allMovies) {
      if (idSet.has(movie.id)) {
        duplicates.push(movie.id)
      }
      idSet.add(movie.id)
    }

    if (duplicates.length > 0) {
      console.error('Found duplicate movie IDs:', duplicates)
    }
    expect(duplicates).toEqual([])
  })

  it('verifies every movie has essential metadata (title, year, rating, synopsis, genres)', () => {
    const invalidMovies: Array<{ id: string; reason: string }> = []

    for (const movie of allMovies) {
      if (!movie.id || typeof movie.id !== 'string') {
        invalidMovies.push({ id: movie.id || 'unknown', reason: 'Missing ID' })
      }
      if (!movie.title || typeof movie.title !== 'string' || movie.title.trim().length === 0) {
        invalidMovies.push({ id: movie.id, reason: 'Missing or empty title' })
      }
      if (!movie.synopsis || typeof movie.synopsis !== 'string' || movie.synopsis.trim().length === 0) {
        invalidMovies.push({ id: movie.id, reason: 'Missing or empty synopsis' })
      }
      if (typeof movie.year !== 'number' || movie.year < 1970 || movie.year > 2030) {
        invalidMovies.push({ id: movie.id, reason: `Invalid year: ${movie.year}` })
      }
      if (typeof movie.rating !== 'number' || movie.rating < 0 || movie.rating > 10) {
        invalidMovies.push({ id: movie.id, reason: `Invalid rating: ${movie.rating}` })
      }
      if (!Array.isArray(movie.genres) || movie.genres.length === 0) {
        invalidMovies.push({ id: movie.id, reason: 'Missing or empty genres array' })
      }
      if (!movie.posterUrl || typeof movie.posterUrl !== 'string') {
        invalidMovies.push({ id: movie.id, reason: 'Missing posterUrl' })
      }
      if (!movie.backdropUrl || typeof movie.backdropUrl !== 'string') {
        invalidMovies.push({ id: movie.id, reason: 'Missing backdropUrl' })
      }
    }

    if (invalidMovies.length > 0) {
      console.error('Invalid movies detected:', invalidMovies)
    }
    expect(invalidMovies).toEqual([])
  })

  it('checks trailerUrl and youtubeKey consistency and validity', () => {
    const brokenTrailers: Array<{ id: string; title: string; trailerUrl?: string; youtubeKey?: string }> = []

    for (const movie of allMovies) {
      if (movie.youtubeKey) {
        if (!/^[a-zA-Z0-9_-]{11}$/.test(movie.youtubeKey.trim())) {
          brokenTrailers.push({
            id: movie.id,
            title: movie.title,
            youtubeKey: movie.youtubeKey,
            trailerUrl: movie.trailerUrl,
          })
        }
      }
      if (movie.trailerUrl && !movie.trailerUrl.includes('youtube.com/results')) {
        const extracted = extractYoutubeKey(movie.trailerUrl)
        if (!extracted && !movie.youtubeKey) {
          brokenTrailers.push({
            id: movie.id,
            title: movie.title,
            trailerUrl: movie.trailerUrl,
          })
        }
      }
    }

    if (brokenTrailers.length > 0) {
      console.warn('Movies with non-resolvable trailers:', brokenTrailers)
    }
    expect(brokenTrailers).toEqual([])
  })

  it('verifies watchProviders data structure when present', () => {
    const invalidProviders: Array<{ id: string; provider: unknown }> = []

    for (const movie of allMovies) {
      if (movie.watchProviders) {
        for (const wp of movie.watchProviders) {
          if (!wp.providerName || !wp.logoPath) {
            invalidProviders.push({ id: movie.id, provider: wp })
          }
        }
      }
    }

    expect(invalidProviders).toEqual([])
  })
})
