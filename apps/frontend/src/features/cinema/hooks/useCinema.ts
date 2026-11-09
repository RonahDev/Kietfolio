import { useContext } from 'react'
import { CinemaContext, type CinemaContextValue } from '../context/CinemaContext'

export const useCinema = (): CinemaContextValue => {
  const context = useContext(CinemaContext)
  if (!context) {
    throw new Error('useCinema must be used within a CinemaProvider')
  }
  return context
}
