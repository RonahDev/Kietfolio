import React, { useEffect } from 'react'
import { Coffee, GraduationCap, QrCode, X, Sparkles, AlertCircle, Heart } from 'lucide-react'
import type { DonationTier } from '../hooks/usePayment'
import { Button } from '@/components/ui'

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

  if (!isOpen) return null

  const amount = calculateAmount()
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-xl bg-[#0a1224] border border-[#00d2ff]/40 shadow-[0_0_50px_rgba(0,210,255,0.25)] p-6 sm:p-8 font-sans overflow-hidden">
        {/* Decorative cyber corner glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2ff]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#38bdf8]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#00d2ff] hover:bg-[#172847]/50 rounded-lg transition-colors cursor-pointer"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>Cổng Thanh Toán VNPay QR</span>
          </div>
          <h2 id="payment-modal-title" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Tiếp Lửa Sáng Tạo</span>
            <Heart className="w-5 h-5 text-red-400 fill-red-400 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-400">
            Ủng hộ tách cà phê hoặc đặt lịch trao đổi kỹ thuật cùng Mai Anh Kiệt qua quét mã QR bảo mật.
          </p>
        </div>

        {/* Tab selection: Coffee vs Mentorship */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#050a14] rounded-lg border border-[#172847] mb-6">
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
        <div className="space-y-3 mb-6">
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

          <div className="pt-1">
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
        <div className="space-y-3 mb-6">
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
              className="w-full px-4 py-2.5 rounded-lg bg-[#070d18] border border-[#172847] text-white text-xs focus:outline-none focus:border-[#00d2ff]"
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
              placeholder="Gửi lời chúc, góp ý hoặc nội dung muốn trao đổi..."
              className="w-full px-4 py-2 rounded-lg bg-[#070d18] border border-[#172847] text-white text-xs focus:outline-none focus:border-[#00d2ff] resize-none"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* VNPay QR Gateway Badge & Submit */}
        <div className="space-y-3">
          <Button
            type="button"
            onClick={onPayWithVnpay}
            isLoading={isLoading}
            className="w-full py-3 bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.4)] cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Quét Mã VNPay QR Ngay ({formattedAmount})</span>
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono text-center">
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Hỗ trợ quét bằng App của 40+ Ngân hàng VN, MoMo, VNPay</span>
          </div>
        </div>
      </div>
    </div>
  )
}

