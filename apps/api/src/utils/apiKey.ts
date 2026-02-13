import crypto from 'crypto'

const API_KEY_PREFIX = 'sk_'
const KEY_BYTES = 32

/**
 * Generate a new random API key with sk_ prefix
 */
export function generateApiKey(): string {
  const randomPart = crypto.randomBytes(KEY_BYTES).toString('hex')
  return `${API_KEY_PREFIX}${randomPart}`
}

/**
 * SHA-256 hash an API key for storage/lookup
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Extract a display prefix from an API key (first 12 chars)
 */
export function getKeyPrefix(key: string): string {
  return key.substring(0, 12)
}
