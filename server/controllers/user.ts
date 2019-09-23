import { Router } from 'express'
import {
  createUser,
  sendEmptyResponse,
  addAuthToken,
  processLogIn,
  sendLogInResponse,
  checkDeleteAuthToken,
  sendCreateUserResponse,
  getUserId,
} from '../middleware'
import { sendMail } from '../email/mailer'

export const user = Router()

user.post(
  '/create',
  createUser,
  addAuthToken,
  getUserId,
  sendMail,
  sendCreateUserResponse
)

user.post('/login', processLogIn, addAuthToken, sendLogInResponse)

user.post('/logout', checkDeleteAuthToken, sendEmptyResponse)
