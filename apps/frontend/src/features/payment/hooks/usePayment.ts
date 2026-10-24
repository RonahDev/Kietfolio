import { useState, useCallback } from 'react'
import { paymentApi, type CreatePaymentPayload } from '../api/paymentApi'

export type DonationTier = 20000 | 50000 | 100000 | 200000 | 'custom'

export function usePayment(defaultDonorName = '') {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<DonationTier>(50000)
  const [customAmount, setCustomAmount] = useState<string>('50000')
  const [orderType, setOrderType] = useState<'coffee' | 'mentorship' | 'custom'>('coffee')
  const [donorName, setDonorName] = useState(defaultDonorName)
  const [donorMessage, setDonorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const openModal = useCallback((type: 'coffee' | 'mentorship' | 'custom' = 'coffee') => {
    setOrderType(type)
    if (type === 'mentorship') {
      setSelectedTier(200000)
      setCustomAmount('200000')
    } else {
      setSelectedTier(50000)
      setCustomAmount('50000')
    }
    setErrorMessage(null)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setErrorMessage(null)
  }, [])

  const handleSelectTier = useCallback((tier: DonationTier) => {
    setSelectedTier(tier)
    if (tier !== 'custom') {
      setCustomAmount(String(tier))
    }
  }, [])

  const calculateAmount = useCallback((): number => {
    if (selectedTier === 'custom') {
      return Number(customAmount) || 0
    }
    return Number(selectedTier)
  }, [selectedTier, customAmount])

  const handlePayWithVnpay = useCallback(async (): Promise<void> => {
    const finalAmount = calculateAmount()
    if (finalAmount < 10000) {
      setErrorMessage('Số tiền tối thiểu là 10.000 VNĐ')
      return
    }

    if (!donorName.trim()) {
      setErrorMessage('Vui lòng nhập tên hoặc biệt danh của bạn')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const payload: CreatePaymentPayload = {
        amount: finalAmount,
        donorName: donorName.trim(),
        donorMessage: donorMessage.trim() || undefined,
        orderType,
        bankCode: 'VNPAYQR', // Default to VNPay QR
        language: 'vn',
      }

      const { paymentUrl } = await paymentApi.createPaymentUrl(payload)

      // Redirect user directly to VNPay secure QR payment page
      window.location.href = paymentUrl
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Không thể khởi tạo cổng thanh toán VNPay QR. Vui lòng thử lại sau.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [calculateAmount, donorName, donorMessage, orderType])

  return {
    isOpen,
    openModal,
    closeModal,
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
    handlePayWithVnpay,
  }
}

