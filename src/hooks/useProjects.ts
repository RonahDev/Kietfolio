import { useState, useEffect, useCallback } from 'react'
import { projectApi } from '../services/api/projectApi'
import type { ProjectItem } from '../types'

export function useProjects(initialCategory: string = 'all') {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await projectApi.getProjects(activeCategory)
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory])

  useEffect(() => {
    let isCancelled = false

    projectApi
      .getProjects(activeCategory)
      .then((data) => {
        if (!isCancelled) {
          setProjects(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch projects')
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [activeCategory])

  const handleSetCategory = useCallback((category: string) => {
    setIsLoading(true)
    setActiveCategory(category)
  }, [])

  return {
    projects,
    activeCategory,
    setActiveCategory: handleSetCategory,
    isLoading,
    error,
    refetch,
  }
}
