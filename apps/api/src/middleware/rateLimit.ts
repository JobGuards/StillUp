import { rateLimit } from 'express-rate-limit'

/**
 * General API rate limiter
 * Limits repeat requests to public APIs and/or internal endpoints
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Increased for development
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
  },
})

/**
 * Stricter rate limiter for authentication routes
 * (Signup and Login)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Increased for development
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts, please try again in 15 minutes.',
  },
  skipSuccessfulRequests: true,
})

/**
 * Heartbeat rate limiter
 * Prevents spamming the ingestion endpoint
 */
export const heartbeatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 30, // Limit each IP to 30 heartbeats per minute
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Heartbeat rate limit exceeded.',
  },
})
