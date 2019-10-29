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
  confirmUser,
  processForgotPassword,
} from '../middleware'

export const user = Router()

user.post(
  '/create',
  createUser,
  addAuthToken,
  getUserId,
  sendCreateUserResponse
)

user.post('/login', processLogIn, addAuthToken, sendLogInResponse)

user.post('/logout', checkDeleteAuthToken, sendEmptyResponse)

user.post('/password/forgot', processForgotPassword)

user.get('/confirm/:confirmationString', confirmUser)
