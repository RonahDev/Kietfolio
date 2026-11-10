import rateLimit from 'express-rate-limit'
import { config } from '../config/env'

/**
 * High-Concurrency Rate Limiter for Public Read Endpoints
 * Supports 1,000 - 2,000 CCU and corporate/campus CGNAT shared IPs
 */
export const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15000, // 15,000 requests per 15 minutes (approx 16 req/sec per IP)
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || req.method === 'HEAD',
  message: {
    success: false,
    error: 'High traffic limit reached for this IP. Please wait a moment.',
  },
})

/**
 * Mutation Rate Limiter (POST, PUT, PATCH, DELETE)
 * Safeguards backend state and database writes from abuse and race-condition bursts
 */
export const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // 500 mutations per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET' || req.method === 'OPTIONS',
  message: {
    success: false,
    error: 'Too many modification requests. Please slow down and try again shortly.',
  },
})

/**
 * General API Limiter (Backward Compatible)
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: Math.max(5000, config.rateLimit.maxRequests), // Tuned for high concurrency
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || req.method === 'HEAD',
  message: {
    success: false,
    error: 'API request limit exceeded, please try again later.',
  },
})

/**
 * Strict Security Limiter for Authentication and Login
 * Protects against credential stuffing and brute-force attacks
 */
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

/**
 * Form Submission Limiter for Public Inquiries
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 messages per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Submission threshold reached. Please try sending again in 1 hour.',
  },
})

/**
 * AI Chatbot Rate Limiter
 */
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 40, // 40 queries per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many chat requests. Please slow down and try again shortly.',
  },
})

/** Alias for general api limiter */
export const rateLimiter = apiLimiter

