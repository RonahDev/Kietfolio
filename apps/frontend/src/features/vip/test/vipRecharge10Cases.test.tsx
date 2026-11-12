import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VipUpgradeModal } from '../components/VipUpgradeModal'
import { LanguageProvider } from '@/context'
import { SITE_CONFIG } from '@/config/site'

// Mock useAuth
const mockOpenAuthModal = vi.fn()
const mockCloseVipModal = vi.fn()
const mockUpgradeToVip = vi.fn().mockResolvedValue(true)
let mockUser: any = null
let mockIsVip = false
let mockIsAdmin = false
let mockIsVipModalOpen = true

vi.mock('@/hooks', () => ({
  useAuth: () => ({
    user: mockUser,
    isVip: mockIsVip,
    isAdmin: mockIsAdmin,
    isVipModalOpen: mockIsVipModalOpen,
    openAuthModal: mockOpenAuthModal,
    closeVipModal: mockCloseVipModal,
    upgradeToVip: mockUpgradeToVip,
  }),
  useLanguage: () => ({ language: 'vi' }),
  useWhaleCinematic: () => ({ triggerWhaleCinematic: vi.fn() }),
}))

// Mock paymentApi
vi.mock('@/features/payment/api/paymentApi', () => ({
  paymentApi: {
    createVipPaymentUrl: vi.fn().mockResolvedValue({
      paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef=test_order',
      orderId: 'kiet_test_order_123',
    }),
  },
}))

describe('Frontend VIP Recharge & Subscription Checkout — 10 Comprehensive Testcases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = null
    mockIsVip = false
    mockIsAdmin = false
    mockIsVipModalOpen = true
  })

  const renderModal = () => {
    return render(
      <LanguageProvider>
        <VipUpgradeModal />
      </LanguageProvider>
    )
  }

  // TC-FE-VIP-01: Verifies all 4 VIP subscription tiers are rendered
  it('TC-FE-VIP-01: displays all 4 VIP subscription tiers with transparent pricing', () => {
    renderModal()
    expect(screen.getByText(/GÓI 1 THÁNG/i)).toBeDefined()
    expect(screen.getByText(/GÓI 3 THÁNG/i)).toBeDefined()
    expect(screen.getByText(/GÓI 1 NĂM \(VIP PRO\)/i)).toBeDefined()
    expect(screen.getByText(/VIP VĨNH VIỄN/i)).toBeDefined()
  })

  // TC-FE-VIP-02: Highlights Annual Plan with Best Seller badge
  it('TC-FE-VIP-02: highlights Annual VIP Plan as the best seller tier', () => {
    renderModal()
    expect(screen.getByText(/BÁN CHẠY NHẤT/i)).toBeDefined()
    expect(screen.getByText(/Tặng Huy hiệu VIP Vàng Ròng/i)).toBeDefined()
  })

  // TC-FE-VIP-03: Displays multi-channel payment options
  it('TC-FE-VIP-03: renders all 4 payment channels including VNPay QR', () => {
    renderModal()
    expect(screen.getByText(/Cổng VNPay QR/i)).toBeDefined()
    expect(screen.getByText(/VietQR Ngân Hàng/i)).toBeDefined()
    expect(screen.getByText(/Ví MoMo/i)).toBeDefined()
    expect(screen.getByText(/Mã Kích Hoạt \(Gift Code\)/i)).toBeDefined()
  })

  // TC-FE-VIP-04: Shows login reminder for unauthenticated users
  it('TC-FE-VIP-04: prompts unauthenticated guests to sign in before recharge', () => {
    mockUser = null
    renderModal()
    expect(screen.getByText(/Bạn chưa đăng nhập/i)).toBeDefined()
    expect(screen.getByText(/Đăng Nhập Ngay/i)).toBeDefined()
  })

  // TC-FE-VIP-05: Clicking login prompts Auth Modal
  it('TC-FE-VIP-05: clicking login button opens Auth Modal in signin mode', () => {
    mockUser = null
    renderModal()
    const loginBtn = screen.getByText(/Đăng Nhập Ngay/i)
    fireEvent.click(loginBtn)
    expect(mockOpenAuthModal).toHaveBeenCalledWith('signin')
  })

  // TC-FE-VIP-06: Shows active user email and regular member badge
  it('TC-FE-VIP-06: displays user email and member status badge when logged in', () => {
    mockUser = {
      uid: 'user_regular_123',
      email: 'member@company.com',
      displayName: 'Member Test',
      role: 'user',
    }
    renderModal()
    expect(screen.getByText(/member@company.com/i)).toBeDefined()
    expect(screen.getByText(/THÀNH VIÊN THƯỜNG/i)).toBeDefined()
  })

  // TC-FE-VIP-07: Switching to VietQR displays dynamic bank details
  it('TC-FE-VIP-07: switching to VietQR tab displays bank details and QR image', () => {
    renderModal()
    const vietQrTab = screen.getByText(/VietQR Ngân Hàng/i)
    fireEvent.click(vietQrTab)

    expect(screen.getByText(/Vietcombank \(VCB\)/i)).toBeDefined()
    expect(screen.getByText(SITE_CONFIG.donation.recipientName)).toBeDefined()
    expect(screen.getByAltText(/VietQR Vietcombank Nạp VIP/i)).toBeDefined()
  })

  // TC-FE-VIP-08: Switching to MoMo displays MoMo wallet transfer details
  it('TC-FE-VIP-08: switching to MoMo tab displays MoMo phone number and QR code', () => {
    renderModal()
    const momoTab = screen.getByText(/Ví MoMo/i)
    fireEvent.click(momoTab)

    expect(screen.getByText(/MoMo Transfer 24\/7/i)).toBeDefined()
    expect(screen.getByText(SITE_CONFIG.donation.momo.phone)).toBeDefined()
  })

  // TC-FE-VIP-09: Validates promo codes and activates VIP
  it('TC-FE-VIP-09: validates promo code submission and triggers VIP activation', async () => {
    mockUser = {
      uid: 'user_code_tester',
      email: 'code@test.com',
      role: 'user',
    }
    renderModal()
    const codeTab = screen.getByText(/Mã Kích Hoạt \(Gift Code\)/i)
    fireEvent.click(codeTab)

    const input = screen.getByPlaceholderText(/VD: KIETVIP2025/i)
    fireEvent.change(input, { target: { value: 'KIETVIP2025' } })

    const activateBtn = screen.getByText(/Kích Hoạt Mã/i)
    fireEvent.click(activateBtn)

    expect(mockUpgradeToVip).toHaveBeenCalled()
  })

  // TC-FE-VIP-10: 1-Click demo VIP activation triggers upgradeToVip
  it('TC-FE-VIP-10: supports 1-click sandbox demo VIP activation', async () => {
    mockUser = {
      uid: 'sandbox_user',
      email: 'sandbox@test.com',
      role: 'user',
    }
    renderModal()
    const demoBtn = screen.getByText(/KÍCH HOẠT THỬ NGHIỆM \(1-CLICK\)/i)
    fireEvent.click(demoBtn)

    expect(mockUpgradeToVip).toHaveBeenCalled()
  })
})
