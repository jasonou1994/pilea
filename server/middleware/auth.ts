import { Router, Request, Response, NextFunction } from 'express'
import { key } from '../constants'
import jwt from 'jsonwebtoken'
import uuidv4 from 'uuidv4'
import {
  updateUser,
  checkUserToken,
  updateUserWithToken,
} from '../database/users'

export const auth = Router()

export const addAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    console.log('Adding token...', token)

    next()
  } catch (error) {
    res.status(500).json({
      error,
    })
  }
}

export const checkUpdateAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Checking token...')
  try {
    const authorization = req.cookies.Authorization

    // 1. Check token exists.
    if (!authorization) {
      throw 'No Authorization: Bearer header present on request'
    }

    // 2. Check token exists in DB.
    const acceptToken: boolean = await checkUserToken({ token: authorization })
    if (!acceptToken) {
      throw 'Invalid Authorization: Bearer token on request'
    }

    // 3. Check JWT properly signed.
    await jwt.verify(authorization, key)

    // 4. Accepted token - refresh in DB and client.
    const token = await jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { acc: 'totals' },
      },
      key
    )
    console.log(token === authorization)

    console.log('New Token: ', token)
    await updateUserWithToken({ oldToken: authorization, newToken: token })

    res.cookie('Authorization', token)
    res.locals.updatedToken = token

    next()
  } catch (error) {
    console.log('Cannot validate token.', error)
    res.status(401).json({
      error,
    })
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
      throw 'No Authorization: Bearer header present on request'
    }

    // 2. Check token exists in DB.
    const acceptToken = await checkUserToken({ token: authorization })
    if (!acceptToken) {
      throw 'Invalid Authorization: Bearer token on request'
    }

    // 3. Check JWT properly signed.
    jwt.verify(authorization, key)

    // 4. Replace in DB with random string
    await updateUserWithToken({ oldToken: authorization, newToken: uuidv4() })

    next()
  } catch (error) {
    res.status(500).json({ error })
  }
}
