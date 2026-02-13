import { Request, Response, NextFunction } from 'express'
import { prisma } from '@stillup/db'
import { hashApiKey } from '../utils/apiKey.js'

/**
 * API Key authentication middleware
 * Validates the X-API-Key header and attaches the user to the request
 */
export async function apiKeyAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKey = req.headers['x-api-key'] as string | undefined

    if (!apiKey) {
      res.status(401).json({ error: 'API key required' })
      return
    }

    // SHA-256 hash for deterministic lookup
    const keyHash = hashApiKey(apiKey)

    // Look up key by hash (unique index — fast)
    const keyRecord = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    })

    if (!keyRecord) {
      res.status(401).json({ error: 'Invalid API key' })
      return
    }

    // Check expiration
    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      res.status(401).json({ error: 'API key has expired' })
      return
    }

    // Attach user to request (same shape as JWT middleware)
    req.user = keyRecord.user

    // Fire-and-forget lastUsedAt update (don't block the request)
    prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {
      // Silently ignore update failures — non-critical
    })

    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
