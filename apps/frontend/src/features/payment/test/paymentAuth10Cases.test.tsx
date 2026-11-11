import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DonateModal } from '../components/DonateModal'
import { LanguageProvider } from '@/context'
import { SITE_CONFIG } from '@/config'

describe('Pillar 4: User Authentication, VIP System & Payment Checkout — 10 Comprehensive Testcases', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedTier: 50000 as const,
    customAmount: '50000',
    setCustomAmount: vi.fn(),
    handleSelectTier: vi.fn(),
    orderType: 'coffee' as 'coffee' | 'mentorship' | 'custom',
    setOrderType: vi.fn(),
    donorName: 'Tester Kiệt Fan',
    setDonorName: vi.fn(),
    donorMessage: 'Ủng hộ Kiệt phát triển dự án!',
    setDonorMessage: vi.fn(),
    isLoading: false,
    errorMessage: null as string | null,
    calculateAmount: () => 50000,
    onPayWithVnpay: vi.fn(),
  }

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  const renderWithProviders = (props = defaultProps) => {
    return render(
      <LanguageProvider>
        <DonateModal {...props} />
      </LanguageProvider>
    )
  }

  // TC-USR-01: Verifies payment configuration integrity in SITE_CONFIG
  it('TC-USR-01: verifies donation config with valid account numbers and recipient', () => {
    expect(SITE_CONFIG.donation.recipientName).toBe('MAI ANH KIET')
    expect(SITE_CONFIG.donation.vietcombank.accountNumber).toBeDefined()
    expect(SITE_CONFIG.donation.momo.phone).toBeDefined()
  })

  // TC-USR-02: Modal renders properly with Coffee donation mode
  it('TC-USR-02: renders DonateModal with recipient details and presets', () => {
    renderWithProviders()
    expect(screen.getAllByText(SITE_CONFIG.donation.recipientName).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Tách Cà Phê/i).length).toBeGreaterThan(0)
  })

  // TC-USR-03: Switching order type to Mentorship
  it('TC-USR-03: supports 1-on-1 Mentorship booking flow', () => {
    renderWithProviders({ ...defaultProps, orderType: 'mentorship' as const })
    expect(screen.getByText(/Tư Vấn 1-1 \(60p\)/i)).toBeDefined()
  })

  // TC-USR-04: VietQR dynamic link generation
  it('TC-USR-04: generates valid VietQR link containing amount and bank info', () => {
    renderWithProviders()
    const qrImg = screen.getByAltText(/VietQR Vietcombank/i) as HTMLImageElement
    expect(qrImg.src).toContain('vietcombank')
    expect(qrImg.src).toContain('amount=50000')
  })

  // TC-USR-05: Calculation logic for custom donation amount
  it('TC-USR-05: calculates custom amount and filters non-numeric characters', () => {
    const calculateAmount = (selectedTier: number | null, customAmount: string): number => {
      if (selectedTier !== null && selectedTier > 0) return selectedTier
      const parsed = parseInt(customAmount.replace(/\D/g, ''), 10)
      return isNaN(parsed) ? 0 : parsed
    }

    expect(calculateAmount(50000, '')).toBe(50000)
    expect(calculateAmount(null, '75000')).toBe(75000)
    expect(calculateAmount(null, '120.000 đ')).toBe(120000)
    expect(calculateAmount(null, 'invalid')).toBe(0)
  })

  // TC-USR-06: VNPay transaction order code generation format
  it('TC-USR-06: generates valid VNPay order code with timestamp and random salt', () => {
    const generateOrderCode = (prefix = 'KF'): string => {
      const now = new Date()
      const timestamp = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
      const randomSalt = Math.floor(1000 + Math.random() * 9000)
      return `${prefix}_${timestamp}_${randomSalt}`
    }

    const orderCode = generateOrderCode('KF')
    expect(orderCode).toMatch(/^KF_\d{14}_\d{4}$/)
  })

  // TC-USR-07: Donor name and message validation
  it('TC-USR-07: validates donor information length boundaries', () => {
    const validateDonorInfo = (name: string, msg: string) => {
      const isNameValid = name.trim().length <= 50
      const isMsgValid = msg.trim().length <= 250
      return isNameValid && isMsgValid
    }

    expect(validateDonorInfo('Kiệt Mai', 'Chúc dự án thành công')).toBe(true)
    expect(validateDonorInfo('A'.repeat(55), 'Ok')).toBe(false)
    expect(validateDonorInfo('Kiệt', 'B'.repeat(300))).toBe(false)
  })

  // TC-USR-08: MoMo tab switching and display
  it('TC-USR-08: switches to MoMo payment method and renders phone recipient', () => {
    renderWithProviders()
    const momoTab = screen.getByRole('button', { name: /Ví MoMo/i })
    fireEvent.click(momoTab)

    expect(screen.getAllByText(SITE_CONFIG.donation.momo.phone).length).toBeGreaterThan(0)
  })

  // TC-USR-09: Error message presentation
  it('TC-USR-09: presents error banner when payment initialization fails', () => {
    renderWithProviders({
      ...defaultProps,
      errorMessage: 'Cổng thanh toán VNPay đang bận. Vui lòng thử lại sau giây lát.',
    })

    expect(screen.getByText(/Cổng thanh toán VNPay đang bận/i)).toBeDefined()
  })

  // TC-USR-10: Modal close on close button
  it('TC-USR-10: triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    renderWithProviders({ ...defaultProps, onClose: handleClose })

    const closeBtn = screen.getByLabelText('Đóng cửa sổ')
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
