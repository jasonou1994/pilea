import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import uuid from 'uuidv4'
import {
  getUsers,
  insertUser,
  DBUser,
  confirmUserDB,
  dbCheckIfUserVerified,
  addPasswordResetTokenToUser,
  checkIfPasswordResetTokenMatches,
  updatePassword,
  deleteUserByUsername,
  confirmUserBypassDB,
  getUserFromUserAccessToken,
} from '../database/users'
import { encryptPassword } from '../utils'
import { ContractResponse, generateGenericErrorResponse } from '.'
import { sendSignUpEmail, sendForgotPasswordEmail } from '../mailer'
import { logger } from '../logger'

export interface ContractLogin extends ContractResponse {
  username: string
  userId: number
  confirmed: boolean
}

export interface ContractCreateUser extends ContractResponse {
  username: string
  userId: number
}

const HOST = process.env.HOST || 'mypilea.com'

export const confirmUser = async (req: Request, res: Response) => {
  logger.debug('In confirmUser middleware.')
  try {
    await confirmUserDB(req.params.confirmationString)

    res.redirect(`https://${HOST}/confirmed`)
  } catch (e) {
    logger.error(e)
    res
      .status(500)
      .json(generateGenericErrorResponse(e, 'Unable to confirm user.'))
  }
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug('In createUser middleware.')
  const { username, password } = req.body

  try {
    const rows = await getUsers({ username })
    if (rows.length > 0) {
      throw new Error('Username already exists in database.')
    }

    const hash = await encryptPassword({ password })

    const confirmationString = uuid().replace(/-/g, '')

    await sendSignUpEmail(username, confirmationString)

    await insertUser({
      username,
      passwordHash: hash,
      confirmed: false,
      confirmationString,
    })

    res.locals.username = username
    next()
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  logger.debug('In resetPassword middleware.')

  const { resetToken } = req.params
  const { password } = req.body

  try {
    const matchingResetToken = await checkIfPasswordResetTokenMatches({
      resetToken,
    })
    if (!matchingResetToken) {
      throw new Error('Password reset token is invalid.')
    }

    const hash = await encryptPassword({ password })
    const updateSuccess = await updatePassword(hash, resetToken)
    if (!updateSuccess) {
      throw new Error('Unknown error in resetting password.')
    }

    res.json({
      status: 'Update password success.',
      error: null,
      success: true,
    } as ContractResponse)
  } catch (error) {
    logger.info(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const sendCreateUserResponse = async (_: Request, res: Response) => {
  logger.info('In sendCreateUserResponse middleware.')
  const { username, userId } = res.locals

  try {
    const resBody: ContractCreateUser = {
      username,
      userId,
      success: true,
      status: 'Successfully created new user',
      error: null,
    }

    res.status(200).json(resBody)
  } catch (e) {
    logger.error(e)
    res.json(generateGenericErrorResponse(e))
  }
}

export const processLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('In processLogIn middleware.')
  const { username, password } = req.body
  try {
    const rows = await getUsers({ username })
    if (rows.length === 0) {
      throw new Error(
        'Username or password does not match that of an existing user'
      )
    }

    const { passwordHash, id, confirmed } = rows[0]

    const authorized = await bcrypt.compare(password, passwordHash)
    if (!authorized) {
      throw new Error(
        'Username or password does not match that of an existing user'
      )
    }

    res.locals.confirmed = confirmed
    res.locals.username = username
    res.locals.userId = id

    next()
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const sendLogInResponse = (_: Request, res: Response) => {
  logger.info('In sendLogInResponse middleware.')

  const { username, userId, confirmed } = res.locals

  const body: ContractLogin = {
    success: true,
    status: 'Successfully logged in',
    error: null,
    username,
    userId,
    confirmed,
  }
  res.json(body)
}

export const getUserId = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('In getUserId middleware.')

  const { updatedToken } = res.locals
  try {
    const { id: userId }: DBUser = await getUserFromUserAccessToken({
      token: updatedToken,
    })

    res.locals.userId = userId

    next()
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const processForgotPassword = async (req: Request, res: Response) => {
  const { email: username } = req.body
  logger.info('In processForgotPassword middleware.')

  try {
    const matchingUsers: DBUser[] = await getUsers({ username })

    if (matchingUsers.length === 1) {
      const resetToken = uuid()

      await addPasswordResetTokenToUser({
        username,
        passwordResetToken: resetToken,
      })
      await sendForgotPasswordEmail(username, resetToken)
    }

    const body: ContractResponse = {
      status: 'If username exists, password reset link will be sent to email.',
      error: null,
      success: true,
    }

    res.json(body)
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const checkIfVerifiedAccount = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug('In checkIfVerifiedAccount middleware.')
  const { userId } = res.locals
  try {
    const verified: boolean = await dbCheckIfUserVerified({ id: userId })

    if (verified) {
      next()
    } else {
      res.status(400).json({
        success: false,
        status: 'User has not been verified through email.',
        error: null,
      })
    }
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug('In deleteAccount middleware.')

  const { username } = req.body

  try {
    await deleteUserByUsername(username)
    logger.info(`User ${username} successfully deleted.`)

    const body: ContractResponse = {
      status: `User ${username} successfully deleted.`,
      error: null,
      success: true,
    }

    res.json(body)
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const confirmUserBypass = async (req: Request, res: Response) => {
  logger.debug('In confirmUserBypass middleware.')
  try {
    const { username } = req.body
    await confirmUserBypassDB(username)

    const body: ContractResponse = {
      status: `User ${username} successfully deleted.`,
      error: null,
      success: true,
    }

    res.json(body)
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}
