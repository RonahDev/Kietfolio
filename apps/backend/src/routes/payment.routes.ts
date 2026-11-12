import { Router } from 'express'
import { z } from 'zod'
import { PaymentController } from '../controllers/payment.controller'
import { validateBody } from '../middlewares/validator.middleware'
import { optionalToken } from '../middlewares/auth.middleware'

const createPaymentSchema = z.object({
  amount: z.number().min(10000, 'Minimum payment amount is 10,000 VND').max(50000000),
  donorName: z.string().min(1, 'Name is required').max(100),
  donorMessage: z.string().max(500).optional(),
  orderType: z.string().optional(),
  bankCode: z.string().optional(),
  language: z.enum(['vn', 'en']).optional(),
  userUid: z.string().optional(),
})

const createVipPaymentSchema = z.object({
  plan: z.enum(['monthly', 'quarterly', 'annual', 'lifetime']),
  bankCode: z.string().optional(),
  language: z.enum(['vn', 'en']).optional(),
  userUid: z.string().optional(),
})

export const paymentRouter = Router()

paymentRouter.post('/vnpay/create-payment-url', optionalToken, validateBody(createPaymentSchema), PaymentController.createPaymentUrl)
paymentRouter.post('/vip/create-payment', optionalToken, validateBody(createVipPaymentSchema), PaymentController.createVipPayment)
paymentRouter.get('/vnpay/vnpay-return', PaymentController.verifyReturn)
paymentRouter.get('/vnpay/vnpay-ipn', PaymentController.handleIpn)
paymentRouter.get('/recent', PaymentController.getRecent)

