import { createContext } from 'react'

export interface WhaleCinematicContextType {
  isCinematicActive: boolean
  hasPlayed: boolean
  triggerWhaleCinematic: () => void
  skipWhaleCinematic: () => void
}

export const WhaleCinematicContext = createContext<WhaleCinematicContextType | undefined>(undefined)
