import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react'
import React from 'react'

// Contexts, Hooks & Components for Core Feature Verification
import { LanguageProvider, PerformanceProvider } from '@/context'
import { useLanguage, usePerformance, useWhaleCinematic } from '@/hooks'
import { AuthProvider } from '@/features/auth'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ADMIN_EMAIL } from '@/features/auth/types/auth'
import { WhaleCinematicProvider } from '@/features/ocean-whale'
import { DonateModal } from '@/features/payment/components/DonateModal'
import { guestbookApi } from '@/features/guestbook/api/guestbookApi'
import { SITE_CONFIG } from '@/config'

/**
 * =========================================================================================
 * BỘ 5 TEST CASE KIỂM THỬ TỪNG CHỨC NĂNG CỐT LÕI (CORE ENTERPRISE QA TEST SUITE) - KIETFOLIO
 * =========================================================================================
 * TC-01: Chức năng Thanh Toán & Quyên Góp (Vietcombank QR, MoMo DeepLink, Clipboard)
 * TC-02: Chức năng Hiệu Ứng Cá Voi 3D & Quy Tắc Giới Hạn 1 Lần / Phiên (Whale Cinematic)
 * TC-03: Chức năng Sổ Lưu Bút Số & Luồng Dữ Liệu Thời Gian Thực (Guestbook Persistence)
 * TC-04: Chức năng Xác Thực & Phân Quyền Quản Trị Hệ Thống (Master Admin RBAC Clearance)
 * TC-05: Chức năng Đa Ngôn Ngữ & Bộ Điều Hòa Hiệu Năng Thích Ứng (Bilingual & Performance Engine)
 * =========================================================================================
 */

describe('Kietfolio Core Enterprise QA Test Suite (5 Core Feature Test Cases)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  // =======================================================================================
  // TEST CASE 1: THANH TOÁN & QUYÊN GÓP (VIETCOMBANK QR, MOMO DEEPLINK & CLIPBOARD)
  // =======================================================================================
  describe('TC-01: Payment & Donation Flow Verification', () => {
    let writeTextMock: ReturnType<typeof vi.fn>

    beforeEach(() => {
      writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })
    })

    it('TC-01-VCB-MOMO: executes full donation lifecycle across Vietcombank and MoMo payment channels', async () => {
      const onCloseMock = vi.fn()
      const calculateAmountMock = () => 50000

      let renderResult!: ReturnType<typeof render>
      act(() => {
        renderResult = render(
          <LanguageProvider>
            <DonateModal
              isOpen={true}
              onClose={onCloseMock}
              selectedTier={50000}
              customAmount="50000"
              setCustomAmount={vi.fn()}
              handleSelectTier={vi.fn()}
              orderType="coffee"
              setOrderType={vi.fn()}
              donorName="Tester Doanh Nghiệp"
              setDonorName={vi.fn()}
              donorMessage="Ủng hộ Kiệt phát triển Kietfolio!"
              setDonorMessage={vi.fn()}
              isLoading={false}
              errorMessage={null}
              calculateAmount={calculateAmountMock}
              onPayWithVnpay={vi.fn()}
            />
          </LanguageProvider>
        )
      })

      // 1. Kiểm tra hiển thị mặc định tab Vietcombank
      expect(screen.getAllByText(/vietcombank/i).length).toBeGreaterThan(0)
      const qrImage = screen.getByAltText(/VietQR Vietcombank/i) as HTMLImageElement
      expect(qrImage.src).toContain('vietqr.io')
      expect(qrImage.src).toContain(SITE_CONFIG.donation.vietcombank.accountNumber)

      // 2. Kiểm tra sao chép STK vào Clipboard
      const copyAccountBtn = screen.getByTitle('Sao chép số tài khoản')
      await act(async () => {
        fireEvent.click(copyAccountBtn)
      })
      expect(writeTextMock).toHaveBeenCalledWith(SITE_CONFIG.donation.vietcombank.accountNumber)

      // 3. Chuyển sang Tab MoMo
      const momoTabBtn = screen.getByRole('button', { name: /Ví MoMo/i })
      act(() => {
        fireEvent.click(momoTabBtn)
      })

      // Kiểm tra thông tin nhận tiền MoMo
      expect(screen.getAllByText(SITE_CONFIG.donation.momo.phone).length).toBeGreaterThan(0)
      const openMomoLink = screen.getByRole('link', { name: /Mở App MoMo Chuyển Tiền Trực Tiếp/i })
      expect(openMomoLink.getAttribute('href')).toBe(`https://nhantien.momo.vn/${SITE_CONFIG.donation.momo.phone}`)

      // 4. Nhấn phím Escape để đóng Modal quyên góp
      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' })
      })
      expect(onCloseMock).toHaveBeenCalled()

      // 5. Khi isOpen = false -> Modal biến mất hoàn toàn
      act(() => {
        renderResult.rerender(
          <LanguageProvider>
            <DonateModal
              isOpen={false}
              onClose={onCloseMock}
              selectedTier={50000}
              customAmount="50000"
              setCustomAmount={vi.fn()}
              handleSelectTier={vi.fn()}
              orderType="coffee"
              setOrderType={vi.fn()}
              donorName=""
              setDonorName={vi.fn()}
              donorMessage=""
              setDonorMessage={vi.fn()}
              isLoading={false}
              errorMessage={null}
              calculateAmount={calculateAmountMock}
              onPayWithVnpay={vi.fn()}
            />
          </LanguageProvider>
        )
      })
      expect(screen.queryByText(/vietcombank/i)).toBeNull()
    })
  })

  // =======================================================================================
  // TEST CASE 2: HIỆU ỨNG 3D CÁ VOI & QUY TẮC GIỚI HẠN 1 LẦN / PHIÊN (WHALE CINEMATIC)
  // =======================================================================================
  describe('TC-02: Ocean Whale 3D Cinematic & 1-Time Session Rule', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const WhaleConsumer: React.FC = () => {
      const { isCinematicActive, hasPlayed, triggerWhaleCinematic, skipWhaleCinematic } = useWhaleCinematic()
      return (
        <div>
          <span data-testid="status">{isCinematicActive ? 'ACTIVE' : 'IDLE'}</span>
          <span data-testid="played">{hasPlayed ? 'PLAYED' : 'UNPLAYED'}</span>
          <button onClick={() => triggerWhaleCinematic(false)} data-testid="trigger-normal">
            Normal Trigger
          </button>
          <button onClick={() => triggerWhaleCinematic(true)} data-testid="trigger-force">
            Force Trigger (Login)
          </button>
          <button onClick={skipWhaleCinematic} data-testid="skip">
            Skip
          </button>
        </div>
      )
    }

    it('TC-02-WHALE-SESSION: enforces 1-time playback rule, prevents repeated triggers, and allows force-breach', () => {
      render(
        <WhaleCinematicProvider>
          <WhaleConsumer />
        </WhaleCinematicProvider>
      )

      // 1. Trạng thái ban đầu: IDLE & UNPLAYED
      expect(screen.getByTestId('status').textContent).toBe('IDLE')
      expect(screen.getByTestId('played').textContent).toBe('UNPLAYED')

      // 2. Kích hoạt lần đầu: Chuyển sang ACTIVE & PLAYED
      act(() => {
        fireEvent.click(screen.getByTestId('trigger-normal'))
      })
      expect(screen.getByTestId('status').textContent).toBe('ACTIVE')
      expect(screen.getByTestId('played').textContent).toBe('PLAYED')

      // 3. Hết thời gian cinematic (4500ms): Tự động về IDLE
      act(() => {
        vi.advanceTimersByTime(4500)
      })
      expect(screen.getByTestId('status').textContent).toBe('IDLE')
      expect(screen.getByTestId('played').textContent).toBe('PLAYED')

      // 4. Kích hoạt lại lần 2 (người dùng click tiếp): Bị chặn tuyệt đối để không làm phiền người dùng
      act(() => {
        fireEvent.click(screen.getByTestId('trigger-normal'))
      })
      expect(screen.getByTestId('status').textContent).toBe('IDLE') // Vẫn ở IDLE!

      // 5. Khi người dùng đăng nhập thành công (kích hoạt có force=true): Cho phép nhảy ăn mừng
      act(() => {
        fireEvent.click(screen.getByTestId('trigger-force'))
      })
      expect(screen.getByTestId('status').textContent).toBe('ACTIVE')

      // 6. Cho phép bấm Skip để đóng nhanh
      act(() => {
        fireEvent.click(screen.getByTestId('skip'))
      })
      expect(screen.getByTestId('status').textContent).toBe('IDLE')
    })
  })

  // =======================================================================================
  // TEST CASE 3: SỔ LƯU BÚT SỐ & DỮ LIỆU THỜI GIAN THỰC (GUESTBOOK REAL-TIME PERSISTENCE)
  // =======================================================================================
  describe('TC-03: Guestbook Real-time Data Flow & Author Verification', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    it('TC-03-GUESTBOOK-POST: reads entries and persists new guestbook submission with verification badge', async () => {
      // 1. Lấy danh sách lưu bút ban đầu
      const initialEntries = await guestbookApi.getEntries()
      expect(initialEntries.length).toBeGreaterThanOrEqual(2)
      expect(initialEntries[0]).toHaveProperty('message')
      expect(initialEntries[0]).toHaveProperty('isVerifiedGoogle')

      // 2. Gửi một lời nhắn lưu bút mới
      const newEntryPayload = {
        uid: `qa-user-${Date.now()}`,
        name: 'Kỹ Sư Kiểm Thử Doanh Nghiệp',
        email: 'qa.engineer@enterprise.vn',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=QA',
        message: 'Trang web phản hồi cực nhanh, luồng xử lý dữ liệu chuẩn chỉ!',
        role: 'visitor' as const,
        isVerifiedGoogle: true,
      }

      const createdEntry = await guestbookApi.createEntry(newEntryPayload)

      // 3. Kiểm định thông tin bản ghi được tạo
      expect(createdEntry.id).toBeDefined()
      expect(createdEntry.name).toBe('Kỹ Sư Kiểm Thử Doanh Nghiệp')
      expect(createdEntry.message).toBe('Trang web phản hồi cực nhanh, luồng xử lý dữ liệu chuẩn chỉ!')
      expect(createdEntry.isVerifiedGoogle).toBe(true)

      // 4. Lấy lại danh sách để đảm bảo bản ghi mới đã được cập nhật lên đầu danh sách
      const updatedEntries = await guestbookApi.getEntries()
      expect(updatedEntries[0].name).toBe('Kỹ Sư Kiểm Thử Doanh Nghiệp')
    })
  })

  // =======================================================================================
  // TEST CASE 4: XÁC THỰC & PHÂN QUYỀN QUẢN TRỊ (AUTHENTICATION & MASTER ADMIN RBAC)
  // =======================================================================================
  describe('TC-04: Authentication & Master Admin RBAC Clearance', () => {
    const authWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    it('TC-04-AUTH-RBAC: correctly assigns Member role for standard visitors and ROOT ADMIN for Kiệt', () => {
      const { result } = renderHook(() => useAuth(), { wrapper: authWrapper })

      // 1. Trạng thái chưa đăng nhập (Khách vãng lai)
      expect(result.current.user).toBeNull()
      expect(result.current.isAdmin).toBe(false)

      // 2. Đăng nhập với tư cách Người dùng / Thành viên bình thường
      act(() => {
        result.current.signInDemo(false)
      })
      expect(result.current.user).not.toBeNull()
      expect(result.current.user?.role).toBe('member')
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.user?.email).not.toBe(ADMIN_EMAIL)

      // 3. Đăng xuất khỏi hệ thống
      act(() => {
        result.current.signOutUser()
      })
      expect(result.current.user).toBeNull()
      expect(result.current.isAdmin).toBe(false)

      // 4. Đăng nhập với tài khoản chính chủ của Mai Anh Kiệt (kietteve22102005@gmail.com)
      act(() => {
        result.current.signInDemo(true)
      })
      expect(result.current.user).not.toBeNull()
      expect(result.current.user?.email).toBe(ADMIN_EMAIL)
      expect(result.current.user?.role).toBe('admin')
      expect(result.current.isAdmin).toBe(true) // Được cấp quyền Quản trị tối cao (Root Admin)
    })
  })

  // =======================================================================================
  // TEST CASE 5: ĐA NGÔN NGỮ & BỘ ĐIỀU HÒA HIỆU NĂNG THÍCH ỨNG (BILINGUAL & PERFORMANCE ENGINE)
  // =======================================================================================
  describe('TC-05: Multi-language & Adaptive Performance Mode', () => {
    it('TC-05-LANG-PERF: seamlessly switches languages and toggles Eco Power Saver performance tier', () => {
      const combinedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <LanguageProvider>
          <PerformanceProvider>{children}</PerformanceProvider>
        </LanguageProvider>
      )

      const { result } = renderHook(
        () => ({
          lang: useLanguage(),
          perf: usePerformance(),
        }),
        { wrapper: combinedWrapper }
      )

      // 1. Kiểm tra chuyển đổi đa ngôn ngữ (EN <-> VI)
      act(() => {
        result.current.lang.setLanguage('vi')
      })
      expect(result.current.lang.language).toBe('vi')
      expect(result.current.lang.t.nav.about).toBe('Giới thiệu')
      expect(localStorage.getItem('kietfolio_lang_preference')).toBe('vi')

      act(() => {
        result.current.lang.setLanguage('en')
      })
      expect(result.current.lang.language).toBe('en')
      expect(result.current.lang.t.nav.about).toBe('About')
      expect(localStorage.getItem('kietfolio_lang_preference')).toBe('en')

      // 2. Kiểm tra điều hòa hiệu năng & Chế độ tiết kiệm pin (Power Saver / Low tier)
      act(() => {
        result.current.perf.setQualityMode('low')
      })
      expect(result.current.perf.qualityMode).toBe('low')
      expect(result.current.perf.tier).toBe('low')
      expect(localStorage.getItem('kietfolio_perf_quality_mode')).toBe('low')
      // Đảm bảo DOM root được kích hoạt class perf-low để CSS tự động ngắt blur/aurora
      expect(document.documentElement.classList.contains('perf-low')).toBe(true)

      // 3. Chuyển lại về chế độ Tự Động (Auto-adaptive)
      act(() => {
        result.current.perf.setQualityMode('auto')
      })
      expect(result.current.perf.qualityMode).toBe('auto')
      expect(localStorage.getItem('kietfolio_perf_quality_mode')).toBe('auto')
    })
  })
})
