import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { DonateModal } from './DonateModal'
import { LanguageProvider } from '@/context'
import { SITE_CONFIG } from '@/config/site'

describe('DonateModal QA & Vietcombank + MoMo Payment Flow Test Suite', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedTier: 50000 as const,
    customAmount: '50000',
    setCustomAmount: vi.fn(),
    handleSelectTier: vi.fn(),
    orderType: 'coffee' as const,
    setOrderType: vi.fn(),
    donorName: 'Tester Kiệt Fan',
    setDonorName: vi.fn(),
    donorMessage: 'Ủng hộ Kiệt phát triển dự án!',
    setDonorMessage: vi.fn(),
    isLoading: false,
    errorMessage: null,
    calculateAmount: () => 50000,
    onPayWithVnpay: vi.fn(),
  }

  let writeTextMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    })
  })

  const renderWithProviders = (props = defaultProps) => {
    return render(
      <LanguageProvider>
        <DonateModal {...props} />
      </LanguageProvider>
    )
  }

  // ==========================================
  // 1. MODAL LIFECYCLE & VISIBILITY
  // ==========================================
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <LanguageProvider>
        <DonateModal {...defaultProps} isOpen={false} />
      </LanguageProvider>
    )
    expect(container.firstChild).toBeNull()
  })

  it('triggers onClose when clicking close button or pressing ESC', () => {
    const onCloseMock = vi.fn()
    renderWithProviders({ ...defaultProps, onClose: onCloseMock })

    // Test ESC key
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCloseMock).toHaveBeenCalledTimes(1)

    // Test close button
    const closeBtn = screen.getByLabelText('Đóng cửa sổ')
    fireEvent.click(closeBtn)
    expect(onCloseMock).toHaveBeenCalledTimes(2)
  })

  // ==========================================
  // 2. VIETCOMBANK PAYMENT VERIFICATION
  // ==========================================
  describe('Vietcombank (VietQR) Payment Method', () => {
    it('displays accurate Vietcombank account details and recipient name', () => {
      renderWithProviders()

      // Verify recipient name MAI ANH KIET
      expect(screen.getAllByText(SITE_CONFIG.donation.recipientName).length).toBeGreaterThan(0)

      // Verify Vietcombank STK
      expect(screen.getAllByText(SITE_CONFIG.donation.vietcombank.accountNumber).length).toBeGreaterThan(0)

      // Verify bank label
      expect(screen.getByText('Vietcombank (VCB)')).toBeDefined()
    })

    it('generates correct dynamic VietQR URL with amount, bank code, and transfer content', () => {
      renderWithProviders()

      const qrImg = screen.getByAltText(/VietQR Vietcombank Mai Anh Kiệt/i) as HTMLImageElement
      expect(qrImg).toBeDefined()
      expect(qrImg.src).toContain(`vietcombank-${SITE_CONFIG.donation.vietcombank.accountNumber}-compact2.png`)
      expect(qrImg.src).toContain('amount=50000')
      expect(qrImg.src).toContain(encodeURIComponent('KIETFOLIO TESTER KIET FAN'))
    })

    it('copies Vietcombank STK to clipboard with feedback', async () => {
      renderWithProviders()

      const copyStkBtn = screen.getByTitle('Sao chép số tài khoản')
      await act(async () => {
        fireEvent.click(copyStkBtn)
      })

      expect(writeTextMock).toHaveBeenCalledWith(SITE_CONFIG.donation.vietcombank.accountNumber)
    })

    it('copies Vietcombank transfer note to clipboard', async () => {
      renderWithProviders()

      const copyNoteBtn = screen.getByTitle('Sao chép nội dung chuyển khoản')
      await act(async () => {
        fireEvent.click(copyNoteBtn)
      })

      expect(writeTextMock).toHaveBeenCalledWith('KIETFOLIO TESTER KIET FAN')
    })
  })

  // ==========================================
  // 3. MOMO PAYMENT VERIFICATION
  // ==========================================
  describe('MoMo Payment Method', () => {
    it('switches to MoMo tab and displays accurate phone number and recipient', () => {
      renderWithProviders()

      const momoTab = screen.getByRole('button', { name: /Ví MoMo/i })
      fireEvent.click(momoTab)

      // Verify MoMo phone number
      expect(screen.getAllByText(SITE_CONFIG.donation.momo.phone).length).toBeGreaterThan(0)
      // Verify recipient name
      expect(screen.getAllByText(SITE_CONFIG.donation.recipientName).length).toBeGreaterThan(0)
    })

    it('generates valid MoMo QR Code URL containing phone, amount, and message payload', () => {
      renderWithProviders()

      const momoTab = screen.getByRole('button', { name: /Ví MoMo/i })
      fireEvent.click(momoTab)

      const momoImg = screen.getByAltText(/Mã QR Ví MoMo Mai Anh Kiệt/i) as HTMLImageElement
      expect(momoImg).toBeDefined()
      expect(momoImg.src).toContain('api.qrserver.com/v1/create-qr-code')
      expect(decodeURIComponent(momoImg.src)).toContain(SITE_CONFIG.donation.momo.phone)
      expect(decodeURIComponent(momoImg.src)).toContain('50000')
    })

    it('copies MoMo phone number to clipboard', async () => {
      renderWithProviders()

      const momoTab = screen.getByRole('button', { name: /Ví MoMo/i })
      fireEvent.click(momoTab)

      const copyPhoneBtn = screen.getByTitle('Sao chép số điện thoại MoMo')
      await act(async () => {
        fireEvent.click(copyPhoneBtn)
      })

      expect(writeTextMock).toHaveBeenCalledWith(SITE_CONFIG.donation.momo.phone)
    })

    it('provides direct link to open MoMo app with phone number', () => {
      renderWithProviders()

      const momoTab = screen.getByRole('button', { name: /Ví MoMo/i })
      fireEvent.click(momoTab)

      const momoDeepLink = screen.getByRole('link', { name: /Mở App MoMo Chuyển Tiền Trực Tiếp/i })
      expect(momoDeepLink.getAttribute('href')).toBe(`https://nhantien.momo.vn/${SITE_CONFIG.donation.momo.phone}`)
      expect(momoDeepLink.getAttribute('target')).toBe('_blank')
    })
  })

  // ==========================================
  // 4. AMOUNT SELECTION & TRANSFER CONTENT SANITIZATION
  // ==========================================
  describe('Amount Selection & Sanitization', () => {
    it('allows selecting preset donation tiers (20k, 50k, 100k, 200k)', () => {
      renderWithProviders()

      const tier20k = screen.getByRole('button', { name: /20\.000/i })
      fireEvent.click(tier20k)
      expect(defaultProps.handleSelectTier).toHaveBeenCalledWith(20000)

      const tier100k = screen.getByRole('button', { name: /100\.000/i })
      fireEvent.click(tier100k)
      expect(defaultProps.handleSelectTier).toHaveBeenCalledWith(100000)
    })

    it('switches between Coffee and Mentorship presets with correct default amounts', () => {
      renderWithProviders()

      const coffeeBtn = screen.getByRole('button', { name: /Tách Cà Phê/i })
      fireEvent.click(coffeeBtn)
      expect(defaultProps.setOrderType).toHaveBeenCalledWith('coffee')
      expect(defaultProps.handleSelectTier).toHaveBeenCalledWith(50000)

      const mentorBtn = screen.getByRole('button', { name: /Tư Vấn 1-1/i })
      fireEvent.click(mentorBtn)
      expect(defaultProps.setOrderType).toHaveBeenCalledWith('mentorship')
      expect(defaultProps.handleSelectTier).toHaveBeenCalledWith(200000)
    })

    it('falls back to "KIETFOLIO BAN TOT" when donor name is empty', () => {
      renderWithProviders({ ...defaultProps, donorName: '' })

      expect(screen.getAllByText('KIETFOLIO BAN TOT').length).toBeGreaterThan(0)
    })

    it('sanitizes special characters and accents in donor name for banking transfer syntax', () => {
      renderWithProviders({ ...defaultProps, donorName: 'Nguyễn Văn A #1!' })

      // Sanitized: uppercase unaccented, special characters converted to single spaces
      expect(screen.getAllByText(/KIETFOLIO NGUYEN VAN A 1/).length).toBeGreaterThan(0)
    })
  })
})
