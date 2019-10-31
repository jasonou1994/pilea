import { Request, Response, NextFunction } from 'express'
import pino from 'pino'
import expressPino from 'express-pino-logger'

export const logger = pino({ level: 'debug' })
export const expressLogger = expressPino({ logger })

export const logReq = async (req: Request, _: Response, next: NextFunction) => {
  logger.info('Request received:')
  logger.info({ url: req.url, params: req.params, body: req.body })

  next()
}
