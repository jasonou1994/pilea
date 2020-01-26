import { logger } from './logger'
import fs from 'fs'
import { config } from 'aws-sdk'

export const PORT = process.env.PORT || 443
export const INSECURE_PORT = process.env.INSECURE_PORT || 80
export const MODE = process.env.MODE || 'PRODUCTION'
export const CORS_URL = process.env.CORS_URL || 'http://localhost:3000'
export const HOST = process.env.HOST || 'https://mypilea.com'

export const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = JSON.parse(
  fs.readFileSync('awsconfig.json', 'utf8')
)
config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

logger.debug('Environment variables:', {
  PORT,
  INSECURE_PORT,
  MODE,
  CORS_URL,
  HOST,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
})
