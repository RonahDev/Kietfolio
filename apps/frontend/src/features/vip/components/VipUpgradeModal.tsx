import React, { useState } from 'react'
import { useAuth, useLanguage, useWhaleCinematic } from '@/hooks'
import { SITE_CONFIG } from '@/config/site'
import { paymentApi, type VipPlanTier } from '@/features/payment/api/paymentApi'
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Flame,
  Award,
  Layers,
  CreditCard,
  QrCode,
  AlertCircle,
  Calendar,
  Lock,
} from 'lucide-react'

export const VipUpgradeModal: React.FC = () => {
  const { user, isVip, isAdmin, isVipModalOpen, closeVipModal, upgradeToVip, openAuthModal } = useAuth()
  const { language } = useLanguage()
  const { triggerWhaleCinematic } = useWhaleCinematic()

  const [selectedPlan, setSelectedPlan] = useState<VipPlanTier>('annual')
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'vietqr' | 'momo' | 'code'>('vnpay')
  const [promoCode, setPromoCode] = useState<string>('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<string | null>(null)
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false)
  const [isVnpayLoading, setIsVnpayLoading] = useState<boolean>(false)
  const [vnpayError, setVnpayError] = useState<string | null>(null)
  const [upgradeSuccess, setUpgradeSuccess] = useState<boolean>(false)

  if (!isVipModalOpen) return null

  // Plan pricing lookup
  const planPrices: Record<VipPlanTier, number> = {
    monthly: SITE_CONFIG.vip.priceMonthly || 99000,
    quarterly: SITE_CONFIG.vip.priceQuarterly || 249000,
    annual: SITE_CONFIG.vip.priceAnnual || 699000,
    lifetime: SITE_CONFIG.vip.priceLifetime || 499000,
  }

  const amount = planPrices[selectedPlan] || 99000
  const planSuffix =
    selectedPlan === 'lifetime'
      ? 'LIFETIME'
      : selectedPlan === 'annual'
      ? '1Y'
      : selectedPlan === 'quarterly'
      ? '3M'
      : '1M'
  const userIdentifier = user?.email?.split('@')[0] || 'KHACH'
  const transferContent = `VIP ${userIdentifier} ${planSuffix}`.toUpperCase()

  const vietQrUrl = `https://img.vietqr.io/image/vietcombank-${SITE_CONFIG.donation.vietcombank.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(SITE_CONFIG.donation.recipientName)}`

  const momoQrPayload = `2|99|${SITE_CONFIG.donation.momo.phone}|${SITE_CONFIG.donation.recipientName}||0|0|${amount}|${transferContent}|transfer_myqr`
  const momoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    momoQrPayload
  )}`

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(label)
      setTimeout(() => setIsCopied(null), 2000)
    } catch {
      // ignore
    }
  }

  // 1. Online Automated VNPay Checkout
  const handleVnpayCheckout = async () => {
    if (!user) {
      openAuthModal('signin')
      return
    }

    setIsVnpayLoading(true)
    setVnpayError(null)

    try {
      const { paymentUrl } = await paymentApi.createVipPaymentUrl(selectedPlan, user)
      window.location.href = paymentUrl
    } catch (err) {
      setVnpayError(
        err instanceof Error
          ? err.message
          : 'Không thể kết nối cổng thanh toán VNPay QR. Vui lòng thử phương thức khác.'
      )
    } finally {
      setIsVnpayLoading(false)
    }
  }

  // 2. Demo Instant 1-Click Activation
  const handleInstantActivation = async () => {
    if (!user) {
      openAuthModal('signin')
      return
    }
    setIsUpgrading(true)
    await upgradeToVip(selectedPlan)
    setIsUpgrading(false)
    setUpgradeSuccess(true)
    triggerWhaleCinematic()
  }

  // 3. Promo / Gift Code Activation
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCodeError(null)
    const validCodes = SITE_CONFIG.vip.promoCodes
    const cleaned = promoCode.trim().toUpperCase()

    if (validCodes.includes(cleaned)) {
      handleInstantActivation()
    } else {
      setCodeError(`Mã ưu đãi không hợp lệ. Hãy thử: ${validCodes.slice(0, 2).join(' hoặc ')}`)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#050a14]/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vip-modal-title"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl bg-[#0a1224] border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden font-mono">
        {/* Amber lightning top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#172847] bg-[#070d18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="vip-modal-title" className="text-base sm:text-lg font-bold text-[#f1f5f9] tracking-tight">
                  {language === 'vi' ? 'NẠP TIỀN & MUA GÓI HỘI VIÊN VIP' : 'SUBSCRIBE & UPGRADE TO VIP'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  PREMIUM 4K
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                {language === 'vi'
                  ? 'Mở khóa toàn bộ phim 4K Ultra HD, Dolby Atmos, hệ thống rạp chiếu và Blueprints dự án'
                  : 'Unlock full 4K Ultra HD movies, Dolby Atmos, high-speed streaming & system blueprints'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeVipModal}
            className="p-1.5 rounded-lg border border-[#172847] bg-[#0f1b33] text-[#94a3b8] hover:text-[#f1f5f9] hover:border-amber-500/50 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* User Status Bar */}
          <div className="p-3.5 rounded-xl bg-[#070d18] border border-[#172847] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              {user ? (
                <span>
                  Tài khoản: <strong className="text-white">{user.email}</strong>
                  {isAdmin ? (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-[10px]">
                      ROOT ADMIN
                    </span>
                  ) : isVip ? (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                      HỘI VIÊN VIP
                    </span>
                  ) : (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      THÀNH VIÊN THƯỜNG
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Bạn chưa đăng nhập. Hãy đăng nhập để lưu quyền VIP vào tài khoản cá nhân!
                </span>
              )}
            </div>

            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="px-3 py-1 rounded-md bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-bold text-[11px] cursor-pointer transition-all"
              >
                Đăng Nhập Ngay
              </button>
            ) : user.vipExpiresAt ? (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Hạn VIP hiện tại: <strong className="text-amber-300">{new Date(user.vipExpiresAt).toLocaleDateString('vi-VN')}</strong> (Gia hạn sẽ cộng dồn)
              </span>
            ) : isVip ? (
              <span className="text-[11px] text-amber-300 font-bold">
                Quyền VIP Trọn Đời (Lifetime) Không Giới Hạn
              </span>
            ) : null}
          </div>

          {/* Success Banner if upgraded */}
          {upgradeSuccess || (isVip && !upgradeSuccess && !isAdmin) ? (
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#0a1224] to-amber-500/15 border border-amber-400/50 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <Crown className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-300">
                  CHÚC MỪNG BẠN ĐÃ LÀ HỘI VIÊN VIP HOÀNG KIM!
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 max-w-lg mx-auto">
                  Toàn bộ đặc quyền phim 4K Ultra HD, Dolby Atmos, server stream VIP và Blueprints dự án đã được kích hoạt trên tài khoản của bạn.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeVipModal()
                    triggerWhaleCinematic()
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#050a14] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>KÍCH HOẠT VŨ ĐIỆU CÁ VOI VIP</span>
                </button>
                <button
                  type="button"
                  onClick={closeVipModal}
                  className="px-4 py-2 rounded-lg border border-amber-500/40 bg-[#070d18] text-amber-300 hover:bg-[#0f1b33] text-xs font-semibold cursor-pointer"
                >
                  BẮT ĐẦU TRẢI NGHIỆM
                </button>
              </div>
            </div>
          ) : null}

          {/* Section 1: Choose Subscription Plan (4 distinct options) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>BƯỚC 1: CHỌN GÓI HỘI VIÊN VIP PHÙ HỢP:</span>
              </label>
              <span className="text-[10px] text-amber-400 font-semibold">TỰ ĐỘNG CỘNG DỒN HẠN DÙNG</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Plan 1: 1 Month */}
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === 'monthly'
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                    : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white hover:border-[#23385e]'
                }`}
              >
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trải Nghiệm</div>
                  <div className="text-sm font-bold text-white mt-0.5">GÓI 1 THÁNG</div>
                  <div className="text-base font-extrabold text-amber-300 mt-2">
                    {planPrices.monthly.toLocaleString('vi-VN')}₫
                  </div>
                  <div className="text-[10px] text-slate-400">Thời hạn: 30 Ngày</div>
                </div>
                <ul className="mt-3 space-y-1.5 text-[10px] text-slate-300 border-t border-[#172847] pt-2">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Xem full kho phim 4K UHD</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Server VIP không quảng cáo</span>
                  </li>
                </ul>
              </button>

              {/* Plan 2: 3 Months */}
              <button
                type="button"
                onClick={() => setSelectedPlan('quarterly')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === 'quarterly'
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                    : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white hover:border-[#23385e]'
                }`}
              >
                <div className="absolute -top-2 right-2 px-1.5 py-0.2 bg-emerald-500 text-white text-[8px] font-bold rounded-full">
                  TIẾT KIỆM 16%
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Phổ Biến</div>
                  <div className="text-sm font-bold text-white mt-0.5">GÓI 3 THÁNG</div>
                  <div className="text-base font-extrabold text-amber-300 mt-2">
                    {planPrices.quarterly.toLocaleString('vi-VN')}₫
                  </div>
                  <div className="text-[10px] text-slate-400">~83.000₫ / tháng (90 Ngày)</div>
                </div>
                <ul className="mt-3 space-y-1.5 text-[10px] text-slate-300 border-t border-[#172847] pt-2">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Âm thanh Dolby Atmos</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Mở khóa toàn bộ Blueprints</span>
                  </li>
                </ul>
              </button>

              {/* Plan 3: 1 Year (POPULAR) */}
              <button
                type="button"
                onClick={() => setSelectedPlan('annual')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === 'annual'
                    ? 'border-amber-400 bg-gradient-to-b from-amber-500/25 to-[#070d18] text-white shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-2 ring-amber-400'
                    : 'border-amber-500/40 bg-[#070d18] text-slate-300 hover:border-amber-400'
                }`}
              >
                <div className="absolute -top-2.5 right-2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-amber-500 text-white text-[8px] font-bold rounded-full flex items-center gap-1 shadow-md">
                  <Flame className="w-2.5 h-2.5" />
                  BÁN CHẠY NHẤT
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Ưu Đãi Lớn (41%)</div>
                  <div className="text-sm font-bold text-amber-300 mt-0.5 flex items-center gap-1">
                    <span>GÓI 1 NĂM (VIP PRO)</span>
                  </div>
                  <div className="text-base font-extrabold text-amber-300 mt-2">
                    {planPrices.annual.toLocaleString('vi-VN')}₫
                  </div>
                  <div className="text-[10px] text-slate-400">Chỉ ~58.000₫ / tháng (365 Ngày)</div>
                </div>
                <ul className="mt-3 space-y-1.5 text-[10px] text-slate-200 border-t border-[#172847] pt-2">
                  <li className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="font-bold text-amber-300">Tặng Huy hiệu VIP Vàng Ròng</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Kênh ưu tiên hỗ trợ 24/7</span>
                  </li>
                </ul>
              </button>

              {/* Plan 4: Lifetime Founder */}
              <button
                type="button"
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === 'lifetime'
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                    : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white hover:border-[#23385e]'
                }`}
              >
                <div className="absolute -top-2 right-2 px-1.5 py-0.2 bg-purple-600 text-white text-[8px] font-bold rounded-full">
                  FOUNDER
                </div>
                <div>
                  <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Trọn Đời</div>
                  <div className="text-sm font-bold text-white mt-0.5">VIP VĨNH VIỄN</div>
                  <div className="text-base font-extrabold text-amber-300 mt-2">
                    {planPrices.lifetime.toLocaleString('vi-VN')}₫
                  </div>
                  <div className="text-[10px] text-purple-300">Không bao giờ hết hạn</div>
                </div>
                <ul className="mt-3 space-y-1.5 text-[10px] text-slate-300 border-t border-[#172847] pt-2">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Sở hữu trọn đời vĩnh viễn</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Ghi danh bảng Supporter</span>
                  </li>
                </ul>
              </button>
            </div>
          </div>

          {/* Section 2: Choose Payment Method */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                BƯỚC 2: PHƯƠNG THỨC NẠP TIỀN & THANH TOÁN:
              </label>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vnpay')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border flex items-center gap-1.5 transition-all ${
                    paymentMethod === 'vnpay'
                      ? 'border-[#00d2ff] bg-[#00d2ff]/20 text-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                      : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>Cổng VNPay QR (Khuyên Dùng)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border flex items-center gap-1.5 transition-all ${
                    paymentMethod === 'vietqr'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VietQR Ngân Hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border flex items-center gap-1.5 transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-pink-500 bg-pink-950/40 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.25)]'
                      : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Ví MoMo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('code')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border flex items-center gap-1.5 transition-all ${
                    paymentMethod === 'code'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Mã Kích Hoạt (Gift Code)</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Online Automated VNPay QR Checkout (Recommended) */}
            {paymentMethod === 'vnpay' && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#00d2ff]/10 via-[#0a152e] to-[#00d2ff]/10 border border-[#00d2ff]/40 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/20 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff]">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>THANH TOÁN TRỰC TUYẾN TỰ ĐỘNG QUA VNPAY QR</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                            TỰ ĐỘNG 100%
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          Hỗ trợ quét mã bằng hơn 40+ ứng dụng ngân hàng tại Việt Nam (VCB, MB, BIDV, Techcombank, ACB, Agribank...) và thẻ ATM / Visa / Mastercard.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 text-xs font-mono text-slate-300 space-y-1">
                      <div>Gói đã chọn: <strong className="text-amber-300 uppercase">{selectedPlan}</strong></div>
                      <div>Số tiền cần thanh toán: <strong className="text-[#00d2ff] text-base">{amount.toLocaleString('vi-VN')} VNĐ</strong></div>
                      <div className="text-[10px] text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Kích hoạt quyền VIP tự động ngay sau khi quét mã thành công. Không cần chờ duyệt!</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      disabled={isVnpayLoading}
                      onClick={handleVnpayCheckout}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#38bdf8] hover:from-[#38bdf8] hover:to-[#00d2ff] text-[#050a14] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all"
                    >
                      {isVnpayLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#050a14] border-t-transparent rounded-full animate-spin" />
                          <span>Đang Chuyển Đến VNPay...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>NẠP TIỀN QUA VNPAY ({amount.toLocaleString('vi-VN')}₫)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {vnpayError && (
                  <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{vnpayError}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VietQR Bank Transfer */}
            {paymentMethod === 'vietqr' && (
              <div className="p-4 rounded-xl bg-[#070d18] border border-emerald-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2 rounded-lg bg-white shrink-0 shadow-md">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Vietcombank Nạp VIP"
                      className="w-36 h-36 object-contain rounded"
                    />
                    <div className="text-[8px] font-mono text-slate-800 text-center font-bold mt-1">
                      QUÉT APP BANK 24/7
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-xs w-full">
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Ngân hàng:</span>
                      <span className="text-emerald-400 font-bold">Vietcombank (VCB)</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Chủ tài khoản:</span>
                      <span className="text-white font-bold">{SITE_CONFIG.donation.recipientName}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#00d2ff] font-bold text-sm tracking-wider">
                          {SITE_CONFIG.donation.vietcombank.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(SITE_CONFIG.donation.vietcombank.accountNumber, 'stk')}
                          className="p-1 rounded bg-[#0f1b33] text-slate-300 hover:text-white cursor-pointer"
                          title="Sao chép STK"
                        >
                          {isCopied === 'stk' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Số tiền nạp:</span>
                      <span className="text-amber-300 font-bold text-sm">{amount.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Nội dung CK:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold truncate max-w-[130px] sm:max-w-[200px]">
                          {transferContent}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(transferContent, 'note')}
                          className="p-1 rounded bg-[#0f1b33] text-slate-300 hover:text-white cursor-pointer"
                          title="Sao chép nội dung"
                        >
                          {isCopied === 'note' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#172847]">
                  <p className="text-[11px] text-slate-400">
                    Sau khi quét mã hoặc chuyển khoản đúng nội dung, bạn có thể bấm xác nhận để kích hoạt nhanh:
                  </p>
                  <button
                    type="button"
                    onClick={handleInstantActivation}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#050a14] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tôi Đã Chuyển Khoản & Kích Hoạt VIP</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: MoMo Wallet */}
            {paymentMethod === 'momo' && (
              <div className="p-4 rounded-xl bg-[#070d18] border border-pink-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2 rounded-lg bg-white shrink-0 shadow-md">
                    <img
                      src={momoQrUrl}
                      alt="MoMo Nạp VIP"
                      className="w-36 h-36 object-contain rounded"
                    />
                    <div className="text-[8px] font-mono text-slate-800 text-center font-bold mt-1">
                      QUÉT VÍ MOMO
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-xs w-full">
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Ví điện tử:</span>
                      <span className="text-pink-400 font-bold">MoMo Transfer 24/7</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Chủ ví:</span>
                      <span className="text-white font-bold">{SITE_CONFIG.donation.recipientName}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Số điện thoại:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-pink-400 font-bold text-sm">
                          {SITE_CONFIG.donation.momo.phone}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(SITE_CONFIG.donation.momo.phone, 'momo')}
                          className="p-1 rounded bg-[#0f1b33] text-slate-300 hover:text-white cursor-pointer"
                        >
                          {isCopied === 'momo' ? <Check className="w-3 h-3 text-pink-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Số tiền:</span>
                      <span className="text-amber-300 font-bold">{amount.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#172847]">
                  <p className="text-[11px] text-slate-400">
                    Sau khi chuyển tiền qua ví MoMo thành công, bấm nút bên phải để hoàn tất:
                  </p>
                  <button
                    type="button"
                    onClick={handleInstantActivation}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận MoMo & Kích Hoạt VIP</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: Promo / Activation Code */}
            {paymentMethod === 'code' && (
              <form onSubmit={handlePromoSubmit} className="p-4 rounded-xl bg-[#070d18] border border-amber-500/30 space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    NHẬP MÃ KÍCH HOẠT VIP (PROMO / GIFT CODE):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="VD: KIETVIP2025 hoặc CYBERVIP..."
                      className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#0a1224] border border-[#172847] text-white text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#050a14] font-bold text-xs cursor-pointer shadow-sm transition-all"
                    >
                      Kích Hoạt Mã
                    </button>
                  </div>
                  {codeError && (
                    <p className="text-[11px] text-red-400 mt-1.5">{codeError}</p>
                  )}
                  <p className="text-[10px] text-[#64748b] mt-2">
                    Mã ưu đãi đối tác: <strong className="text-amber-300">{SITE_CONFIG.vip.promoCodes[0] || 'KIETVIP2025'}</strong> hoặc <strong className="text-amber-300">{SITE_CONFIG.vip.promoCodes[1] || 'CYBERVIP'}</strong>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Quick 1-Click Sandbox Demo Activation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#0c182e] to-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>CHẾ ĐỘ THỬ NGHIỆM VIP TỨC THÌ (DEMO ACTIVATION)</span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Bấm nút dưới đây để kích hoạt và thử nghiệm ngay mọi đặc quyền VIP trên website mà không cần thanh toán thực tế!
              </p>
            </div>

            <button
              type="button"
              disabled={isUpgrading}
              onClick={handleInstantActivation}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#050a14] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all shrink-0"
            >
              <Crown className="w-4 h-4" />
              <span>{isUpgrading ? 'ĐANG KÍCH HOẠT...' : 'KÍCH HOẠT THỬ NGHIỆM (1-CLICK)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#172847] bg-[#070d18] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748b]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kietfolio Secure Payment • Powered by VNPay, Vietcombank & MoMo</span>
          </div>
          <button
            type="button"
            onClick={closeVipModal}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  )
}
