import { createContext } from 'react'
import type { Language } from '../types'
import type { TranslationDictionary } from '../data/translations'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: TranslationDictionary
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

