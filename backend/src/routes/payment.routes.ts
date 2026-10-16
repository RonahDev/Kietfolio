import { Router } from 'express'
import { z } from 'zod'
import { PaymentController } from '../controllers/payment.controller'
import { validateBody } from '../middlewares/validator.middleware'

const createPaymentSchema = z.object({
  amount: z.number().min(10000, 'Minimum payment amount is 10,000 VND').max(50000000),
  donorName: z.string().min(1, 'Name is required').max(100),
  donorMessage: z.string().max(500).optional(),
  orderType: z.enum(['coffee', 'mentorship', 'custom']).optional(),
  bankCode: z.string().optional(),
  language: z.enum(['vn', 'en']).optional(),
})

export const paymentRouter = Router()

paymentRouter.post('/vnpay/create-payment-url', validateBody(createPaymentSchema), PaymentController.createPaymentUrl)
paymentRouter.get('/vnpay/vnpay-return', PaymentController.verifyReturn)
paymentRouter.get('/vnpay/vnpay-ipn', PaymentController.handleIpn)
paymentRouter.get('/recent', PaymentController.getRecent)

