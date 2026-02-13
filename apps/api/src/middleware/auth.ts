import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.js'
import { prisma } from '@stillup/db'
import { hashApiKey } from '../utils/apiKey.js'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        fullName: string
      }
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from httpOnly cookie and attaches user to request
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from cookie
    const token = req.cookies?.token

    if (!token) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }

    // Verify token
    const payload = verifyToken(token)

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    })

    if (!user) {
      res.status(401).json({ error: 'User not found' })
      return
    }

    // Attach user to request
    req.user = user

    next()
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message })
    } else {
      res.status(401).json({ error: 'Authentication failed' })
    }
  }
}

/**
 * Combined authentication middleware
 * Accepts either JWT cookie or X-API-Key header
 * Tries JWT first, falls back to API key
 */
export async function apiKeyOrAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Try JWT cookie first
    const token = req.cookies?.token
    if (token) {
      const payload = verifyToken(token)
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, fullName: true },
      })
      if (user) {
        req.user = user
        next()
        return
      }
    }

    // Fall back to API key
    const apiKey = req.headers['x-api-key'] as string | undefined
    if (apiKey) {
      const keyHash = hashApiKey(apiKey)
      const keyRecord = await prisma.apiKey.findUnique({
        where: { keyHash },
        include: {
          user: { select: { id: true, email: true, fullName: true } },
        },
      })

      if (keyRecord && (!keyRecord.expiresAt || keyRecord.expiresAt >= new Date())) {
        req.user = keyRecord.user
        // Fire-and-forget lastUsedAt update
        prisma.apiKey.update({
          where: { id: keyRecord.id },
          data: { lastUsedAt: new Date() },
        }).catch(() => {})
        next()
        return
      }
    }

    res.status(401).json({ error: 'Authentication required' })
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is present, but doesn't fail if not
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.token

    if (token) {
      const payload = verifyToken(token)
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      })

      if (user) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Silently fail for optional auth
    next()
  }
}
