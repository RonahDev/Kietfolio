import React, { useState } from 'react'
import { useAuth, useLanguage, useWhaleCinematic } from '@/hooks'
import { SITE_CONFIG } from '@/config/site'
import {
  X,
  Crown,
  Shield,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Flame,
  Award,
  Layers,
} from 'lucide-react'

export const VipUpgradeModal: React.FC = () => {
  const { user, isVip, isAdmin, isVipModalOpen, closeVipModal, upgradeToVip, openAuthModal } = useAuth()
  const { language } = useLanguage()
  const { triggerWhaleCinematic } = useWhaleCinematic()

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime')
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'momo' | 'code'>('vietqr')
  const [promoCode, setPromoCode] = useState<string>('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<string | null>(null)
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState<boolean>(false)

  if (!isVipModalOpen) return null

  const amount = selectedPlan === 'lifetime' ? SITE_CONFIG.vip.priceLifetime : SITE_CONFIG.vip.priceMonthly
  const transferContent = `VIP ${user?.email?.split('@')[0] || 'KHACH'} ${selectedPlan === 'lifetime' ? 'LIFETIME' : '1M'}`.toUpperCase()

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

  const handleInstantActivation = async () => {
    if (!user) {
      openAuthModal('signin')
      return
    }
    setIsUpgrading(true)
    await upgradeToVip(selectedPlan)
    setIsUpgrading(false)
    setUpgradeSuccess(true)
  }

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
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-xl bg-[#0a1224] border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden font-mono">
        {/* Amber lightning top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#172847] bg-[#070d18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="vip-modal-title" className="text-base sm:text-lg font-bold text-[#f1f5f9] tracking-tight">
                  {language === 'vi' ? 'NÂNG CẤP TÀI KHOẢN VIP' : 'UPGRADE TO VIP PARTNER'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  PREMIUM
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                {language === 'vi'
                  ? 'Mở khóa đặc quyền kinh doanh, kiến trúc dự án và hỗ trợ ưu tiên'
                  : 'Unlock business privileges, system blueprints, and priority channel'}
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Success Banner if upgraded */}
          {upgradeSuccess || (isVip && !upgradeSuccess) ? (
            <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#0a1224] to-amber-500/15 border border-amber-400/50 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <Crown className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-300">
                  {isAdmin
                    ? 'BẠN ĐANG SỞ HỮU QUYỀN HẠN CAO NHẤT (ROOT ADMIN)'
                    : 'CHÚC MỪNG BẠN ĐÃ LÀ TÀI KHOẢN VIP HOÀNG KIM!'}
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 max-w-lg mx-auto">
                  {isAdmin
                    ? 'Với tư cách Quản trị viên, bạn tự động có mọi đặc quyền VIP và toàn quyền điều hành hệ thống.'
                    : 'Tài khoản của bạn đã được nâng cấp thành công. Toàn bộ tính năng cao cấp, blueprints dự án và kênh hỗ trợ ưu tiên đã được kích hoạt.'}
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

          {/* 3 Account Types Comparison Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>PHÂN CẤP 3 DẠNG TÀI KHOẢN HỆ THỐNG</span>
              </h3>
              <span className="text-[10px] text-[#64748b]">KIETFOLIO ACCESS MATRIX</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tier 1: Normal Account (Member) */}
              <div className={`p-4 rounded-xl border transition-all ${
                user && !isVip && !isAdmin
                  ? 'border-[#00d2ff]/40 bg-[#070d18] shadow-[0_0_15px_rgba(0,210,255,0.1)]'
                  : 'border-[#172847] bg-[#070d18]/70'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">TÀI KHOẢN THƯỜNG</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-slate-800 text-slate-400">FREE</span>
                </div>
                <div className="text-lg font-bold text-[#f1f5f9] mb-3">0₫</div>
                <ul className="space-y-2 text-[11px] text-[#94a3b8]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>Xem portfolio và hồ sơ năng lực</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>Gửi liên hệ và để lại lời nhắn cơ bản</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>Trải nghiệm Three.js / Animation</span>
                  </li>
                </ul>
              </div>

              {/* Tier 2: VIP Account (Highlighted) */}
              <div className="p-4 rounded-xl border border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-[#0a1224] to-[#070d18] relative shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-[#050a14] text-[9px] font-bold flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3" />
                  ĐỐI TÁC VIP
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    TÀI KHOẢN VIP
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-amber-500/20 text-amber-300 font-bold">HOT</span>
                </div>
                <div className="text-lg font-bold text-amber-300 mb-3 flex items-baseline gap-1">
                  <span>{SITE_CONFIG.vip.priceMonthly.toLocaleString('vi-VN')}₫</span>
                  <span className="text-[10px] text-[#94a3b8] font-normal">/ tháng (hoặc Trọn đời)</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-200">
                  <li className="flex items-start gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-amber-300">Huy hiệu VIP Hoàng Kim Cyber</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Mở khóa sơ đồ kiến trúc hệ thống & Blueprints</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Kênh ưu tiên tư vấn & giải đáp kỹ thuật trong 2h</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Kích hoạt Vũ điệu Cá voi 3D VIP theo yêu cầu</span>
                  </li>
                </ul>
              </div>

              {/* Tier 3: Admin Account */}
              <div className={`p-4 rounded-xl border transition-all ${
                isAdmin
                  ? 'border-[#00d2ff]/60 bg-[#070d18] shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                  : 'border-[#172847] bg-[#070d18]/70'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#00d2ff] flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    TÀI KHOẢN ADMIN
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-[#00d2ff]/20 text-[#00d2ff] font-bold">PHÂN QUYỀN</span>
                </div>
                <div className="text-lg font-bold text-[#00d2ff] mb-3">Chỉ Quản Trị Viên</div>
                <ul className="space-y-2 text-[11px] text-[#94a3b8]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2ff] shrink-0 mt-0.5" />
                    <span>Chỉ tài khoản được phân quyền mới được vào</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2ff] shrink-0 mt-0.5" />
                    <span>Bảng điều khiển Admin Dashboard bảo mật</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2ff] shrink-0 mt-0.5" />
                    <span>Quản lý người dùng, cấp VIP và tra cứu logs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Select VIP Plan */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              CHỌN GÓI NÂNG CẤP VIP:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPlan === 'monthly'
                    ? 'border-amber-400 bg-amber-500/15 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">GÓI TRẢI NGHIỆM 1 THÁNG</span>
                  <span className="text-xs text-amber-400 font-bold">{SITE_CONFIG.vip.priceMonthly.toLocaleString('vi-VN')}₫</span>
                </div>
                <p className="text-[10px] text-[#94a3b8]">
                  Thích hợp tìm hiểu năng lực giải pháp và kiểm tra kiến trúc phần mềm
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedPlan === 'lifetime'
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
                }`}
              >
                <div className="absolute -top-2 right-2 px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-amber-500 text-white text-[8px] font-bold rounded-full">
                  TIẾT KIỆM 80%
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300">GÓI TRỌN ĐỜI (FOUNDER VIP)</span>
                  <span className="text-xs text-amber-300 font-bold">{SITE_CONFIG.vip.priceLifetime.toLocaleString('vi-VN')}₫</span>
                </div>
                <p className="text-[10px] text-[#94a3b8]">
                  Sở hữu vĩnh viễn quyền hạn VIP, ưu tiên hợp tác trọn đời và cập nhật blueprint mới
                </p>
              </button>
            </div>
          </div>

          {/* Payment & Activation Channels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase">
                PHƯƠNG THỨC THANH TOÁN & KÍCH HOẠT:
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                    paymentMethod === 'vietqr'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                      : 'border-[#172847] bg-[#070d18] text-slate-400'
                  }`}
                >
                  VietQR Bank
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                    paymentMethod === 'momo'
                      ? 'border-pink-500 bg-pink-950/40 text-pink-300'
                      : 'border-[#172847] bg-[#070d18] text-slate-400'
                  }`}
                >
                  Ví MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('code')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                    paymentMethod === 'code'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-300'
                      : 'border-[#172847] bg-[#070d18] text-slate-400'
                  }`}
                >
                  Mã VIP Code
                </button>
              </div>
            </div>

            {/* Method 1: VietQR */}
            {paymentMethod === 'vietqr' && (
              <div className="p-4 rounded-xl bg-[#070d18] border border-emerald-500/30">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2 rounded-lg bg-white shrink-0 shadow-md">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Vietcombank Nâng Cấp VIP"
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
                      <span className="text-slate-400">Số tiền:</span>
                      <span className="text-amber-300 font-bold">{amount.toLocaleString('vi-VN')} VNĐ</span>
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
              </div>
            )}

            {/* Method 2: MoMo */}
            {paymentMethod === 'momo' && (
              <div className="p-4 rounded-xl bg-[#070d18] border border-pink-500/30">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2 rounded-lg bg-white shrink-0 shadow-md">
                    <img
                      src={momoQrUrl}
                      alt="MoMo Nâng Cấp VIP"
                      className="w-36 h-36 object-contain rounded"
                    />
                    <div className="text-[8px] font-mono text-slate-800 text-center font-bold mt-1">
                      QUÉT VÍ MOMO
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-xs w-full">
                    <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                      <span className="text-slate-400">Ví điện tử:</span>
                      <span className="text-pink-400 font-bold">MoMo Transfer</span>
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
              </div>
            )}

            {/* Method 3: Promo / Activation Code */}
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
                      className="flex-1 px-3.5 py-2 rounded-lg bg-[#0a1224] border border-[#172847] text-white text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#050a14] font-bold text-xs cursor-pointer shadow-sm transition-all"
                    >
                      Kích Hoạt Mã
                    </button>
                  </div>
                  {codeError && (
                    <p className="text-[11px] text-red-400 mt-1.5">{codeError}</p>
                  )}
                  <p className="text-[10px] text-[#64748b] mt-1.5">
                    Gợi ý mã thử nghiệm demo: <strong className="text-amber-300">{SITE_CONFIG.vip.promoCodes[0] || 'KIETVIP2025'}</strong> hoặc <strong className="text-amber-300">{SITE_CONFIG.vip.promoCodes[1] || 'CYBERVIP'}</strong>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Instant 1-Click Demo VIP Activation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#0c182e] to-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>CHẾ ĐỘ TRẢI NGHIỆM VIP TỨC THÌ (DEMO ACTIVATION)</span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Bấm nút dưới đây để kích hoạt và thử nghiệm ngay mọi đặc quyền VIP trên website!
              </p>
            </div>

            <button
              type="button"
              disabled={isUpgrading}
              onClick={handleInstantActivation}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#050a14] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all shrink-0"
            >
              <Crown className="w-4 h-4" />
              <span>{isUpgrading ? 'ĐANG KÍCH HOẠT...' : 'KÍCH HOẠT VIP NGAY (1-CLICK)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#172847] bg-[#070d18] flex items-center justify-between text-[11px] text-[#64748b]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kietfolio Secure Payment Gateway • Powered by Vietcombank & MoMo</span>
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
