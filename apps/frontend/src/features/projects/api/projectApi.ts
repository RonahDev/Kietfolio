import { apiClient } from '@/services/api/apiClient'
import { projectsData } from '../data/projects'
import type { ProjectItem } from '@/types'

export const projectApi = {
  /**
   * Fetch all portfolio projects, with optional category filtering.
   * Seamlessly queries remote API if configured, otherwise serves bundled data.
   */
  async getProjects(category?: string): Promise<ProjectItem[]> {
    if (apiClient.isRemoteEnabled) {
      try {
        const query = category && category !== 'all' ? `?category=${category}` : ''
        const res = await apiClient.get<ProjectItem[]>(`projects${query}`)
        return res.data
      } catch (err) {
        console.warn('Failed to fetch remote projects, falling back to local dataset:', err)
      }
    }

    // Local / Offline fallback
    const items = [...projectsData]
    if (category && category !== 'all') {
      return items.filter((p) => p.category === category)
    }
    return items
  },

  /**
   * Fetch a single project by its unique slug ID
   */
  async getProjectById(id: string): Promise<ProjectItem | null> {
    if (apiClient.isRemoteEnabled) {
      try {
        const res = await apiClient.get<ProjectItem>(`projects/${id}`)
        return res.data
      } catch (err) {
        console.warn('Failed to fetch remote project by ID, checking local dataset:', err)
      }
    }

    return projectsData.find((p) => p.id === id) || null
  },
}

