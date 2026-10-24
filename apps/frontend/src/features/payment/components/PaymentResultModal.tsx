import React, { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, X, ShieldCheck, ArrowRight } from 'lucide-react'
import { paymentApi, type PaymentVerificationResult } from '../api/paymentApi'
import { Button } from '@/components/ui'

const hasVnpayReturnParams = (): boolean => {
  if (typeof window === 'undefined') return false
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.has('vnp_ResponseCode') && searchParams.has('vnp_TxnRef')
}

export const PaymentResultModal: React.FC = () => {
  const [result, setResult] = useState<PaymentVerificationResult | null>(null)
  const [isOpen, setIsOpen] = useState(hasVnpayReturnParams)
  const [isVerifying, setIsVerifying] = useState(hasVnpayReturnParams)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const searchParams = new URLSearchParams(window.location.search)
    const hasVnpayParams = searchParams.has('vnp_ResponseCode') && searchParams.has('vnp_TxnRef')

    if (!hasVnpayParams) return

    // Convert URLSearchParams to Record<string, string>
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })

    paymentApi
      .verifyPayment(params)
      .then((data) => {
        setResult(data)
      })
      .catch(() => {
        // Fallback display from URL params directly
        const code = searchParams.get('vnp_ResponseCode') || '99'
        const amount = Number(searchParams.get('vnp_Amount') || '0') / 100
        const orderId = searchParams.get('vnp_TxnRef') || ''
        setResult({
          isValid: true,
          isSuccess: code === '00',
          orderId,
          amount,
          responseCode: code,
          transactionNo: searchParams.get('vnp_TransactionNo') || undefined,
          bankCode: searchParams.get('vnp_BankCode') || undefined,
          message: code === '00' ? 'Giao dịch thành công' : 'Giao dịch không thành công hoặc đã bị hủy',
        })
      })
      .finally(() => {
        setIsVerifying(false)
        // Clean URL query parameters smoothly without reloading
        window.history.replaceState({}, document.title, window.location.pathname)
      })
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setResult(null)
  }

  if (!isOpen) return null

  const formattedAmount = result?.amount
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.amount)
    : ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-xl bg-[#0a1224] border border-[#00d2ff]/40 shadow-[0_0_50px_rgba(0,210,255,0.3)] p-6 sm:p-8 font-sans text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isVerifying ? (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#00d2ff] border-t-transparent animate-spin" />
            <p className="font-mono text-xs text-[#00d2ff]">Đang xác thực giao dịch với cổng VNPay...</p>
          </div>
        ) : result?.isSuccess ? (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                [VNPAY VERIFIED SUCCESS]
              </span>
              <h2 className="text-xl font-bold text-white">CẢM ƠN BẠN ĐÃ ỦNG HỘ!</h2>
              <p className="text-xs text-slate-300">
                Giao dịch qua VNPay QR của bạn đã được ghi nhận thành công vào hệ thống.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-lg bg-[#050a14] border border-[#172847] text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-[#172847]/60">
                <span className="text-slate-400">Số tiền:</span>
                <span className="text-[#00d2ff] font-bold text-sm">{formattedAmount}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#172847]/60">
                <span className="text-slate-400">Mã đơn hàng:</span>
                <span className="text-slate-200 truncate max-w-[180px]">{result.orderId}</span>
              </div>
              {result.transactionNo && (
                <div className="flex justify-between items-center py-1 border-b border-[#172847]/60">
                  <span className="text-slate-400">Mã giao dịch VNPay:</span>
                  <span className="text-slate-200">{result.transactionNo}</span>
                </div>
              )}
              {result.bankCode && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Phương thức:</span>
                  <span className="text-slate-200">{result.bankCode}</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-xs text-[#38bdf8] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#00d2ff]" />
              <span>Sự tiếp sức của bạn là động lực rất lớn cho các dự án mã nguồn mở tiếp theo của Kiệt!</span>
            </div>

            <Button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
            >
              Tiếp Tục Trải Nghiệm
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                [TRANSACTION UNRESOLVED]
              </span>
              <h2 className="text-xl font-bold text-white">GIAO DỊCH CHƯA HOÀN TẤT</h2>
              <p className="text-xs text-slate-300">
                {result?.message || 'Giao dịch quét mã VNPay QR đã bị hủy hoặc chưa hoàn tất thanh toán.'}
              </p>
            </div>

            {result?.orderId && (
              <div className="p-3 rounded-lg bg-[#050a14] border border-[#172847] text-xs font-mono text-slate-400 flex justify-between">
                <span>Mã đơn:</span>
                <span className="text-slate-200">{result.orderId}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 bg-[#172847] hover:bg-[#1e345e] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Quay Lại Trang Chủ</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
