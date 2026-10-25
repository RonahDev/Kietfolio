import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { DonateModal } from './DonateModal'
import { LanguageProvider } from '@/context'

describe('DonateModal QA & Payment Flow Test Suite', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedTier: 50000 as const,
    customAmount: '',
    setCustomAmount: vi.fn(),
    handleSelectTier: vi.fn(),
    orderType: 'coffee' as const,
    setOrderType: vi.fn(),
    donorName: 'Tester Kiệt Fan',
    setDonorName: vi.fn(),
    donorMessage: 'Keep up the good work!',
    setDonorMessage: vi.fn(),
    isLoading: false,
    errorMessage: null,
    calculateAmount: () => 50000,
    onPayWithVnpay: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<LanguageProvider>{ui}</LanguageProvider>)
  }

  it('renders nothing when isOpen is false', () => {
    const { container } = renderWithProviders(<DonateModal {...defaultProps} isOpen={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders modal with Vietcombank STK and MoMo SĐT accurately', () => {
    renderWithProviders(<DonateModal {...defaultProps} />)

    // Check Vietcombank STK presence
    expect(screen.getAllByText(/1034777451/).length).toBeGreaterThan(0)
    // Check recipient name
    expect(screen.getAllByText(/MAI ANH KIET/i).length).toBeGreaterThan(0)

    // Check tab navigation for MoMo
    const momoTab = screen.getByRole('button', { name: /Ví MoMo/i })
    expect(momoTab).toBeDefined()

    // Click MoMo tab
    fireEvent.click(momoTab)
    // Check MoMo phone number
    expect(screen.getAllByText(/0963463831/).length).toBeGreaterThan(0)
  })

  it('allows switching between preset tiers and custom amount', () => {
    renderWithProviders(<DonateModal {...defaultProps} />)

    const tier50k = screen.getByRole('button', { name: /50\.000/i })
    fireEvent.click(tier50k)
    expect(defaultProps.handleSelectTier).toHaveBeenCalledWith(50000)

    const tier200k = screen.getByRole('button', { name: /200\.000/i })
    fireEvent.click(tier200k)
    expect(defaultProps.handleSelectTier).toHaveBeenCalledWith(200000)
  })

  it('copies STK to clipboard on button click', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    })

    renderWithProviders(<DonateModal {...defaultProps} />)

    const copyBtn = screen.getByTitle('Sao chép số tài khoản')
    await act(async () => {
      fireEvent.click(copyBtn)
    })

    expect(writeTextMock).toHaveBeenCalledWith('1034777451')
  })
})
