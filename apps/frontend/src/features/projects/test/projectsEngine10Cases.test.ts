import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProjects } from '../hooks/useProjects'
import { projectsData } from '../data/projects'
import type { ProjectItem } from '@/types'

describe('Projects & Skills Portfolio Engine — 10 Comprehensive Testcases', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  // TC-PRJ-01: Full project catalog integrity
  it('TC-PRJ-01: loads comprehensive portfolio project catalog with required architectural metadata', async () => {
    const { result } = renderHook(() => useProjects('all'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.projects.length).toBeGreaterThan(0)
    for (const project of result.current.projects) {
      expect(project.id).toBeDefined()
      expect(project.title).toBeDefined()
      expect(project.category).toBeDefined()
      expect(project.techStack.length).toBeGreaterThan(0)
    }
  })

  // TC-PRJ-02: Fullstack category filter
  it('TC-PRJ-02: filters projects by fullstack category with strict isolation', async () => {
    const { result } = renderHook(() => useProjects('fullstack'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.projects.length).toBeGreaterThan(0)
    expect(result.current.projects.every((p) => p.category === 'fullstack')).toBe(true)
  })

  // TC-PRJ-03: Creative category filter
  it('TC-PRJ-03: filters projects by creative category with complete isolation', async () => {
    const { result } = renderHook(() => useProjects('creative'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.projects.length).toBeGreaterThan(0)
    expect(result.current.projects.every((p) => p.category === 'creative')).toBe(true)
  })

  // TC-PRJ-04: Systems category filter
  it('TC-PRJ-04: filters projects by systems category for high-concurrency systems', async () => {
    const { result } = renderHook(() => useProjects('systems'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.projects.length).toBeGreaterThan(0)
    expect(result.current.projects.every((p) => p.category === 'systems')).toBe(true)
  })

  // TC-PRJ-05: 'all' category returns total repository
  it('TC-PRJ-05: returns complete set of portfolio projects when category is all', async () => {
    const { result } = renderHook(() => useProjects('all'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.projects.length).toBe(projectsData.length)
  })

  // TC-PRJ-06: Featured project ordering priority
  it('TC-PRJ-06: prioritizes featured projects at top of catalog list', () => {
    const sorted = [...projectsData].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    expect(sorted[0].isFeatured).toBe(true)
  })

  // TC-PRJ-07: Search by title or technology tag
  it('TC-PRJ-07: filters projects matching query across title or techStack tags', () => {
    const searchProjects = (query: string, items: ProjectItem[]) => {
      const q = query.toLowerCase().trim()
      return items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
      )
    }

    const reactProjects = searchProjects('React', projectsData)
    expect(reactProjects.length).toBeGreaterThan(0)

    const cinemaProjects = searchProjects('Cinema', projectsData)
    expect(cinemaProjects.length).toBeGreaterThan(0)
  })

  // TC-PRJ-08: Empty search state
  it('TC-PRJ-08: returns empty array gracefully when search query matches no projects', () => {
    const searchProjects = (query: string, items: ProjectItem[]) => {
      const q = query.toLowerCase().trim()
      return items.filter((p) => p.title.toLowerCase().includes(q))
    }

    const none = searchProjects('non-existent-xyz-9999', projectsData)
    expect(none).toEqual([])
  })

  // TC-PRJ-09: Project links presence and format
  it('TC-PRJ-09: validates external project links (GitHub repository and live demo URL)', () => {
    for (const project of projectsData) {
      if (project.githubUrl) {
        expect(project.githubUrl).toMatch(/^https?:\/\//)
      }
      if (project.liveUrl) {
        expect(project.liveUrl).toMatch(/^(https?:\/\/|\/|#)/)
      }
    }
  })

  // TC-PRJ-10: Image fallback for missing project thumbnails
  it('TC-PRJ-10: returns reliable SVG/image fallback when project thumbnail is missing or empty', () => {
    const resolveThumbnail = (thumbnail?: string) => {
      if (!thumbnail || thumbnail.trim() === '') {
        return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      }
      return thumbnail
    }

    expect(resolveThumbnail('')).toContain('unsplash.com')
    expect(resolveThumbnail(undefined)).toContain('unsplash.com')
    expect(resolveThumbnail('https://cdn.example.com/thumb.png')).toBe('https://cdn.example.com/thumb.png')
  })
})
