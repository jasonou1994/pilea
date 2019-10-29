import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
//@ts-ignore
import uuid from 'uuidv4'
import {
  getUsers,
  insertUser,
  DBUser,
  getUserByToken,
  confirmUserDB,
  dbCheckIfUserVerified,
  addPasswordResetTokenToUser,
} from '../database/users'
import { encryptPassword } from '../utils'
import { ContractResponse } from '.'
import { sendSignUpEmail, sendForgotPasswordEmail } from './mailer'

export interface ContractLogin extends ContractResponse {
  username: string
  userId: number
  confirmed: boolean
}

export interface ContractCreateUser extends ContractResponse {
  username: string
  userId: number
}

export const confirmUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await confirmUserDB(req.params.confirmationString)

    res.redirect('http://localhost:8000/confirmed')
  } catch (e) {
    res.json({ error: 'Unable to confirm user.' })
  }
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body

  try {
    const rows = await getUsers({ username })
    if (rows.length > 0) {
      throw 'Username already exists in database.'
    }

    const hash = await encryptPassword({ password })

    const confirmationString = uuid()

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
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

export const sendCreateUserResponse = async (_: Request, res: Response) => {
  const { username, userId } = res.locals

  const resBody: ContractCreateUser = {
    username,
    userId,
    success: true,
    status: 'Successfully created new user',
    error: null,
  }

  res.status(200).json(resBody)
}

export const processLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('In processLogIn')
  const { username, password } = req.body

  try {
    const rows = await getUsers({ username })
    if (rows.length === 0) {
      throw 'Username or password does not match that of an existing user'
    }

    const { passwordHash, id, confirmed } = rows[0]

    console.log(id, confirmed)

    const authorized = await bcrypt.compare(password, passwordHash)
    if (!authorized) {
      throw 'Username or password does not match that of an existing user'
    }

    res.locals.confirmed = confirmed
    res.locals.username = username
    res.locals.userId = id

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

export const sendLogInResponse = (_: Request, res: Response) => {
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
  const { updatedToken } = res.locals
  try {
    const { id: userId }: DBUser = await getUserByToken({
      token: updatedToken,
    })

    res.locals.userId = userId

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

export const processForgotPassword = async (req: Request, res: Response) => {
  const { username } = req.body

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
      status: '',
      error: null,
      success: true,
    }
    res.json(body)
  } catch (error) {
    console.error(error)
    const body: ContractResponse = {
      status: 'Error generating forgot password email.',
      error: error.message,
      success: false,
    }
    res.status(500).json(body)
  }

  // check if username exists

  // if so, add password reset token in db
  // send out same token in an email
  // generic response to user
}

export const checkIfVerifiedAccount = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
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
    res.status(500).json({ error })
  }
}
