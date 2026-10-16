import rateLimit from 'express-rate-limit'
import { config } from '../config/env'

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts, please wait 15 minutes.',
  },
})

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 contact messages per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Submission threshold reached. Please try sending again in 1 hour.',
  },
})

