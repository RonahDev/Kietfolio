import { useState, useEffect, useCallback } from 'react'
import { guestbookApi, type CreateGuestbookDto } from '../services/api/guestbookApi'
import type { GuestbookEntry } from '../types/auth'

export function useGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [postedSuccess, setPostedSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await guestbookApi.getEntries()
      setEntries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guestbook')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    guestbookApi
      .getEntries()
      .then((data) => {
        if (!isCancelled) {
          setEntries(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load guestbook')
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const submitEntry = useCallback(
    async (dto: CreateGuestbookDto): Promise<boolean> => {
      setIsSubmitting(true)
      setError(null)
      try {
        const created = await guestbookApi.createEntry(dto)
        setEntries((prev) => [created, ...prev])
        setPostedSuccess(true)
        setTimeout(() => setPostedSuccess(false), 4000)
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to post message')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  const removeEntry = useCallback(
    async (id: string, userUid: string, isAdmin: boolean): Promise<boolean> => {
      try {
        const ok = await guestbookApi.deleteEntry(id, userUid, isAdmin)
        if (ok) {
          setEntries((prev) => prev.filter((item) => item.id !== id))
        }
        return ok
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete message')
        return false
      }
    },
    []
  )

  return {
    entries,
    isLoading,
    isSubmitting,
    postedSuccess,
    error,
    submitEntry,
    removeEntry,
    refetch,
  }
}
