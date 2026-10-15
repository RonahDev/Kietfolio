import { useContext } from 'react'
import { WhaleCinematicContext, type WhaleCinematicContextType } from '../context/whaleCinematicTypes'

export function useWhaleCinematic(): WhaleCinematicContextType {
  const context = useContext(WhaleCinematicContext)
  if (!context) {
    throw new Error('useWhaleCinematic must be used within a WhaleCinematicProvider')
  }
  return context
}

