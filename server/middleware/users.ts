import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { getUsers, insertUser, DBUser, getUserByToken } from '../database/users'
import { encryptPassword } from '../utils'
import { ContractResponse } from '.'

export interface ContractLogin extends ContractResponse {
  username: string
  userId: number
}

export interface ContractCreateUser extends ContractLogin {}

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
    await insertUser({ username, passwordHash: hash })

    next()

    res.locals.username = username
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

    const { passwordHash, id } = rows[0]
    const authorized = await bcrypt.compare(password, passwordHash)
    if (!authorized) {
      throw 'Username or password does not match that of an existing user'
    }

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
  const { username, userId } = res.locals

  const body: ContractLogin = {
    success: true,
    status: 'Successfully logged in',
    error: null,
    username,
    userId,
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
