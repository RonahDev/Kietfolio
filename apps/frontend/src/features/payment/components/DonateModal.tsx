import React, { useState, useEffect, useCallback } from 'react'
import {
  Coffee,
  GraduationCap,
  QrCode,
  X,
  Sparkles,
  AlertCircle,
  Heart,
  Copy,
  Check,
  Building2,
  Smartphone,
  ExternalLink,
} from 'lucide-react'
import type { DonationTier } from '../hooks/usePayment'
import { Button } from '@/components/ui'
import { SITE_CONFIG } from '@/config/site'

type PaymentMethod = 'vietcombank' | 'momo' | 'vnpay'

interface DonateModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTier: DonationTier
  customAmount: string
  setCustomAmount: (val: string) => void
  handleSelectTier: (tier: DonationTier) => void
  orderType: 'coffee' | 'mentorship' | 'custom'
  setOrderType: (type: 'coffee' | 'mentorship' | 'custom') => void
  donorName: string
  setDonorName: (name: string) => void
  donorMessage: string
  setDonorMessage: (msg: string) => void
  isLoading: boolean
  errorMessage: string | null
  calculateAmount: () => number
  onPayWithVnpay: () => Promise<void>
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
  customAmount,
  setCustomAmount,
  handleSelectTier,
  orderType,
  setOrderType,
  donorName,
  setDonorName,
  donorMessage,
  setDonorMessage,
  isLoading,
  errorMessage,
  calculateAmount,
  onPayWithVnpay,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietcombank')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // ESC key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const copyToClipboard = useCallback((text: string, fieldName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(fieldName)
        setTimeout(() => setCopiedField(null), 2500)
      })
    }
  }, [])

  if (!isOpen) return null

  const amount = calculateAmount()
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)

  // Standardized transfer note
  const sanitizedDonor = donorName.trim()
    ? donorName.trim().toUpperCase().replace(/[^A-Z0-9]/g, ' ').substring(0, 20)
    : 'BAN TOT'
  const transferContent = `KIETFOLIO ${sanitizedDonor}`.trim()

  // Dynamic QR Code URLs
  const vietQrUrl = `https://img.vietqr.io/image/vietcombank-${SITE_CONFIG.donation.vietcombank.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(SITE_CONFIG.donation.recipientName)}`

  const momoQrPayload = `2|99|${SITE_CONFIG.donation.momo.phone}|${SITE_CONFIG.donation.recipientName}||0|0|${amount}|${transferContent}|transfer_myqr`
  const momoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
    momoQrPayload
  )}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-xl bg-[#0a1224] border border-[#00d2ff]/40 shadow-[0_0_60px_rgba(0,210,255,0.25)] p-5 sm:p-7 font-sans overflow-y-auto my-auto">
        {/* Decorative cyber corner glows */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#00d2ff]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#38bdf8]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#00d2ff] hover:bg-[#172847]/50 rounded-lg transition-colors cursor-pointer z-10"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-5 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>Tiếp Lửa Sáng Tạo & Ủng Hộ</span>
          </div>
          <h2 id="payment-modal-title" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Đồng Hành Cùng Mai Anh Kiệt</span>
          </h2>
          <p className="text-xs text-slate-400">
            Ủng hộ tách cà phê hoặc đặt lịch trao đổi kỹ thuật qua MoMo, Vietcombank hoặc VNPay QR.
          </p>
        </div>

        {/* Tab selection: Coffee vs Mentorship */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#050a14] rounded-lg border border-[#172847] mb-5">
          <button
            type="button"
            onClick={() => {
              setOrderType('coffee')
              handleSelectTier(50000)
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              orderType === 'coffee'
                ? 'bg-[#00d2ff] text-[#050a14] shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Tách Cà Phê</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOrderType('mentorship')
              handleSelectTier(200000)
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              orderType === 'mentorship'
                ? 'bg-[#00d2ff] text-[#050a14] shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Tư Vấn 1-1 (60p)</span>
          </button>
        </div>

        {/* Tier Presets */}
        <div className="space-y-2.5 mb-5">
          <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>CHỌN MỨC TIỀN ỦNG HỘ:</span>
            <span className="text-[#00d2ff] font-bold text-sm">{formattedAmount}</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { tier: 20000 as const, label: '20.000đ', icon: '☕' },
              { tier: 50000 as const, label: '50.000đ', icon: '⚡' },
              { tier: 100000 as const, label: '100.000đ', icon: '🚀' },
              { tier: 200000 as const, label: '200.000đ', icon: '🎯' },
            ].map(({ tier, label, icon }) => (
              <button
                key={tier}
                type="button"
                onClick={() => handleSelectTier(tier)}
                className={`py-2 px-3 rounded-lg border text-xs font-mono transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedTier === tier
                    ? 'border-[#00d2ff] bg-[#00d2ff]/15 text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.25)] font-bold'
                    : 'border-[#172847] bg-[#070d18] text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => handleSelectTier('custom')}
              className={`w-full py-1.5 px-3 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                selectedTier === 'custom'
                  ? 'border-[#00d2ff] bg-[#00d2ff]/15 text-[#00d2ff] font-bold'
                  : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
              }`}
            >
              Hoặc nhập số tiền tùy chọn khác
            </button>
          </div>

          {selectedTier === 'custom' && (
            <div className="mt-2">
              <input
                type="number"
                min="10000"
                step="5000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Nhập số tiền VNĐ (tối thiểu 10.000)..."
                className="w-full px-4 py-2.5 rounded-lg bg-[#070d18] border border-[#00d2ff]/40 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#00d2ff]"
              />
            </div>
          )}
        </div>

        {/* Sender details */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              TÊN HOẶC BIỆT DANH CỦA BẠN <span className="text-red-400">*</span>:
            </label>
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="VD: Nguyễn Văn A hoặc ẩn danh..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#070d18] border border-[#172847] text-white text-xs focus:outline-none focus:border-[#00d2ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              LỜI NHẮN GỬI TỚI KIỆT (TÙY CHỌN):
            </label>
            <textarea
              rows={2}
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              placeholder="Gửi lời chúc, góp ý hoặc chủ đề bạn muốn trao đổi..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#070d18] border border-[#172847] text-white text-xs focus:outline-none focus:border-[#00d2ff] resize-none"
            />
          </div>
        </div>

        {/* Payment Method Tabs: Vietcombank | MoMo | VNPay */}
        <div className="space-y-3 mb-5">
          <label className="block text-xs font-mono text-slate-300 uppercase">
            CHỌN PHƯƠNG THỨC CHUYỂN TIỀN:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Vietcombank Tab */}
            <button
              type="button"
              onClick={() => setPaymentMethod('vietcombank')}
              className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                paymentMethod === 'vietcombank'
                  ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                  : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold font-mono">Vietcombank</span>
              <span className="text-[10px] text-emerald-400/80">VietQR 24/7</span>
            </button>

            {/* MoMo Tab */}
            <button
              type="button"
              onClick={() => setPaymentMethod('momo')}
              className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                paymentMethod === 'momo'
                  ? 'border-pink-500 bg-pink-950/40 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.25)]'
                  : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold font-mono">Ví MoMo</span>
              <span className="text-[10px] text-pink-400/80">0963463831</span>
            </button>

            {/* VNPay QR Tab */}
            <button
              type="button"
              onClick={() => setPaymentMethod('vnpay')}
              className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                paymentMethod === 'vnpay'
                  ? 'border-[#00d2ff] bg-[#00d2ff]/15 text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                  : 'border-[#172847] bg-[#070d18] text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#00d2ff]" />
              <span className="text-xs font-bold font-mono">VNPay QR</span>
              <span className="text-[10px] text-[#00d2ff]/80">Cổng Thẻ/Bank</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Vietcombank (VietQR) */}
        {paymentMethod === 'vietcombank' && (
          <div className="p-4 rounded-xl bg-[#070d18] border border-emerald-500/30 space-y-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* VietQR Generated Image */}
              <div className="relative p-2 rounded-lg bg-white shadow-md shrink-0">
                <img
                  src={vietQrUrl}
                  alt="VietQR Vietcombank Mai Anh Kiệt"
                  className="w-40 h-40 object-contain rounded"
                  loading="lazy"
                />
                <div className="text-[9px] font-mono text-slate-700 text-center font-bold mt-1">
                  QUÉT BẰNG MỌI APP BANK
                </div>
              </div>

              {/* Account details & 1-click copy */}
              <div className="flex-1 space-y-2 text-xs font-mono w-full">
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
                      onClick={() =>
                        copyToClipboard(
                          SITE_CONFIG.donation.vietcombank.accountNumber,
                          'vcb_stk'
                        )
                      }
                      className="p-1 rounded bg-[#0f1b33] hover:bg-[#172847] text-[#00d2ff] transition-colors cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === 'vcb_stk' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                  <span className="text-slate-400">Số tiền:</span>
                  <span className="text-emerald-400 font-bold">{formattedAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-300 font-bold text-[11px]">
                      {transferContent}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(transferContent, 'vcb_note')}
                      className="p-1 rounded bg-[#0f1b33] hover:bg-[#172847] text-[#00d2ff] transition-colors cursor-pointer"
                      title="Sao chép nội dung chuyển khoản"
                    >
                      {copiedField === 'vcb_note' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-mono">
              💡 Mở bất kỳ ứng dụng ngân hàng nào (Vietcombank, MB, Techcombank, VPBank,...) bật tính năng <strong className="text-white">Quét QR</strong> để tự động điền STK và số tiền.
            </p>
          </div>
        )}

        {/* Tab Content 2: MoMo */}
        {paymentMethod === 'momo' && (
          <div className="p-4 rounded-xl bg-[#070d18] border border-pink-500/30 space-y-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* MoMo QR Image */}
              <div className="relative p-2 rounded-lg bg-white shadow-md shrink-0">
                <img
                  src={momoQrUrl}
                  alt="Mã QR Ví MoMo Mai Anh Kiệt"
                  className="w-40 h-40 object-contain rounded"
                  loading="lazy"
                />
                <div className="text-[9px] font-mono text-pink-700 text-center font-bold mt-1">
                  QUÉT QUA APP MOMO
                </div>
              </div>

              {/* MoMo Details & Copy */}
              <div className="flex-1 space-y-2 text-xs font-mono w-full">
                <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                  <span className="text-slate-400">Ví điện tử:</span>
                  <span className="text-pink-400 font-bold">MoMo</span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                  <span className="text-slate-400">Người nhận:</span>
                  <span className="text-white font-bold">{SITE_CONFIG.donation.recipientName}</span>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                  <span className="text-slate-400">Số điện thoại MoMo:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-pink-400 font-bold text-sm tracking-wider">
                      {SITE_CONFIG.donation.momo.phone}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(SITE_CONFIG.donation.momo.phone, 'momo_phone')
                      }
                      className="p-1 rounded bg-[#0f1b33] hover:bg-[#172847] text-pink-400 transition-colors cursor-pointer"
                      title="Sao chép số điện thoại MoMo"
                    >
                      {copiedField === 'momo_phone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1 border-b border-[#172847]">
                  <span className="text-slate-400">Số tiền:</span>
                  <span className="text-pink-400 font-bold">{formattedAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lời nhắn:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-300 font-bold text-[11px]">
                      {transferContent}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(transferContent, 'momo_note')}
                      className="p-1 rounded bg-[#0f1b33] hover:bg-[#172847] text-pink-400 transition-colors cursor-pointer"
                      title="Sao chép nội dung chuyển"
                    >
                      {copiedField === 'momo_note' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Open MoMo App Link */}
            <div className="text-center pt-1">
              <a
                href={`https://nhantien.momo.vn/${SITE_CONFIG.donation.momo.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]"
              >
                <span>Mở App MoMo Chuyển Tiền Trực Tiếp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Tab Content 3: VNPay QR Gateway */}
        {paymentMethod === 'vnpay' && (
          <div className="p-4 rounded-xl bg-[#070d18] border border-[#00d2ff]/30 space-y-3 mb-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn sẽ được chuyển hướng tới trang thanh toán bảo mật của <strong className="text-[#00d2ff]">VNPay</strong> để quét mã QR hoặc nhập thẻ ATM nội địa / Quốc tế (Visa, Master).
            </p>
            <Button
              type="button"
              onClick={onPayWithVnpay}
              isLoading={isLoading}
              className="w-full py-3 bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.4)] cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Chuyển Sang Cổng VNPay ({formattedAmount})</span>
            </Button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Footer Note */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono text-center pt-1 border-t border-[#172847]">
          <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
          <span>Chân thành cảm ơn sự đồng hành và ủng hộ quý báu của bạn dành cho Mai Anh Kiệt!</span>
        </div>
      </div>
    </div>
  )
}
