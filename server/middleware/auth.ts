import { logger } from '../logger'
import { Router, Request, Response, NextFunction } from 'express'
import {
  key,
  NO_TOKEN_AUTH_ERROR,
  INVALID_TOKEN_AUTH_ERROR,
  EXPIRED_TOKEN_ERROR,
} from '../constants'
import jwt from 'jsonwebtoken'
import { generateGenericErrorResponse } from '.'
import {
  addUserAccessToken,
  doesUserAccessTokenExist,
  getUserFromUserAccessToken,
  deleteUserAccessToken,
  deleteAllUserAccessTokensByUsername,
} from '../database/users'

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
    await deleteAllUserAccessTokensByUsername({ username })
    await addUserAccessToken({ username, token })

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
    const existingToken: boolean = await doesUserAccessTokenExist({
      token: authorization,
    })
    if (!existingToken) {
      throw new Error(INVALID_TOKEN_AUTH_ERROR)
    }

    // 3. Check JWT properly signed.
    await jwt.verify(authorization, key)
    logger.debug('Authentication token is valid.')

    // 4. Create new token
    const token = await jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { acc: 'totals' },
      },
      key
    )

    // 5. Add token to DB, but don't remove the old token for 3 seconds. That way, simultaneous requests will still pass through
    const { username } = await getUserFromUserAccessToken({
      token: authorization,
    })

    await addUserAccessToken({ username, token })

    setTimeout(() => deleteUserAccessToken({ token: authorization }), 3000)

    // 6. Attach new cookie to res
    res.cookie('Authorization', token)
    res.locals.updatedToken = token

    logger.debug('Added new token', token)

    next()
  } catch (error) {
    const errorStatusCode =
      error.message === NO_TOKEN_AUTH_ERROR ||
      error.message === INVALID_TOKEN_AUTH_ERROR ||
      error.message === EXPIRED_TOKEN_ERROR
        ? 401
        : 500

    logger.error('Cannot validate token.', error.stack)
    res.status(errorStatusCode).json(generateGenericErrorResponse(error))
  }
}

export const checkDeleteAuthToken: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req, res, next) => {
  try {
    const authorization: string = req.cookies.Authorization

    // 1. Check token exists.
    if (!authorization) {
      throw new Error(NO_TOKEN_AUTH_ERROR)
    }

    // 2. Check token exists in DB.
    const existingToken: boolean = await doesUserAccessTokenExist({
      token: authorization,
    })
    if (!existingToken) {
      throw new Error(INVALID_TOKEN_AUTH_ERROR)
    }

    // 3. Check JWT properly signed.
    jwt.verify(authorization, key)

    // 4. Remove old token from token array
    await deleteUserAccessToken({
      token: authorization,
    })

    next()
  } catch (error) {
    const errorStatusCode =
      error.message === NO_TOKEN_AUTH_ERROR ||
      error.message === INVALID_TOKEN_AUTH_ERROR ||
      error.message === EXPIRED_TOKEN_ERROR
        ? 401
        : 500

    logger.error('Cannot validate token.', error.stack)
    res.status(errorStatusCode).json(generateGenericErrorResponse(error))
  }
}
