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
} from '../database/users'
import { encryptPassword } from '../utils'
import { ContractResponse } from '.'
import { sendSignUpEmail } from '../email/mailer'

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
