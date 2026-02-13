import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

// Mock @stillup/db before importing middleware
vi.mock('@stillup/db', () => ({
  prisma: {
    apiKey: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

import { apiKeyAuthMiddleware } from '../../src/middleware/apiKeyAuth.js'
import { prisma } from '@stillup/db'

const mockedPrisma = vi.mocked(prisma)

function createMockReq(headers: Record<string, string> = {}): Partial<Request> {
  return { headers }
}

function createMockRes(): Partial<Response> {
  const res: Partial<Response> = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('apiKeyAuthMiddleware', () => {
  let next: NextFunction

  beforeEach(() => {
    vi.clearAllMocks()
    next = vi.fn()
  })

  it('returns 401 when no X-API-Key header is provided', async () => {
    const req = createMockReq()
    const res = createMockRes()

    await apiKeyAuthMiddleware(req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'API key required' })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 for an invalid API key', async () => {
    const req = createMockReq({ 'x-api-key': 'sk_invalidkey123' })
    const res = createMockRes()

    mockedPrisma.apiKey.findUnique.mockResolvedValue(null)

    await apiKeyAuthMiddleware(req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid API key' })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 for an expired API key', async () => {
    const req = createMockReq({ 'x-api-key': 'sk_expiredkey123' })
    const res = createMockRes()

    mockedPrisma.apiKey.findUnique.mockResolvedValue({
      id: 'key-1',
      name: 'Test Key',
      keyHash: 'hash',
      keyPrefix: 'sk_expiredk',
      lastUsedAt: null,
      createdAt: new Date(),
      expiresAt: new Date('2020-01-01'), // expired
      userId: 'user-1',
      user: { id: 'user-1', email: 'test@test.com', fullName: 'Test User' },
    } as any)

    await apiKeyAuthMiddleware(req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'API key has expired' })
    expect(next).not.toHaveBeenCalled()
  })

  it('attaches user and calls next for a valid API key', async () => {
    const plainKey = 'sk_validkey1234567890abcdef'
    const req = createMockReq({ 'x-api-key': plainKey }) as any
    const res = createMockRes()

    const mockUser = { id: 'user-1', email: 'test@test.com', fullName: 'Test User' }
    mockedPrisma.apiKey.findUnique.mockResolvedValue({
      id: 'key-1',
      name: 'Test Key',
      keyHash: crypto.createHash('sha256').update(plainKey).digest('hex'),
      keyPrefix: 'sk_validkey1',
      lastUsedAt: null,
      createdAt: new Date(),
      expiresAt: null,
      userId: 'user-1',
      user: mockUser,
    } as any)

    mockedPrisma.apiKey.update.mockResolvedValue({} as any)

    await apiKeyAuthMiddleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toEqual(mockUser)
    expect(res.status).not.toHaveBeenCalled()
  })

  it('fires lastUsedAt update on valid request', async () => {
    const plainKey = 'sk_validkey1234567890abcdef'
    const req = createMockReq({ 'x-api-key': plainKey }) as any
    const res = createMockRes()

    mockedPrisma.apiKey.findUnique.mockResolvedValue({
      id: 'key-1',
      name: 'Test Key',
      keyHash: crypto.createHash('sha256').update(plainKey).digest('hex'),
      keyPrefix: 'sk_validkey1',
      lastUsedAt: null,
      createdAt: new Date(),
      expiresAt: null,
      userId: 'user-1',
      user: { id: 'user-1', email: 'test@test.com', fullName: 'Test User' },
    } as any)

    mockedPrisma.apiKey.update.mockResolvedValue({} as any)

    await apiKeyAuthMiddleware(req as Request, res as Response, next)

    expect(mockedPrisma.apiKey.update).toHaveBeenCalledWith({
      where: { id: 'key-1' },
      data: { lastUsedAt: expect.any(Date) },
    })
  })

  it('works with a non-expired key that has expiresAt set', async () => {
    const plainKey = 'sk_futurekey1234567890abcdef'
    const req = createMockReq({ 'x-api-key': plainKey }) as any
    const res = createMockRes()

    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)

    mockedPrisma.apiKey.findUnique.mockResolvedValue({
      id: 'key-2',
      name: 'Future Key',
      keyHash: crypto.createHash('sha256').update(plainKey).digest('hex'),
      keyPrefix: 'sk_futurek',
      lastUsedAt: null,
      createdAt: new Date(),
      expiresAt: futureDate,
      userId: 'user-1',
      user: { id: 'user-1', email: 'test@test.com', fullName: 'Test User' },
    } as any)

    mockedPrisma.apiKey.update.mockResolvedValue({} as any)

    await apiKeyAuthMiddleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toEqual({ id: 'user-1', email: 'test@test.com', fullName: 'Test User' })
  })
})
