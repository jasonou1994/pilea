import { logger } from './logger'

export const PORT = process.env.PORT || 443
export const INSECURE_PORT = process.env.INSECURE_PORT || 80
export const MODE = process.env.MODE || 'PRODUCTION'
export const AWS_ACCESS_KEY =
  process.env.AWS_ACCESS_KEY || 'AKIA3JJOCX2YHBMWSPEF'
export const AWS_SECRET_ACCESS_KEY =
  process.env.AWS_SECRET_ACCESS_KEY ||
  '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'

export const CORS_URL = process.env.CORS_URL || 'http://localhost:3000'
export const HOST = process.env.HOST || 'https://mypilea.com'

logger.debug('Environment variables:', {
  PORT,
  INSECURE_PORT,
  MODE,
  CORS_URL,
  HOST,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
})
