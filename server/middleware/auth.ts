import { logger } from '../logger'
import { Router, Request, Response, NextFunction } from 'express'
import {
  key,
  NO_TOKEN_AUTH_ERROR,
  INVALID_TOKEN_AUTH_ERROR,
} from '../constants'
import jwt from 'jsonwebtoken'
import uuidv4 from 'uuidv4'
import {
  updateUser,
  checkUserToken,
  updateUserWithToken,
} from '../database/users'
import { generateGenericErrorResponse } from '.'

export const auth = Router()

export const addAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.debug('In addAuthToken middleware.')
    const { username } = req.body

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { acc: 'total' },
      },
      key
    )
    await updateUser({ username, token })

    res.cookie('Authorization', token)
    res.locals.updatedToken = token
    logger.debug('Token successfully added:', token)

    next()
  } catch (error) {
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const checkUpdateAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug('In checkUpdateAuthToken middleware.')
  try {
    const authorization = req.cookies.Authorization

    // 1. Check token exists.
    if (!authorization) {
      throw new Error(NO_TOKEN_AUTH_ERROR)
    }

    // 2. Check token exists in DB.
    const acceptToken: boolean = await checkUserToken({ token: authorization })
    if (!acceptToken) {
      throw new Error(INVALID_TOKEN_AUTH_ERROR)
    }

    // 3. Check JWT properly signed.
    await jwt.verify(authorization, key)
    logger.debug('Authentication token is valid.')

    // 4. Accepted token - refresh in DB and client.
    const token = await jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { acc: 'totals' },
      },
      key
    )

    await updateUserWithToken({ oldToken: authorization, newToken: token })

    res.cookie('Authorization', token)
    res.locals.updatedToken = token

    logger.debug('Added new token', token)

    next()
  } catch (error) {
    const errorStatusCode =
      error.message === NO_TOKEN_AUTH_ERROR ||
      error.message === INVALID_TOKEN_AUTH_ERROR
        ? 401
        : 500

    logger.error('Cannot validate token.', error.message)
    res
      .status(errorStatusCode)
      .json(generateGenericErrorResponse(error.message))
  }
}

export const checkDeleteAuthToken: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req, res, next) => {
  try {
    const authorization = req.cookies.Authorization

    // 1. Check token exists.
    if (!authorization) {
      throw new Error(NO_TOKEN_AUTH_ERROR)
    }

    // 2. Check token exists in DB.
    const acceptToken = await checkUserToken({ token: authorization })
    if (!acceptToken) {
      throw new Error(INVALID_TOKEN_AUTH_ERROR)
    }

    // 3. Check JWT properly signed.
    jwt.verify(authorization, key)

    // 4. Replace in DB with random string
    await updateUserWithToken({ oldToken: authorization, newToken: uuidv4() })

    next()
  } catch (error) {
    const errorStatusCode =
      error.message === NO_TOKEN_AUTH_ERROR ||
      error.message === INVALID_TOKEN_AUTH_ERROR
        ? 401
        : 500

    logger.error('Cannot validate token.', error.message)
    res
      .status(errorStatusCode)
      .json(generateGenericErrorResponse(error.message))
  }
}
