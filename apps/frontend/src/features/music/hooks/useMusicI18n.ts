import { useContext } from 'react'
import { LanguageContext } from '@/context/languageTypes'
import { SITE_CONFIG } from '@/config/site'
import { musicTranslations, type MusicI18nStrings } from '../data/musicTranslations'
import type { Language } from '@/types'

export function useMusicI18n() {
  const context = useContext(LanguageContext)
  let language: Language = 'en'

  if (context?.language) {
    language = context.language
  } else {
    try {
      const saved = localStorage.getItem(SITE_CONFIG.storageKeys.language)
      if (saved === 'vi' || saved === 'en') {
        language = saved
      }
    } catch {
      // Storage unavailable in restricted sandbox
    }
  }

  const t: MusicI18nStrings = musicTranslations[language] ?? musicTranslations.vi

  return {
    language,
    strings: t,
    t,
    toggleLanguage: context?.toggleLanguage ?? (() => {}),
    setLanguage: context?.setLanguage ?? (() => {}),
  }
}
