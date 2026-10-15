import { useContext } from 'react'
import { LanguageContext, type LanguageContextType } from '../context/languageTypes'

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

