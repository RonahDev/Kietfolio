import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider } from './LanguageContext'
import { useLanguage } from '../hooks/useLanguage'

const TestConsumer: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage()
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="nav-about">{t.nav.about}</span>
      <button onClick={toggleLanguage} data-testid="toggle-btn">
        Toggle
      </button>
    </div>
  )
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides English as default language and switches to Vietnamese', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )

    expect(screen.getByTestId('current-lang').textContent).toBe('en')
    expect(screen.getByTestId('nav-about').textContent).toBe('About')

    // Click toggle
    fireEvent.click(screen.getByTestId('toggle-btn'))

    expect(screen.getByTestId('current-lang').textContent).toBe('vi')
    expect(screen.getByTestId('nav-about').textContent).toBe('Giới thiệu')
  })
})
